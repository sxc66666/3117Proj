const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// 获取所有餐厅
router.get('/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.restaurants');
    console.log("Fetched restaurants:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: "Error fetching restaurants", details: err.message });
  }
});

// 获取指定餐厅的食品数据
router.get('/foods/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.foods WHERE restaurant_id = $1 and is_active = true', [restaurantId]);
    console.log("Fetched foods for restaurant:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: "Error fetching food data", details: err.message });
  }
});

module.exports = router; 