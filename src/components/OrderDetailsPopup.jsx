import PropTypes from 'prop-types';

export default function OrderDetailsPopup({ order, role, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✕
        </button>
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

        <div className="mt-4 flex justify-end">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

OrderDetailsPopup.propTypes = {
  order: PropTypes.object.isRequired,
  role: PropTypes.oneOf(['cust', 'vend']).isRequired,
  onClose: PropTypes.func.isRequired,
};
