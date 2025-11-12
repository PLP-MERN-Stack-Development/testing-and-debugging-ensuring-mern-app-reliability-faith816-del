import PropTypes from 'prop-types';

export const EmptyState = ({ title, message, action }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{message}</p>
    {action}
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.node,
};

EmptyState.defaultProps = {
  action: null,
};

