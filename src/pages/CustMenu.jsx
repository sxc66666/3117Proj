import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";

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
                <p className="mt-4">这里是客户的控制台内容。</p>
            </CardContainerCust>
        </div>
    );


}