const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// ✅ 获取商家菜单（基于 restaurant_id）
router.get("/menu", async (req, res) => {
    try {
        const { restaurant_id } = req.query;  // 🆕 获取前端传过来的 restaurant_id
        
        if (!restaurant_id) {
            return res.status(400).json({ error: "Missing restaurant_id" });
        }

        console.log("📡 [DEBUG] Fetching menu for restaurant_id:", restaurant_id);
        const result = await pool.query(
            "SELECT * FROM foods WHERE restaurant_id = $1",
            [restaurant_id]
        );

        console.log("✅ [DEBUG] Fetched menu:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ [ERROR] Failed to fetch menu:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ✅ 添加新菜品
router.post("/menu", async (req, res) => {
    try {
        const { restaurant_id, name, description, price, image } = req.body;  // 🆕 让前端传递 restaurant_id
        
        if (!restaurant_id) {
            return res.status(400).json({ error: "Missing restaurant_id" });
        }

        console.log("📡 [DEBUG] Inserting new food:", { restaurant_id, name, description, price, image });

        const result = await pool.query(
            "INSERT INTO foods (restaurant_id, name, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [restaurant_id, name, description, price, image]
        );

        console.log("✅ [DEBUG] Inserted food:", result.rows[0]);
        res.json(result.rows[0]);

    } catch (error) {
        console.error("❌ [ERROR] Failed to add food item:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});


// ✅ 更新菜品
router.put("/menu/:id", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const vendor_id = req.user?.id || 1;
        const food_id = req.params.id;

        const result = await pool.query(
            "UPDATE public.foods SET name=$1, description=$2, price=$3, image=$4 WHERE id=$5 AND restaurant_id=$6 RETURNING *",
            [name, description, price, image, food_id, vendor_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ 删除菜品
router.delete("/menu/:id", async (req, res) => {
    try {
        const vendor_id = req.user?.id || 1;
        const food_id = req.params.id;

        const result = await pool.query(
            "DELETE FROM public.foods WHERE id=$1 AND restaurant_id=$2 RETURNING *",
            [food_id, vendor_id]
        );

        res.json({ message: "Food item deleted" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
