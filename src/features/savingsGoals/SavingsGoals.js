import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSavingsGoal } from '../transactions/transactionsSlice';
import {
  createSavingsGoal,
  selectErrors,
  selectSavingsGoals
} from '../savingsGoals/savingsGoalsSlice';
import { Errors } from '../errors/Errors';

export function SavingsGoals (props) {
  const { accountUid, currency, amountId } = props;

  const dispatch = useDispatch();

  const savingsGoals = useSelector(selectSavingsGoals(accountUid));
  const errors = useSelector(selectErrors);

  const [ goalUid, setGoalUid ] = useState('');
  const [ goalName, setGoalName ] = useState('');

  console.error(savingsGoals);

  const handleRadioChange = (event) => {
    setGoalUid(event.target.value);
  };

  const handleTextChange = (event) => {
    setGoalName(event.target.value);
  };

  const handleRadioClick = () => {
    dispatch(addToSavingsGoal({
      accountUid,
      currency,
      amountId,
      savingsGoalUid: goalUid
    }));
  };

  const handleTextClick = () => {
    dispatch(createSavingsGoal({ accountUid, currency, name: goalName }));
  };

  return errors.length > 0 ?
    <Errors errors={errors} /> :
    (
      <div>
        <div>
          <h2>Savings Goals</h2>
          <div onChange={handleRadioChange}>
            {savingsGoals ?
              savingsGoals.map((goal) => (
                <div key={goal.savingsGoalUid}>
                  <input
                    type='radio'
                    id='goal'
                    name='goal'
                    value={goal.savingsGoalUid}
                  /> {goal.name}
                </div>
              )):
              null
            }

            <button
              onClick={handleRadioClick}>
                Transfer
            </button>
          </div>

          <div>
            <h2>Add a new goal:</h2>
            <input
              type='text'
              id='new-goal'
              name='newGoal'
              onChange={handleTextChange}
              value={goalName}
            />

            <button
              onClick={handleTextClick}>
                Add
            </button>
          </div>
        </div>
      </div>
    );
};
