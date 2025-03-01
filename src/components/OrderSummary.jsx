import PropTypes from 'prop-types';

export default function OrderSummary({ selectedFoods }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>菜品</th>
            <th>数量</th>
            <th>价格</th>
          </tr>
        </thead>
        <tbody>
        {selectedFoods.map((item) => (
            <tr key={item.id}>
                <td className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                    <span>{item.name}</span>
                </td>
                <td>{item.quantity}</td>
                <td>${item.price ? (item.quantity * item.price).toFixed(2) : "N/A"}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

OrderSummary.propTypes = {
  selectedFoods: PropTypes.array.isRequired,
};
