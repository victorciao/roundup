import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { create, fetch } from './savingsGoalsApi';

export const fetchSavingsGoals = createAsyncThunk(
  'savingsGoals/fetch',
  async (accountUid, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const response = await fetch(accountUid);
      const { savingsGoalList, errors } = response;
      if (savingsGoalList) {
        return { accountUid, savingsGoals: savingsGoalList };
      } else {
        return rejectWithValue(errors);
      }
    } catch (error) {
      return rejectWithValue([{ message: error }]);
    }
  }
);

export const createSavingsGoal = createAsyncThunk(
  'savingsGoals/create',
  async ({ accountUid, currency, name }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const response = await create(accountUid, currency, name);
      const { savingsGoalUid, errors } = response;
      if (savingsGoalUid) {
        return { accountUid, name, savingsGoalUid };
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
  errors: [],
};

const savingsGoalsSlice = createSlice({
  name: 'savingsGoals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingsGoals.fulfilled, (state, action) => {
        const { accountUid, savingsGoals } = action.payload;
        state.entities[accountUid] = transform(savingsGoals);
      })
      .addCase(fetchSavingsGoals.rejected, (state, action) => {
        state.errors = action.payload;
      })
      .addCase(createSavingsGoal.fulfilled, (state, action) => {
        const { accountUid, name, savingsGoalUid } = action.payload;
        if (state.entities[accountUid]) {
          state.entities[accountUid].push({ savingsGoalUid, name });
        } else {
          state.entities[accountUid] = [{ savingsGoalUid, name }];
        }
      })
      .addCase(createSavingsGoal.rejected, (state, action) => {
        state.errors = action.payload;
      });
  }
});

const transform = (goals) => {
  return goals.map((goal) => {
    const { savingsGoalUid, name } = goal;
    return { savingsGoalUid, name };
  });
};

// function is curried so `accountUid` can be passed in
export const selectSavingsGoals = (accountUid) => (state) =>
  state.savingsGoals.entities[accountUid];
export const selectErrors = (state) => state.savingsGoals.errors;

export default savingsGoalsSlice.reducer;
