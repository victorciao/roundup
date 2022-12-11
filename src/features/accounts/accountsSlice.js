import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSavingsGoals } from '../savingsGoals/savingsGoalsSlice';
import { fetchTransactions } from '../transactions/transactionsSlice';
import { fetch } from './accountsApi';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetch',
  async (_0, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    try {
      const response = await fetch();
      const { accounts, errors } = response;
      if (accounts) {
        for (const account of accounts) {
          const { accountUid } = account;
          // requests to fetch transaction feeds
          // and savings goals are dependent on
          // the `accountUid`, so fetch them as soon
          // as the accounts are fetched
          dispatch(fetchTransactions(accountUid));
          dispatch(fetchSavingsGoals(accountUid));
        }
        return accounts;
      } else {
        return rejectWithValue(errors);
      }
    } catch (error) {
      return rejectWithValue([{ message: error }]);
    }
  }
);

const initialState = {
  entities: [],
  errors: [],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.entities = transform(action.payload);
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

export const selectAccounts = (state) => state.accounts.entities;
export const selectErrors = (state) => state.accounts.errors;

export default accountsSlice.reducer;
