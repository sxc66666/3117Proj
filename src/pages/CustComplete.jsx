import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import { menuLinksCust } from "../config/config";

export default function CustComplete() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, restaurantName } = location.state || { orderId: "123456789", restaurantName: "Pizza Hut" };

    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainerCust
                steps={[
                    { label: 'Choose restaurant', completed: true },
                    { label: 'Order food', completed: true },
                    { label: 'Checkout', completed: true },
                    { label: 'Complete', completed: true },
                ]}
            >
                <div className="flex flex-col items-center text-center p-8">
                    {/* ✅ 成功提示 */}
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-800">Order Submitted Successfully!</h1>
                    
                    {/* 订单信息 */}
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
                        <p className="text-lg font-semibold text-gray-700">Restaurant:</p>
                        <p className="text-xl text-indigo-600 font-bold">{restaurantName}</p>

                        <p className="mt-3 text-lg font-semibold text-gray-700">Order ID:</p>
                        <p className="text-xl text-gray-900 font-mono">{orderId}</p>
                    </div>

                    {/* 🛠 操作按钮 */}
                    <div className="mt-6 flex gap-4">
                        <button 
                            className="btn btn-outline btn-primary px-6 py-2"
                            onClick={() => navigate('/cust/orders')}
                        >
                            My Orders
                        </button>
                        <button 
                            className="btn btn-primary px-6 py-2"
                            onClick={() => navigate('/cust/restaurants')}
                        >
                            Home
                        </button>
                    </div>
                </div>
            </CardContainerCust>
        </div>
    );
}
