import PropTypes from 'prop-types';

export default function RestaurantList({ restaurants, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="card bg-white shadow-lg hover:shadow-xl transition cursor-pointer"
          onClick={() => onSelect(restaurant)}
        >
          <figure>
            <img src={restaurant.image} alt={restaurant.name} className="h-40 w-full object-cover" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{restaurant.name}</h2>
            <p className="text-sm text-gray-600">{restaurant.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

RestaurantList.propTypes = {
  restaurants: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
