import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import EditFoodPopup from "../components/EditFoodPopup";
import { menuLinksCust } from "../config/navbarConfig";

export default function VendorMenu() {
    const [menu, setMenu] = useState([]);  // 存储菜单
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);
    const [editingFood, setEditingFood] = useState(null); // 🆕 编辑菜品状态

    // ✅ 获取当前用户的 restaurantId
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
            console.log("📡 [DEBUG] Current user data:", user);
            setRestaurantId(user.id);
        } else {
            console.error("❌ [ERROR] No user data found.");
            setError("User not found");
        }
    }, []);

    // ✅ 获取菜单数据（当 restaurantId 变更时）
    useEffect(() => {
        if (!restaurantId) return; // 只有在 restaurantId 存在时才获取数据

        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/api/vendor/menu?restaurant_id=${restaurantId}`);
                console.log("📡 [DEBUG] Fetched menu:", response.data);
                setMenu(response.data);
            } catch (err) {
                console.error("❌ [ERROR] Failed to fetch menu:", err.response);
                setError("Failed to load menu");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [restaurantId]);

    // ✅ 添加新菜品
    const handleAddNewFood = async () => {
        if (!restaurantId) {
            console.error("❌ [ERROR] No restaurant ID found.");
            return;
        }

        const newFood = {
            restaurant_id: restaurantId,
            name: "New Dish",
            description: "Delicious new item",
            price: 10.99,
            image: "https://via.placeholder.com/150",  // 默认图片
        };

        try {
            console.log("📡 [DEBUG] Adding new food:", newFood);
            const response = await axiosInstance.post("/api/vendor/menu", newFood);
            console.log("✅ [DEBUG] New food added:", response.data);
            setMenu((prevMenu) => [...prevMenu, response.data]);  // 更新菜单
        } catch (err) {
            console.error("❌ [ERROR] Failed to add new food:", err.response);
        }
    };

    // ✅ 编辑菜品（弹出编辑窗口）
    const handleEditFood = (food) => {
        setEditingFood(food);
    };

    // ✅ 保存编辑后的菜品
    const handleSaveFood = async (updatedFood) => {
        try {
            console.log("📡 [DEBUG] Updating food:", updatedFood);
            const response = await axiosInstance.put(`/api/vendor/menu/${updatedFood.id}`, updatedFood);
            console.log("✅ [DEBUG] Food updated:", response.data);

            // 更新菜单
            setMenu((prevMenu) =>
                prevMenu.map((item) => (item.id === updatedFood.id ? { ...item, ...response.data } : item))
            );

            setEditingFood(null); // 关闭弹窗
        } catch (err) {
            console.error("❌ [ERROR] Failed to update food:", err.response);
        }
    };

    // ✅ 删除菜品
    const handleDeleteFood = async (foodId) => {
        try {
            console.log("📡 [DEBUG] Deleting food:", foodId);
            await axiosInstance.delete(`/api/vendor/menu/${foodId}?restaurantId=${restaurantId}`);
            console.log("✅ [DEBUG] Food deleted");
            setMenu((prevMenu) => prevMenu.filter((food) => food.id !== foodId));
        } catch (err) {
            console.error("❌ [ERROR] Failed to delete food:", err.response);
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

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <FoodList
                    foods={menu}
                    mode="vendor"
                    onEdit={handleEditFood}
                    onDelete={handleDeleteFood}
                />
            </CardContainer>

            {/* 🆕 渲染 EditFoodPopup，当 `editingFood` 存在时 */}
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
