import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import OrderSummary from "../components/OrderSummary";
import { selectedFoodsData } from "../data/mockData";
import { menuLinksCust } from "../config/config";
import FooterCust from "../components/FooterCust";
import { useNavigate } from 'react-router-dom';

export default function CustCheckout() {   
    const navigate = useNavigate();

    const totalPrice = 128.5; // 假设购物车总金额
    const restaurantName = "Pizza Hut"; // 假设当前餐厅
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
                <OrderSummary selectedFoods={selectedFoodsData} />
            </CardContainerCust>
            <FooterCust
                restaurantName={restaurantName}
                totalPrice={totalPrice}
                onBack={() => navigate(-1)}
                onCheckout={() => navigate('/cust/complete')}
                checkoutText={"Complete"}
            />
        </div>
    );


}