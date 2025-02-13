import PropTypes from 'prop-types';

export default function CardContainer({ children, className }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
