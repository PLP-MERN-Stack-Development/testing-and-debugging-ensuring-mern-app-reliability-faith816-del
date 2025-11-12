import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useBugs } from '../hooks/useBugs';

const BugContext = createContext(null);

export const BugProvider = ({ children }) => {
  const bugState = useBugs();
  return <BugContext.Provider value={bugState}>{children}</BugContext.Provider>;
};

BugProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBugContext = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider');
  }
  return context;
};

export default BugContext;

