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
    console.log(location.state);
    const { cart, totalPrice, restaurantName, restaurantId, menuItems } = location.state || {};

    // Ensure restaurantId is defined
    if (!restaurantId) {
        console.error("❌ [ERROR] restaurantId is undefined");
        alert("Restaurant ID is missing. Please go back and select a restaurant.");
        navigate(-1);
        return null;
    }

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

            // Log user_id to verify it is correctly retrieved
            console.log('User ID:', user.id);

            // Log restaurantId to verify it is correctly passed
            console.log('Restaurant ID:', restaurantId);
    
            const orderData = {
                user_id: user.id,
                restaurant_id: Number(restaurantId),  // Ensure this is included in the payload as a number
                total_price: totalPrice,
                items: selectedFoods.map(item => ({
                    food_id: Number(item.id),  // Make sure food_id is a number
                    quantity: item.quantity
                }))
            };
    
            // Log the request payload to verify it includes the restaurantId
            console.log('Request payload:', JSON.stringify(orderData, null, 2));
    
            const response = await axios.post("http://localhost:5000/api/orders", orderData); 

            console.log("✅ [DEBUG] Order placed:", response.data);
    
            navigate('/cust/complete', { state: { orderId: response.data.order_id, restaurantName: response.data.restaurant_name } });
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
