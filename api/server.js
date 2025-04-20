const fs = require('fs');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); // 引入现有的 app.js

// 加载 HTTPS 证书
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/fullchain.pem')),
};

// 从 .env 文件中读取端口
const PORT = process.env.PORT || 5000;

// 启动 HTTPS 服务
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server is running at https://localhost:${PORT}`);
});