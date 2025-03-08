import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import EditFoodPopup from "../components/EditFoodPopup";  // 🆕 引入编辑组件
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [searchParams] = useSearchParams();
    const restaurantIdFromURL = searchParams.get("restaurant_id");
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);
    const [editingFood, setEditingFood] = useState(null); // 🆕 编辑菜品状态

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("📡 [DEBUG] Current user data:", user);

        if (restaurantIdFromURL) {
            console.log("📡 [DEBUG] Using restaurant_id from URL:", restaurantIdFromURL);
            setRestaurantId(restaurantIdFromURL);
        } else if (user && user.restaurant_id) {
            console.log("📡 [DEBUG] Using restaurant_id from localStorage:", user.restaurant_id);
            setRestaurantId(user.restaurant_id);
        } else if (user && user.id) {
            console.log("📡 [DEBUG] Fetching restaurant_id from backend...");
            axios.get(`http://localhost:9000/api/vendor/getRestaurantId?user_id=${user.id}`)
                .then(response => {
                    console.log("📡 [DEBUG] Retrieved restaurant_id from backend:", response.data.restaurant_id);
                    setRestaurantId(response.data.restaurant_id);
                })
                .catch(err => {
                    console.error("❌ [ERROR] Failed to fetch restaurant_id:", err.response);
                    setError("Unauthorized: No restaurant ID found");
                    setLoading(false);
                });
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
            const response = await axios.post("http://localhost:9000/api/vendor/menu", newFood);
            console.log("✅ [DEBUG] New food added:", response.data);
            setMenu([...menu, response.data]);  // 更新菜单
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
            const response = await axios.put(`http://localhost:9000/api/vendor/menu/${updatedFood.id}`, updatedFood);
            console.log("✅ [DEBUG] Food updated:", response.data);

            setMenu(menu.map(item => item.id === updatedFood.id ? response.data : item));
            setEditingFood(null); // 关闭弹窗
        } catch (err) {
            console.error("❌ [ERROR] Failed to update food:", err.response);
        }
    };

    // ✅ 删除菜品
    const handleDeleteFood = async (foodId) => {
        try {
            console.log("📡 [DEBUG] Deleting food:", foodId);
            await axios.delete(`http://localhost:9000/api/vendor/menu/${foodId}`);
            console.log("✅ [DEBUG] Food deleted");
            setMenu(menu.filter(food => food.id !== foodId));
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
