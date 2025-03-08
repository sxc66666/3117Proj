import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import OrderSummary from "../components/OrderSummary";
import { menuLinksCust } from "../config/config";
import FooterCust from "../components/FooterCust";

export default function CustCheckout() {   
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, restaurantName, restaurantId, menuItems } = location.state || {};

    // 将 cart 对象转换为数组
    const selectedFoods = Object.entries(cart).map(([foodId, quantity]) => {
        const foodItem = menuItems.find(item => item.id === Number(foodId));
        return {
            id: foodId,
            name: foodItem ? foodItem.name : "Unknown",
            price: foodItem ? foodItem.price : 0,
            quantity,
            image: foodItem ? foodItem.image : "https://via.placeholder.com/50",
        };
    });

    // ✅ 处理订单提交
    const handleCheckout = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id) {
                alert("User not logged in");
                return;
            }

            const orderData = {
                user_id: user.id,
                restaurant_id: restaurantId,
                total_price: totalPrice,
                items: selectedFoods.map(item => ({
                    food_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post("http://localhost:5000/api/orders", orderData);
            console.log("✅ [DEBUG] Order placed:", response.data);

            navigate('/cust/complete', { state: { orderId: response.data.order_id, restaurantName } });
        } catch (error) {
            console.error("❌ [ERROR] Failed to submit order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

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
                onCheckout={handleCheckout}
                checkoutText="Complete"
            />
        </div>
    );
}
