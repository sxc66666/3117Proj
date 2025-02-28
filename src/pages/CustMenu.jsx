import React from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import FoodList from "../components/FoodList";
import { foodData } from "../data/mockData";
import { menuLinksCust } from "../config/config";

export default function CustMenu() {    
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
                    onChange={(foodId, quantity) => console.log(`菜品 ${foodId} 数量: ${quantity}`)}
                    />

            </CardContainerCust>
        </div>
    );


}