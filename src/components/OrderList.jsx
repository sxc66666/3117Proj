import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function OrderList({ orders, role }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <h3 className="text-lg font-semibold text-indigo-600">
            {role === 'cust' ? order.restaurantName : order.customerName}
          </h3>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500">Date: {order.date}</p>
          <p className="text-lg font-bold text-gray-800">Total: ${order.total.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  role: PropTypes.oneOf(['cust', 'vend']).isRequired,
};
