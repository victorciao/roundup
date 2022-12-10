import apiClient from '../../api/apiClient';

const ACCOUNTS_API_ROUTE = 'accounts';

export const fetch = () => {
  return apiClient.get(ACCOUNTS_API_ROUTE);
};
