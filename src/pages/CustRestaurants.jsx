import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import RestaurantList from "../components/RestaurantList";
import { useNavigate } from "react-router-dom";
import { restaurantData } from "../data/mockData";

export default function MainCustomer() {
    const navigate = useNavigate(); // 使用 useNavigate 钩子获取 navigate 函数

    const menuLinks = [
        { label: 'Home', href: '/cust/restaurants' },
        {
          label: '*Username',
          children: [
            { label: 'Orders', href: '/cust/' },
            { label: 'Account', href: '/cust/' },
            { label: 'Logout', href: '/cust/' },
          ],
        }
    ];
    
    return (
        <div>
            <Navbar links={menuLinks} />
            <CardContainerCust
                steps={[
                    { label: 'Choose restaurant', completed: true },
                    { label: 'Order food', completed: false },
                    { label: 'Checkout', completed: false },
                    { label: 'Complete', completed: false },
                ]}
                >
                <h1 className="text-2xl font-bold">Welcome to the dashboard of customer!</h1>
                <RestaurantList
                restaurants={restaurantData}
                onSelect={(restaurant) => navigate(`/cust/restaurants/${restaurant.id}`)}
                />
            </CardContainerCust>
        </div>
    );
}