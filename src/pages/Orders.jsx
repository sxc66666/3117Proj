import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import OrderList from '../components/OrderList';
import Navbar from '../components/Navbar';
import { menuLinksCust } from '../config/navbarConfig';
import CardContainer from '../components/CardContainer';
import OrderDetailsPopup from '../components/OrderDetailsPopup';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const user = JSON.parse(localStorage.getItem("user"));
        // if (!user || !user.id) {
        //   return;
        // }

        // const response = await axiosInstance.get(`/api/orders/${user.id}`);
        const response = await axiosInstance.get(`/api/orders`);

        console.log("✅ [DEBUG] Fetched orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("❌ [ERROR] Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar links={menuLinksCust} />
      <CardContainer>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <OrderList
          orders={orders}
          role="cust"
          onClick={(order) => setSelectedOrder(order)}
        />
        {selectedOrder && (
          <OrderDetailsPopup
            order={selectedOrder}
            role="cust"
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </CardContainer>
    </div>
  );
}
