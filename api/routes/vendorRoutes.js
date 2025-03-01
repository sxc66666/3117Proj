const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// ✅ 获取商家所有菜品
router.get("/menu", async (req, res) => {
    try {
        const vendor_id = req.user?.id || 1;
        const result = await pool.query("SELECT * FROM public.foods WHERE restaurant_id = $1", [vendor_id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ 添加新菜品
router.post("/menu", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const vendor_id = req.user?.id || 1;

        const result = await pool.query(
            "INSERT INTO public.foods (restaurant_id, name, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [vendor_id, name, description, price, image]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
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
