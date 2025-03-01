import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import FoodList from "../components/FoodList";
import { foodData } from "../data/mockData";
import { menuLinksCust } from "../config/config";
import FooterCust from "../components/FooterCust";

export default function CustMenu() {    
    const navigate = useNavigate();
    const restaurantName = "Pizza Hut"; // 假设当前餐厅

    // 🛒 购物车状态：存储 { foodId: quantity }
    const [cart, setCart] = useState({});

    // 监听 FoodList 中数量变化
    const handleQuantityChange = (foodId, quantity) => {
        setCart((prevCart) => ({
            ...prevCart,
            [foodId]: quantity > 0 ? quantity : 0, // 确保数量不会变负数
        }));
    };

    // 计算总价
    const totalPrice = Object.entries(cart).reduce((sum, [foodId, quantity]) => {
        const foodItem = foodData.find((food) => food.id === Number(foodId));
        return sum + (foodItem ? foodItem.price * quantity : 0);
    }, 0);

    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainerCust
                steps={[
                    { label: 'Choose restaurant', completed: true },
                    { label: 'Order food', completed: true },
                    { label: 'Checkout', completed: false },
                    { label: 'Complete', completed: false },
                ]}
            >
                <FoodList
                    foods={foodData}
                    mode="customer"
                    onChange={handleQuantityChange} // 传递回调
                />
            </CardContainerCust>
            <FooterCust
                restaurantName={restaurantName}
                totalPrice={totalPrice} // 实时计算总价
                onBack={() => navigate(-1)}
                onCheckout={() => navigate('/cust/checkout')}
                checkoutText="Checkout"
            />
        </div>
    );
}
