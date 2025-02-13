import PropTypes from 'prop-types';
import { useState } from 'react';

export default function FoodList({ foods, mode, onChange, onEdit, onDelete }) {
  const [quantities, setQuantities] = useState({});

  const handleAdd = (foodId) => {
    const newQuantity = (quantities[foodId] || 0) + 1;
    const updatedQuantities = { ...quantities, [foodId]: newQuantity };
    setQuantities(updatedQuantities);
    onChange && onChange(foodId, newQuantity); // 顾客模式下调用
  };

  const handleSubtract = (foodId) => {
    const newQuantity = Math.max((quantities[foodId] || 0) - 1, 0);
    const updatedQuantities = { ...quantities, [foodId]: newQuantity };
    setQuantities(updatedQuantities);
    onChange && onChange(foodId, newQuantity);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map((food) => {
        const quantity = quantities[food.id] || 0;
        const isSelected = quantity > 0;

        return (
          <div
            key={food.id}
            className={`card bg-white shadow-lg transition ${isSelected && mode === 'customer' ? 'border-2 border-indigo-500' : ''}`}
          >
            <figure>
              <img src={food.image} alt={food.name} className="h-32 w-full object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{food.name}</h2>
              <p className="text-sm text-gray-600">{food.description}</p>
              <p className="text-lg font-bold text-indigo-600">¥{food.price}</p>

              {/* 顾客模式：数量选择 */}
              {mode === 'customer' && (
                <div className="flex items-center gap-2 mt-2">
                  <button className="btn btn-sm" onClick={() => handleSubtract(food.id)}>-</button>
                  <span className="font-bold">{quantity}</span>
                  <button className="btn btn-sm btn-primary" onClick={() => handleAdd(food.id)}>
                    +
                  </button>
                </div>
              )}

              {/* 商家模式：编辑、删除操作 */}
              {mode === 'vendor' && (
                <div className="flex justify-end gap-2 mt-2">
                  <button className="btn btn-sm" onClick={() => onEdit(food)}>编辑</button>
                  <button className="btn btn-sm btn-error" onClick={() => onDelete(food.id)}>删除</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

FoodList.propTypes = {
  foods: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['customer', 'vendor']).isRequired,
  onChange: PropTypes.func, // 仅顾客模式需要，数量变化时触发
  onEdit: PropTypes.func,   // 仅商家模式需要，点击编辑时触发
  onDelete: PropTypes.func, // 仅商家模式需要，点击删除时触发
};
