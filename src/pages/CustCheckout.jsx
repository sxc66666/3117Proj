import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import OrderSummary from "../components/OrderSummary";
import { selectedFoodsData } from "../data/mockData";

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
                    { label: 'Checkout', completed: true },
                    { label: 'Complete', completed: false },
                ]}
                >
                <OrderSummary selectedFoods={selectedFoodsData} />
            </CardContainerCust>
        </div>
    );


}