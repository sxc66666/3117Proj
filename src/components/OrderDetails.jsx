import PropTypes from 'prop-types';

export default function OrderDetails({ order, role }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">
        {role === 'cust' ? "Order from" : "Order by"}: 
        <span className="text-indigo-600"> {role === 'cust' ? order.restaurantName : order.customerName}</span>
      </h2>

      <p className="text-gray-600 mt-2">Order ID: {order.id}</p>
      <p className="text-gray-600">Date: {order.date}</p>
      <p className="text-gray-800 font-bold text-lg">Total: ${order.total.toFixed(2)}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Items:</h3>
        <ul className="mt-2 space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between border-b pb-2">
              <span>{item.name} x {item.quantity}</span>
              <span className="text-gray-800 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

OrderDetails.propTypes = {
  order: PropTypes.object.isRequired,
  role: PropTypes.oneOf(['cust', 'vend']).isRequired,
};
