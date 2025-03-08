import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import FoodList from "../components/FoodList";
import { menuLinksCust } from "../config/config";
import FooterCust from "../components/FooterCust";

export default function CustMenu() {    
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurantId } = useParams();  // 获取餐厅 ID
    const { restaurantName } = location.state || { restaurantName: "Pizza Hut" };  // 假设当前餐厅

    const [foodData, setFoodData] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 监听 FoodList 中数量变化
    const handleQuantityChange = (foodId, quantity) => {
        setCart((prevCart) => ({
            ...prevCart,
            [foodId]: quantity > 0 ? quantity : 0,  // 确保数量不为负
        }));
    };

    // 计算总价
    const totalPrice = Object.entries(cart).reduce((sum, [foodId, quantity]) => {
        const foodItem = foodData.find((food) => food.id === Number(foodId)); // 查找食物
        return sum + (foodItem ? foodItem.price * quantity : 0);
    }, 0);

    // 使用 useEffect 请求餐厅食品数据
    useEffect(() => {
        console.log("Restaurant ID received:", restaurantId);  // 输出 restaurantId，确保它是正确的

        if (restaurantId) {
            axios.get(`http://localhost:5000/api/foods/${restaurantId}`)
                .then((response) => {
                    console.log("Fetched foods:", response.data);  // 确认食品数据
                    setFoodData(response.data);  // 设置食品数据
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Failed to load food data");
                    setLoading(false);
                });
        } else {
            setError("Invalid restaurant ID");
            setLoading(false);
        }
    }, [restaurantId]);  // 依赖项是 restaurantId，意味着每次它发生变化时都会重新加载数据

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleOrder = () => {
        navigate('/cust/checkout', {
            state: {
                cart,
                totalPrice,
                restaurantName,
                restaurantId,  // Ensure this is included in the state
                menuItems: foodData
            }
        });
    };

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
                    onChange={handleQuantityChange}
                />
            </CardContainerCust>
            <FooterCust
                restaurantName={restaurantName}
                totalPrice={totalPrice}
                onBack={() => navigate(-1)}
                onCheckout={handleOrder}
                checkoutText="Checkout"
            />
        </div>
    );
}
