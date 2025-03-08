import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import EditFoodPopup from "../components/EditFoodPopup";
import { vendorMenuData } from "../data/mockData";
import { sampleImage } from "../data/mockData";
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [menu, setMenu] = useState(vendorMenuData);  // ✅ 先使用 mockData
    const [editingFood, setEditingFood] = useState(null);
    const [newFood, setNewFood] = useState({ name: "", description: "", price: "", image: "" });  // ✅ 用于存储用户输入
    const [isAdding, setIsAdding] = useState(false); // ✅ 控制新增弹窗的显示

    // ✅ 获取数据库中的菜单（覆盖 mockData）
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                console.log("📡 [DEBUG] Fetching menu from backend...");
                const response = await axios.get("http://localhost:5000/api/vendor/menu");
                console.log("✅ [DEBUG] API response:", response.data);
                setMenu(response.data);
            } catch (err) {
                console.error("❌ [ERROR] Failed to load menu:", err.response);
            }
        };
        fetchMenu();
    }, []);

    // ✅ 处理用户输入
    const handleInputChange = (e) => {
        setNewFood({ ...newFood, [e.target.name]: e.target.value });
    };

    // ✅ 提交新菜品
    const handleSubmitNewFood = async () => {
        if (!newFood.name || !newFood.price || !newFood.image) {
            alert("请填写完整的菜品信息！");
            return;
        }

        try {
            console.log("📡 [DEBUG] Sending request to add new food...", newFood);
            const response = await axios.post("http://localhost:5000/api/vendor/menu", newFood);
            console.log("✅ [DEBUG] Added food:", response.data);
            setMenu([...menu, response.data]);  // ✅ 更新菜单
            setNewFood({ name: "", description: "", price: "", image: "" }); // ✅ 清空表单
            setIsAdding(false); // ✅ 关闭弹窗
        } catch (err) {
            console.error("❌ [ERROR] Failed to add food:", err.response);
        }
    };

    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainer>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manage Menu</h1>
                    <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                        + Add New Dish
                    </button>
                </div>

                {/* 🆕 显示新增菜品输入框 */}
                {isAdding && (
                    <div className="p-4 bg-gray-100 rounded">
                        <h2 className="text-xl font-bold">Add New Dish</h2>
                        <input type="text" name="name" placeholder="Dish Name" value={newFood.name} onChange={handleInputChange} className="block w-full p-2 border mb-2"/>
                        <input type="text" name="description" placeholder="Description" value={newFood.description} onChange={handleInputChange} className="block w-full p-2 border mb-2"/>
                        <input type="number" name="price" placeholder="Price" value={newFood.price} onChange={handleInputChange} className="block w-full p-2 border mb-2"/>
                        <input type="text" name="image" placeholder="Image URL" value={newFood.image} onChange={handleInputChange} className="block w-full p-2 border mb-2"/>
                        <button className="btn btn-success mr-2" onClick={handleSubmitNewFood}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                )}

                {/* 渲染菜品列表 */}
                <FoodList
                    foods={menu}
                    mode="vendor"
                    onEdit={setEditingFood}
                    onDelete={(foodId) => setMenu(menu.filter(food => food.id !== foodId))}
                />
            </CardContainer>

            {/* 编辑弹窗 */}
            {editingFood && (
                <EditFoodPopup
                    food={editingFood}
                    onSave={(updatedFood) => {
                        setMenu(menu.map(item => item.id === updatedFood.id ? updatedFood : item));
                        setEditingFood(null);
                    }}
                    onClose={() => setEditingFood(null)}
                />
            )}
        </div>
    );
}
