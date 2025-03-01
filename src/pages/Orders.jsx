import React, { useState } from "react";
import OrderList from '../components/OrderList';
import { customerOrders } from '../data/mockData';
import Navbar from '../components/Navbar';
import { menuLinksCust } from '../config/config';
import CardContainer from '../components/CardContainer';
import OrderDetailsPopup from '../components/OrderDetailsPopup';

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div>
      <Navbar links={menuLinksCust} />
      <CardContainer>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <OrderList
          orders={customerOrders}
          role="cust"
          onClick={(order) => setSelectedOrder(order)} // ✅ 传递点击事件
        />
        {/* 🆕 渲染 Popup */}
        {selectedOrder && (
          <OrderDetailsPopup
            order={selectedOrder}
            role="cust"
            onClose={() => setSelectedOrder(null)} // ✅ 关闭 Popup
          />
        )}
      </CardContainer>
    </div>
  );
}
