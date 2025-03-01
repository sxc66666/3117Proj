import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import OrderSummary from "../components/OrderSummary";
import { menuLinksCust } from "../config/config";
import FooterCust from "../components/FooterCust";

export default function CustCheckout() {   
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, restaurantName, menuItems } = location.state || {};

    // 将 cart 对象转换为数组，方便传递给 OrderSummary 组件
    const selectedFoods = Object.entries(cart).map(([foodId, quantity]) => {
        const foodItem = menuItems.find(item => item.id === Number(foodId)); // 找到对应的商品信息
        return {
            id: foodId,  // 保持 id 的一致性
            name: foodItem ? foodItem.name : "Unknown",  // 确保 name 存在
            price: foodItem ? foodItem.price : 0,  // 避免 NaN
            quantity,
            image: foodItem ? foodItem.image : "https://via.placeholder.com/50",  // 如果没有图片，提供占位图
        };
    });
    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainerCust
                steps={[
                    { label: 'Choose restaurant', completed: true },
                    { label: 'Order food', completed: true },
                    { label: 'Checkout', completed: true },
                    { label: 'Complete', completed: false },
                ]}
            >
                <OrderSummary selectedFoods={selectedFoods} totalPrice={totalPrice} restaurantName={restaurantName} />
            </CardContainerCust>
            <FooterCust
                restaurantName={restaurantName}
                totalPrice={totalPrice}
                onBack={() => navigate(-1)}
                onCheckout={() => navigate('/cust/complete')}
                checkoutText="Complete"
            />
        </div>
    );
}
