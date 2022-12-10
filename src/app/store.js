import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from '../features/accounts/accountsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import savingsGoalsReducer from '../features/savingsGoals/savingsGoalsSlice';

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    transactions: transactionsReducer,
    savingsGoals: savingsGoalsReducer,
  },
});
