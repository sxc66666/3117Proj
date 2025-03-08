const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ 顾客下单
router.post("/", async (req, res) => {
    try {
        const { user_id, restaurant_id, total_price, items } = req.body;

        if (!user_id || !restaurant_id || !total_price || !items.length) {
            return res.status(400).json({ error: "Invalid order data" });
        }

        // ✅ 创建订单
        const orderResult = await pool.query(
            "INSERT INTO orders (restaurant_id, user_id, total_price) VALUES ($1, $2, $3) RETURNING id",
            [restaurant_id, user_id, total_price]
        );

        const orderId = orderResult.rows[0].id;

        // ✅ 插入订单项
        const orderItemsPromises = items.map(item =>
            pool.query(
                "INSERT INTO order_items (order_id, food_id, quantity) VALUES ($1, $2, $3)",
                [orderId, item.food_id, item.quantity]
            )
        );
        await Promise.all(orderItemsPromises);

        res.json({ order_id: orderId });
    } catch (error) {
        console.error("❌ [ERROR] Failed to place order:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ✅ 获取商家的订单
router.get("/vendor/:restaurant_id", async (req, res) => {
    try {
        const { restaurant_id } = req.params;

        const orders = await pool.query(
            `SELECT o.id, o.total_price, o.created_at, u.nick_name AS customer_name
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.restaurant_id = $1
             ORDER BY o.created_at DESC`,
            [restaurant_id]
        );

        res.json(orders.rows);
    } catch (error) {
        console.error("❌ [ERROR] Failed to fetch vendor orders:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ✅ 获取顾客的订单
router.get("/customer/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const orders = await pool.query(
            `SELECT o.id, o.total_price, o.created_at, r.name AS restaurant_name
             FROM orders o
             JOIN restaurants r ON o.restaurant_id = r.id
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [user_id]
        );

        res.json(orders.rows);
    } catch (error) {
        console.error("❌ [ERROR] Failed to fetch customer orders:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

module.exports = router;
