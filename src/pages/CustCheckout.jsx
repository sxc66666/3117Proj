import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import OrderSummary from "../components/OrderSummary";
import { selectedFoodsData } from "../data/mockData";
import { menuLinksCust } from "../config/config";

export default function CustCheckout() {   
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
        </div>
    );


}