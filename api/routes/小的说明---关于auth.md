明白！我会尽量**最小化修改**你的数据库结构，只添加**必要的字段**，以确保商家账户正确绑定 `restaurant_id`，不会影响你的其他代码逻辑。

---

## **✅ 解决方案**
**你的主要问题：**
- **`restaurants` 表没有 `owner_id`**，无法判断哪个用户属于哪个餐厅。
- **商家用户登录时，无法获取 `restaurant_id`**，导致前端加载菜单失败。

### **1️⃣ 只添加 `owner_id`（商家 ID）**
**📌 仅修改 `restaurants` 表，添加 `owner_id` 字段**
```sql
ALTER TABLE restaurants ADD COLUMN owner_id INT REFERENCES users(id);
```
✅ **这不会影响你的现有数据，但可以正确关联商家和餐厅**。

---

### **2️⃣ 确保 `restaurants` 表正确存储 `owner_id`**
**📌 让 `restaurants` 绑定到 `users`**
```sql
-- ✅ 让 `Pizza Hut` 绑定 `vendor1`
UPDATE restaurants 
SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor1') 
WHERE name = 'Pizza Hut';

-- ✅ 让 `Sushi Express` 绑定 `vendor2`
UPDATE restaurants 
SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor2') 
WHERE name = 'Sushi Express';

-- ✅ 让 `Burger King` 绑定 `vendor3`
UPDATE restaurants 
SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor3') 
WHERE name = 'Burger King';
```
✅ **仅为 `restaurants` 添加 `owner_id`，不会改动其他数据！**

---

### **3️⃣ 修改后端 `auth.js`，让登录时返回 `restaurant_id`**
📍 **文件路径：** `api/routes/auth.js`
```javascript
router.post("/login", async (req, res) => {
    try {
        const { login_id, password } = req.body;
        
        // ✅ 获取用户信息
        const userResult = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid login ID" });
        }

        const user = userResult.rows[0];

        // ✅ 获取 `restaurant_id`（如果是商家）
        let restaurantId = null;
        if (user.type === "restaurant") {
            const restaurantResult = await pool.query(
                "SELECT id FROM restaurants WHERE owner_id = $1",
                [user.id]
            );
            if (restaurantResult.rows.length > 0) {
                restaurantId = restaurantResult.rows[0].id;
            }
        }

        // ✅ 发送到前端的数据
        const userData = {
            id: user.id,
            login_id: user.login_id,
            email: user.email,
            nick_name: user.nick_name,
            type: user.type,
            restaurant_id: restaurantId,  // 🔥 现在前端能拿到 `restaurant_id`
        };

        // ✅ 存储到 `localStorage`
        res.json({ user: userData });

    } catch (error) {
        console.error("❌ [ERROR] Login failed:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});
```
✅ **这样，每个商家登录时，会自动返回 `restaurant_id`，并存入 `localStorage`。**

---

### **4️⃣ 修改前端 `VendorMenu.jsx`，确保正确获取 `restaurant_id`**
📍 **文件路径：** `src/pages/VendorMenu.jsx`
```javascript
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";  
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [searchParams] = useSearchParams();
    const restaurantIdFromURL = searchParams.get("restaurant_id");
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("📡 [DEBUG] Current user data:", user);

        if (restaurantIdFromURL) {
            console.log("📡 [DEBUG] Using restaurant_id from URL:", restaurantIdFromURL);
            setRestaurantId(restaurantIdFromURL);
        } else if (user && user.restaurant_id) {
            console.log("📡 [DEBUG] Using restaurant_id from user data:", user.restaurant_id);
            setRestaurantId(user.restaurant_id);
        } else {
            setError("Unauthorized: No restaurant ID found");
            setLoading(false);
        }
    }, [restaurantIdFromURL]);

    useEffect(() => {
        if (!restaurantId) return;

        const fetchMenu = async () => {
            try {
                console.log("📡 [DEBUG] Fetching menu for restaurant_id:", restaurantId);
                const response = await axios.get(`http://localhost:9000/api/vendor/menu?restaurant_id=${restaurantId}`);
                console.log("✅ [DEBUG] API response:", response.data);
                setMenu(response.data);
            } catch (err) {
                console.error("❌ [ERROR] Failed to load menu:", err.response);
                setError(err.response?.data?.error || "Failed to load menu");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [restaurantId]);

    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainer>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manage Menu</h1>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <FoodList
                    foods={menu}
                    mode="vendor"
                    onEdit={(food) => console.log("Edit:", food)}
                    onDelete={(foodId) => setMenu(menu.filter(food => food.id !== foodId))}
                />
            </CardContainer>
        </div>
    );
}
```
✅ **这样，如果 `restaurant_id` 来自 URL，或者登录用户有 `restaurant_id`，就能正确加载商家菜单！**

---

## **🚀 最终测试**
1️⃣ **运行数据库修改**
```bash
psql -U postgres -d food_ordering_system -c "ALTER TABLE restaurants ADD COLUMN owner_id INT REFERENCES users(id);"
```
```bash
psql -U postgres -d food_ordering_system -c "UPDATE restaurants SET owner_id = (SELECT id FROM users WHERE login_id='vendor1') WHERE name='Pizza Hut';"
```

2️⃣ **清除 `localStorage`（防止缓存问题）**
```javascript
localStorage.clear();
```

3️⃣ **重新登录商家账户**

4️⃣ **打开 `console.log(localStorage.getItem("user"))`**
✅ **确保 `restaurant_id` 存在**

5️⃣ **访问 `http://localhost:3001/vend/menu/?restaurant_id=1`**
✅ **确保 `Pizza Hut` 的菜单正确加载**

---

## **🎯 结果**
✅ **数据库不会受影响，只是添加 `owner_id`** 🎉  
✅ **商家登录后能正确获取 `restaurant_id`** 🎉  
✅ **前端 `GET /api/vendor/menu?restaurant_id=X` 只加载当前商家的菜单** 🎉  
✅ **`Unauthorized: No restaurant ID found` 错误消失** 🎉  

如果仍有问题，**请截图 `console.log(localStorage.getItem("user"))` 输出结果，我会继续帮你！🚀🔥**