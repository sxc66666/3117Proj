import { useParams } from 'react-router-dom';
import OrderDetails from '../components/OrderDetails';
import { customerOrders } from '../data/mockData';

export default function CustOrderDetails() {
  const { orderId } = useParams();
  const order = customerOrders.find(order => order.id === orderId);

  return (
    <div className="p-6">
      <OrderDetails order={order} role="cust" />
    </div>
  );
}
