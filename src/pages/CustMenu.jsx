import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import FoodList from "../components/FoodList";
import { foodData } from "../data/mockData";

export default function MainCustomer() {
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
                    { label: 'Order food', completed: true },
                    { label: 'Checkout', completed: false },
                    { label: 'Complete', completed: false },
                ]}
                >
                <h1 className="text-2xl font-bold">Welcome to the dashboard of customer!</h1>
                <FoodList
                    foods={foodData}
                    mode="customer"
                    onChange={(foodId, quantity) => console.log(`菜品 ${foodId} 数量: ${quantity}`)}
                    />

            </CardContainerCust>
        </div>
    );


}