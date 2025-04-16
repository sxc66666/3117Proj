const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// ✅ 获取商家菜单（基于 restaurant_id）
router.get("/menu", async (req, res) => {
    try {
        const { restaurant_id } = req.query;  // 🆕 获取前端传过来的 restaurant_id

        // 使用token读取id
        const restaurantIdFromToken = req.user.id;
        
        if (!restaurant_id) {
            return res.status(400).json({ error: "Missing restaurant_id" });
        }

        console.log("📡 [DEBUG] Fetching menu for restaurant_id:", restaurant_id);
        const result = await pool.query(
            "SELECT * FROM foods WHERE restaurant_id = $1 and is_active = TRUE",
            [restaurantIdFromToken]
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
        
        // if (!restaurant_id) {
        //     return res.status(400).json({ error: "Missing restaurant_id" });
        // }

        // 使用token读取id
        const restaurantIdFromToken = req.user.id;

        console.log("📡 [DEBUG] Inserting new food:", { restaurant_id, name, description, price, image });

        const result = await pool.query(
            "INSERT INTO foods (restaurant_id, name, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [restaurantIdFromToken, name, description, price, image]
        );

        console.log("✅ [DEBUG] Inserted food:", result.rows[0]);
        res.json(result.rows[0]);

    } catch (error) {
        console.error("❌ [ERROR] Failed to add food item:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});


// ✅ 更新菜品(有安全问题，任何客户端都可以改别人的menu)
router.put("/menu/:id", async (req, res) => {
    try {
        const { name, description, price, image, id, restaurant_id } = req.body;
        console.log("📡 [DEBUG] Updating food:", req.body);

        // 使用token读取id
        const restaurantIdFromToken = req.user.id;

        const result = await pool.query(
            "UPDATE public.foods SET name=$1, description=$2, price=$3, image=$4 WHERE id=$5 AND restaurant_id=$6 RETURNING *",
            [name, description, price, image, id, restaurantIdFromToken]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ 删除菜品
router.delete("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;  // 从 URL 参数获取 id
        const { restaurantId } = req.query;  // 获取查询参数

        // 使用token读取id
        const restaurantIdFromToken = req.user.id;

        console.log("📡 [DEBUG] Del food:", { id, restaurantId});

        if (!id || !restaurantId) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        console.log("📡 [DEBUG] Deleting food item:", id);
        console.log("📡 [DEBUG] Deleting food item:", restaurantId);
        const result = await pool.query(
            "UPDATE public.foods SET is_active=FALSE WHERE id=$1 AND restaurant_id=$2 RETURNING *",
            [id, restaurantIdFromToken]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Food item not found or already deleted" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// 怀疑没有使用过 待检查后删除
router.get("/getRestaurantId", async (req, res) => {
    const { user_id } = req.query;

    // 使用token读取id
    const restaurantIdFromToken = req.user.id;

    if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
    }

    try {
        console.log("📡 [DEBUG] Fetching restaurant_id for user_id:", user_id);
        
        const result = await pool.query("SELECT id FROM restaurants WHERE owner_id = $1", [restaurantIdFromToken]);

        if (result.rows.length === 0) {
            console.log("❌ [ERROR] No restaurant found for user_id:", user_id);
            return res.status(404).json({ error: "No restaurant found for this user" });
        }

        console.log("✅ [DEBUG] Found restaurant_id:", result.rows[0].id);
        res.json({ restaurant_id: result.rows[0].id });
    } catch (error) {
        console.error("❌ [ERROR] Failed to fetch restaurant_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
