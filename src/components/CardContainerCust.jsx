import PropTypes from 'prop-types';
import CardContainer from './CardContainer';

export default function CardContainerCust({ children, steps }) {
  return (
    <CardContainer>
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
    </CardContainer>
  );
}

CardContainerCust.propTypes = {
  children: PropTypes.node.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ),
};
