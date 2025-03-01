import PropTypes from 'prop-types';

export default function CardContainer({ children }) {
  return (
    <div style={{ margin: '1.5% 3% 20px 3%' }}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
