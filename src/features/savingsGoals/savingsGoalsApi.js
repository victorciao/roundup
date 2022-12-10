import apiClient from '../../api/apiClient';
import { v4 as uuidv4 } from 'uuid';

const SAVINGS_GOALS_API_ROUTE = 'account/';

export const fetch = (accountUid) => {
  const route = buildRoute(accountUid);
  return apiClient.get(route);
};

export const create = (accountUid, currency, name) => {
  const route = buildRoute(accountUid);
  return apiClient.put(route, { name, currency });
};

export const addTo = (accountUid, currency, savingsGoalUid, minorUnits) => {
  const transferUid = uuidv4();
  const route = buildRoute(accountUid, savingsGoalUid, transferUid);
  return apiClient.put(route, { amount: { currency, minorUnits } });
};

const buildRoute = (accountUid, savingsGoalUid, transferUid) => {
  if (savingsGoalUid && transferUid) {
    return `${SAVINGS_GOALS_API_ROUTE}${accountUid}/savings-goals/
${savingsGoalUid}/add-money/${transferUid}`;
  }
  return `${SAVINGS_GOALS_API_ROUTE}${accountUid}/savings-goals`;
};
