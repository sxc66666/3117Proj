import PropTypes from 'prop-types';

export default function OrderList({ orders, role, onClick }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => onClick(order)} // ✅ 让 `onClick` 由外部传入
        >
          <h3 className="text-lg font-semibold text-indigo-600">
            {role === 'cust' ? order.restaurantName : order.customerName}
          </h3>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500">Date: {order.date}</p>
          <p className="text-lg font-bold text-gray-800">
            Total: ${Number(order.total_price)  ? Number(order.total_price).toFixed(2) : 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  role: PropTypes.oneOf(['cust', 'vend']).isRequired,
  onClick: PropTypes.func.isRequired, // ✅ 添加 `onClick` 事件
};
