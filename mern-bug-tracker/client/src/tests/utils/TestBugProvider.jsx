import PropTypes from 'prop-types';
import BugContext from '../../context/BugContext';

export const TestBugProvider = ({ value, children }) => <BugContext.Provider value={value}>{children}</BugContext.Provider>;

TestBugProvider.propTypes = {
  value: PropTypes.shape({
    createBug: PropTypes.func,
    createBugStatus: PropTypes.string,
    bugs: PropTypes.array,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    error: PropTypes.any,
    refetch: PropTypes.func,
    updateBug: PropTypes.func,
    updateBugStatus: PropTypes.string,
    deleteBug: PropTypes.func,
    deleteBugStatus: PropTypes.string,
    queryState: PropTypes.object,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default TestBugProvider;

