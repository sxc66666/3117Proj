// 用token内userid替换现有读取id逻辑    Done
// 去掉读取前端直接返回id逻辑           Done

const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Validators
const validate = require('../middleware/validate');
const orderSchema = require('../validators/orderSchema');

// Authorize
const authorize = require('../middleware/authorize');

// ✅ 顾客下单
// 顾客下单
router.post("/", validate(orderSchema), authorize(['consumer']), async (req, res) => {
    try {
        const { restaurant_id, total_price, items } = req.body;
        console.log("Received order data:", req.body);  // 打印接收到的数据

        // 以弃用 将使用express-validator进行数据验证
        // // 数据验证
        // if (!user_id || !restaurant_id || !total_price || !items || items.length === 0) {
        //     return res.status(400).json({ error: "Invalid order data" });
        // }

        // 使用token读取id
        const idFromToken = req.user.id;

        // 验证 user_id 是否存在
        const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [idFromToken]);
        if (userResult.rows.length === 0) {
            console.error("❌ [ERROR] Invalid user_id:", idFromToken);
            return res.status(400).json({ error: "Invalid user_id" });
        }

        // 创建订单
        const orderResult = await pool.query(
            "INSERT INTO orders (restaurant_id, user_id, total_price) VALUES ($1, $2, $3) RETURNING id",
            [restaurant_id, idFromToken, total_price]
        );

        const orderId = orderResult.rows[0].id;
        console.log("Created order with ID:", orderId);

        // 插入订单项
        const orderItemsPromises = items.map(item =>
            pool.query(
                "INSERT INTO order_items (order_id, food_id, quantity) VALUES ($1, $2, $3)",
                [orderId, item.food_id, item.quantity]
            )
        );
        await Promise.all(orderItemsPromises);

        // 获取商家名称
        const restaurantResult = await pool.query("SELECT name FROM restaurants WHERE id = $1", [restaurant_id]);
        const restaurantName = restaurantResult.rows[0].name;

        // 返回成功信息及订单 ID
        res.json({ order_id: orderId, restaurant_name: restaurantName});
    } catch (error) {
        console.error("❌ [ERROR] Failed to place order:", error);
        console.error("❌ [ERROR] Error details:", error.message, error.stack);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const idFromToken = req.user.id;

        // 查询用户类型
        const user = await pool.query("SELECT type FROM users WHERE id = $1", [idFromToken]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        let ordersResult;
        if (user.rows[0].type === "consumer") {
            // 查询顾客的订单
            ordersResult = await pool.query(
                `SELECT o.id, o.total_price, o.created_at, r.name AS restaurant_name
                 FROM orders o
                 JOIN restaurants r ON o.restaurant_id = r.id
                 WHERE o.user_id = $1
                 ORDER BY o.created_at DESC`,
                [idFromToken]
            );
        } else if (user.rows[0].type === "restaurant") {
            // 查询商家的订单
            ordersResult = await pool.query(
                `SELECT o.id, o.total_price, o.created_at, u.nick_name AS customer_name
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 WHERE o.restaurant_id = $1
                 ORDER BY o.created_at DESC`,
                [idFromToken]
            );
        } else {
            return res.status(400).json({ error: "Unknown user type" });
        }

        const orders = ordersResult.rows;
        if (orders.length === 0) {
            return res.json([]); // 没有订单直接返回空数组
        }

        // 提取所有 order_id
        const orderIds = orders.map(order => order.id);

        // 查询所有订单的 items
        const itemsResult = await pool.query(
            `SELECT oi.order_id, f.name, oi.quantity, f.price
             FROM order_items oi
             JOIN foods f ON oi.food_id = f.id
             WHERE oi.order_id = ANY($1::int[])`,
            [orderIds]
        );

        // 构建 order_id -> items 的映射
        const itemsMap = {};
        itemsResult.rows.forEach(item => {
            if (!itemsMap[item.order_id]) {
                itemsMap[item.order_id] = [];
            }
            itemsMap[item.order_id].push({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            });
        });

        // 为每个订单添加 items 属性
        orders.forEach(order => {
            order.items = itemsMap[order.id] || [];
        });

        res.json(orders);
    } catch (error) {
        console.error("❌ [ERROR] Failed to fetch orders:", error.message);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});



module.exports = router;
