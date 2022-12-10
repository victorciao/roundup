import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSavingsGoals } from '../savingsGoals/savingsGoalsSlice';
import { fetchTransactions } from '../transactions/transactionsSlice';
import { fetch } from './accountsApi';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetch',
  async (_0, thunkApi) => {
    const { dispatch } = thunkApi;
    try {
      const response = await fetch();
      const { accounts, errors } = response;
      if (accounts) {
        for (const account of accounts) {
          const { accountUid } = account;
          dispatch(fetchTransactions(accountUid));
          dispatch(fetchSavingsGoals(accountUid));
        }
        return accounts;
      } else {
        return Promise.reject(errors);
      }
    } catch (error) {
      return Promise.reject([{ message: error }]);
    }
  }
);

const initialState = {
  status: 'idle', // use const
  entities: [],
  errors: [],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.entities = transform(action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.errors = action.payload;
      });
  }
});

const transform = (accounts) => {
  return accounts.map((account) => {
    const { accountUid, currency, name } = account;
    return { accountUid, currency, name };
  });
};

export const selectStatus = (state) => state.accounts.status;
export const selectAccounts = (state) => state.accounts.entities;
export const selectErrors = (state) => state.accounts.errors;

export default accountsSlice.reducer;
