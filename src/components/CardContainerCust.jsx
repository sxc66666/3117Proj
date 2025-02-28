import PropTypes from 'prop-types';

export default function CardContainer({ children, steps = [] }) {
  return (
    <div style={{ margin: '1.5% 3% 20px 3%' }}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {steps.length > 0 && (
          <div className="steps-container mb-6">
            <ul className="steps steps-vertical sm:steps-horizontal lg:steps-horizontal">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`step ${step.completed ? 'step-primary' : ''}`}
                >
                  {step.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ),
};
