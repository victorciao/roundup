import apiClient from '../../api/apiClient';

const TRANSACTION_API_ROUTE = 'feed/account/';
const NUMBER_OF_WEEKS = 3;

export const fetch = async (accountUid) => {
  const dateRanges = getDateRanges();
  const routes = buildRoutes(accountUid, dateRanges);
  const responses = routes.map((route) => apiClient.get(route)); // could do one query
  try {
    const responseJsons = await Promise.all(responses);
    return { dateRanges, responses: responseJsons };
  } catch (error) {
    throw error;
  }
};

const buildRoutes = (accountUid, dateRanges) => {
  return dateRanges.map(({ minTs, maxTs }) => {
    return `${TRANSACTION_API_ROUTE}${accountUid}/
settled-transactions-between?minTransactionTimestamp=${minTs}&
maxTransactionTimestamp=${maxTs}`;
  });
};

const getDateRanges = () => {
  const ranges = [];

  // current week
  const date = new Date();
  let maxTs = date.toISOString();
  date.setDate(date.getDate() - date.getDay() + 1); // to nearest Sunday
  date.setHours(0, 0, 0, 0);
  let minTs = date.toISOString();

  ranges.push({ minTs, maxTs });

  for (let i = 0; i < NUMBER_OF_WEEKS; i++) {
    maxTs = minTs;
    date.setDate(date.getDate() - 7);
    minTs = date.toISOString();

    ranges.push({ minTs, maxTs });
  }

  return ranges;
};
