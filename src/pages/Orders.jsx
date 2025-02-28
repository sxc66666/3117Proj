import OrderList from '../components/OrderList';
import { customerOrders } from '../data/mockData';
import Navbar from '../components/Navbar';
import { menuLinksCust } from '../config/config';
import CardContainer from '../components/CardContainer';

export default function CustOrders() {
  return (
    <div>
      <Navbar links={menuLinksCust} />
      <CardContainer>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <OrderList orders={customerOrders} role="cust" /> {/* 👈 role 需要根据当前用户的role来选择 */}
      </CardContainer>
    </div>
  );
}