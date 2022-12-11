import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetch } from './transactionsApi';
import { addTo } from '../savingsGoals/savingsGoalsApi';

const OUTBOUND = 'OUT';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (accountUid, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const { dateRanges, responses } = await fetch(accountUid);
      const transactionLists = [], size = dateRanges.length;
      for (let i = 0; i < size; i++) {
        const { feedItems, errors } = responses[i];
        if (feedItems) {
          transactionLists.push({
            range: dateRanges[i],
            transactions: feedItems
          });
        } else {
          return rejectWithValue(errors);
        }
      }
      return { accountUid, transactionLists };
    } catch (error) {
      return rejectWithValue([{ message: error }]);
    }
  }
);

export const addToSavingsGoal = createAsyncThunk(
  'savingsGoals/addTo',
  async ({ accountUid, currency, amountId, savingsGoalUid }, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;
    const state = getState();
    const { minorUnits } = state.transactions.roundUpAmounts[accountUid][amountId];
    try {
      const response = await addTo(accountUid, currency, savingsGoalUid, minorUnits);
      const { success, errors } = response;
      if (success) {
        return { accountUid, amountId };
      } else {
        return rejectWithValue(errors);
      }
    } catch (error) {
      return rejectWithValue([{ message: error }]);
    }

  }
);

const initialState = {
  entities: {},
  // this is intentionally left outside `entities`
  // to make the state more shallow for the purpose
  // of this project
  roundUpAmounts: {},
  errors: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setRoundUpAmounts: (state, action) => {
      const accountUid = action.payload;
      const transactionLists = state.entities[accountUid];
      const amounts = {};
      // add an id to make accessing individual entries more easily
      let amountId = 0;
      for (const { range, transactions } of transactionLists) {
        const roundUpSum = transactions.reduce((sum, transaction) => {
          const { minorUnits } = transaction.amount;
          // Starling accounts are only in GBP, EUR, and USD
          // which are all 2 decimal currencies
          const remainder = minorUnits % 100;
          const roundUpAmount = remainder === 0 ? 0 : 100 - remainder;
          return sum + roundUpAmount;
        }, 0);
        amounts[amountId++] = { range, minorUnits: Math.round(roundUpSum) };
      }
      state.roundUpAmounts[accountUid] = amounts;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const { accountUid, transactionLists } = action.payload;
        state.entities[accountUid] =
          transactionLists.map(({ range, transactions }) =>
            ({ range, transactions: transform(transactions) }));
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.errors = action.payload;
      })
      .addCase(addToSavingsGoal.fulfilled, (state, action) => {
        const { accountUid, amountId } = action.payload;
        state.roundUpAmounts[accountUid][amountId].minorUnits = 0;
      })
      .addCase(addToSavingsGoal.rejected, (state, action) => {
        state.errors = action.payload;
      });
  }
});

const transform = (transactions) => {
  return transactions
    // only round up outbound transactions
    .filter((transaction) => transaction.direction === OUTBOUND)
    .map((transaction) => {
      const { minorUnits } = transaction.amount;
      return { amount: { minorUnits } };
    });
};

export const { setRoundUpAmounts } = transactionsSlice.actions;

// function is curried so `accountUid` can be passed in
export const selectTransactionLists = (accountUid) => (state) => state.transactions.entities[accountUid];
export const selectRoundUpAmounts = (accountUid) => (state) => state.transactions.roundUpAmounts[accountUid];
export const selectErrors = (state) => state.transactions.errors;

export default transactionsSlice.reducer;
