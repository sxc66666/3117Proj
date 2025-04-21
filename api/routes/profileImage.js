const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { fromFile } = require('file-type');
const pool = require("../db/db");
const { console } = require('inspector');

const router = express.Router();

// 加载 .env 配置
require('dotenv').config();
const DOMAIN = process.env.DOMAIN || 'localhost';
const PORT = process.env.PORT || '5000';
const DEFAULT_AVATAR_URL = 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = uuidv4() + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 限制
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) cb(null, true);
    else cb(new Error('Only .jpg, .jpeg, .png, and .webp files are allowed'));
  }
});

// 上传头像接口
router.post('/upload', upload.single('profile_image'), async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    // 检查数据库中是否已有头像 URL
    const existingImageResult = await pool.query('SELECT profile_image FROM users WHERE id = $1', [userId]);
    if (existingImageResult.rowCount > 0) {
      const existingImageUrl = existingImageResult.rows[0].profile_image;

      if (existingImageUrl) {
        const existingFilename = path.basename(existingImageUrl);
        const existingFilePath = path.join(UPLOAD_DIR, existingFilename);

        // 尝试删除旧文件
        if (fs.existsSync(existingFilePath)) {
          fs.unlinkSync(existingFilePath);
        }
      }
    }

    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path
    const fileType = await fromFile(req.file.path);
    if (!fileType || !['image/jpeg', 'image/png', 'image/webp'].includes(fileType.mime)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const filename = path.basename(filePath);
    console.log('Uploaded file:', filename);
    const url = `https://${DOMAIN}:${PORT}/api/uploads/${filename}`;

    const result = await pool.query(
      'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING type',
      [url, userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    // 如果用户类型是餐厅，更新餐厅表中的图片
    if (result.rows[0].type === 'restaurant') {
      await pool.query(
        'UPDATE restaurants SET image = $1 WHERE id = $2',
        [url, userId]
      );
    }

    res.status(200).json({ message: 'Profile image uploaded successfully', url });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取头像 URL 接口
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const result = await pool.query('SELECT profile_image FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const url = result.rows[0].profile_image;

    // 没上传头像 → 返回默认图片 URL
    if (!url) {
      return res.status(200).json({ url: DEFAULT_AVATAR_URL });
    }

    res.status(200).json({ url });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
