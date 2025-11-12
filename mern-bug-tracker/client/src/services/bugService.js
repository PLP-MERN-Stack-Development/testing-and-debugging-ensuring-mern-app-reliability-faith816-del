import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/bugs',
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  // Debugging aid: surface outgoing requests in the console
  // eslint-disable-next-line no-console
  console.debug('[bugService] request', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.error('[bugService] response error', error);
    return Promise.reject(error);
  }
);

const fetchBugs = async () => {
  const { data } = await apiClient.get('/');
  return data;
};

const createBug = async (payload) => {
  const { data } = await apiClient.post('/', payload);
  return data;
};

const updateBug = async ({ id, updates }) => {
  const { data } = await apiClient.patch(`/${id}`, updates);
  return data;
};

const deleteBug = async (id) => {
  await apiClient.delete(`/${id}`);
  return id;
};

export const bugService = {
  fetchBugs,
  createBug,
  updateBug,
  deleteBug,
};

export default bugService;

