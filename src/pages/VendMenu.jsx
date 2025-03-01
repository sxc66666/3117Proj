import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import EditFoodPopup from "../components/EditFoodPopup";
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [menu, setMenu] = useState([]);  // 菜单从数据库获取
    const [editingFood, setEditingFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ 加载商家菜单（数据库）
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                console.log("📡 [DEBUG] Fetching menu from backend...");
                const response = await axios.get("http://localhost:9000/api/vendor/menu");
    
                console.log("✅ [DEBUG] API response:", response.data);
                setMenu(response.data);  // 更新状态
    
            } catch (err) {
                console.error("❌ [ERROR] Failed to load menu:", err.response);
                setError(err.response?.data?.error || "Failed to load menu");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // ✅ 🛠 编辑菜品
    const handleEditFood = (food) => {
        setEditingFood(food);
    };

    // ✅ 🛠 保存编辑后的菜品（更新数据库）
    const handleSaveFood = async (updatedFood) => {
        try {
            const response = await axios.put(
                `http://localhost:9000/api/vendor/menu/${updatedFood.id}`,
                updatedFood
            );
            setMenu(menu.map(item => item.id === updatedFood.id ? response.data : item));
        } catch (err) {
            setError("Failed to update food item");
        }
        setEditingFood(null); // 关闭弹窗
    };

    // ✅ 🛠 删除菜品（从数据库删除）
    const handleDeleteFood = async (foodId) => {
        try {
            await axios.delete(`http://localhost:9000/api/vendor/menu/${foodId}`);
            setMenu(menu.filter(food => food.id !== foodId));
        } catch (err) {
            setError("Failed to delete food item");
        }
    };

    // ✅ 🛠 新增菜品（添加到数据库）
    const handleAddNewFood = async () => {
        const newFood = {
            name: "New Dish",
            description: "Delicious new item",
            price: 10.99,
            image: "https://via.placeholder.com/150?text=New+Dish",  // 🔥 替换成有效的图片链接
        };
    
        try {
            console.log("📡 [DEBUG] Sending request to add new food...");
            const response = await axios.post("http://localhost:9000/api/vendor/menu", newFood);
    
            console.log("✅ [DEBUG] Added food:", response.data);
            setMenu([...menu, response.data]);  // 🔥 确保菜单状态更新
    
        } catch (err) {
            console.error("❌ [ERROR] Failed to add food:", err.response);
            setError("Failed to add new food item");
        }
    };
    
    
    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainer>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manage Menu</h1>
                    <button className="btn btn-primary" onClick={handleAddNewFood}>
                        + Add New Dish
                    </button>
                </div>

                {/* 加载状态 */}
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <FoodList
                    foods={menu}
                    mode="vendor"
                    onEdit={handleEditFood}
                    onDelete={handleDeleteFood}
                />
            </CardContainer>

            {/* 🆕 渲染 EditFoodPopup */}
            {editingFood && (
                <EditFoodPopup
                    food={editingFood}
                    onSave={handleSaveFood}
                    onClose={() => setEditingFood(null)}
                />
            )}
        </div>
    );
}
