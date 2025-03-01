import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function EditFoodPopup({ food, onSave, onClose }) {
  const [editedFood, setEditedFood] = useState(food);

  useEffect(() => {
    setEditedFood(food);
  }, [food]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFood((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Dish</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={editedFood.name}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={editedFood.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full mb-4"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Price ($)</label>
        <input
          type="number"
          name="price"
          value={editedFood.price}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          value={editedFood.image}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
        />

        <div className="flex justify-end gap-3">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(editedFood)}>Save</button>
        </div>
      </div>
    </div>
  );
}

EditFoodPopup.propTypes = {
  food: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
