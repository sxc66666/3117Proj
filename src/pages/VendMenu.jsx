import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import EditFoodPopup from "../components/EditFoodPopup";
import { vendorMenuData } from "../data/mockData";
import { sampleImage } from "../data/mockData";
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [menu, setMenu] = useState(vendorMenuData);
    const [editingFood, setEditingFood] = useState(null);

    // 🛠 编辑菜品（弹出编辑窗口）
    const handleEditFood = (food) => {
        setEditingFood(food);
    };

    // 🛠 保存编辑后的菜品
    const handleSaveFood = (updatedFood) => {
        setMenu(menu.map(item => item.id === updatedFood.id ? updatedFood : item));
        setEditingFood(null); // 关闭弹窗
    };

    // 🛠 删除菜品
    const handleDeleteFood = (foodId) => {
        setMenu(menu.filter(food => food.id !== foodId));
    };

    // 🛠 新增菜品
    const handleAddNewFood = () => {
        const newFood = {
            id: Date.now(),
            name: "New Dish",
            description: "Delicious new item",
            price: 10.99,
            image: sampleImage,
        };
        setMenu([...menu, newFood]);
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
