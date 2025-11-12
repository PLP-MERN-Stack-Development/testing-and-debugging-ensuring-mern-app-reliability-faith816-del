import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const Providers = ({ children, queryClient }) => (
  <QueryClientProvider client={queryClient || createTestQueryClient()}>{children}</QueryClientProvider>
);

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  queryClient: PropTypes.instanceOf(QueryClient),
};

Providers.defaultProps = {
  queryClient: undefined,
};

export const renderWithProviders = (ui, { queryClient = createTestQueryClient(), ...renderOptions } = {}) => {
  const rendered = render(<Providers queryClient={queryClient}>{ui}</Providers>, renderOptions);
  return { queryClient, ...rendered };
};

export default renderWithProviders;

