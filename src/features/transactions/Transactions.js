import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsGoals } from '../savingsGoals/SavingsGoals';
import {
  selectErrors,
  selectRoundUpAmounts,
  selectTransactionLists,
  setRoundUpAmounts
} from '../transactions/transactionsSlice';
import { Errors } from '../Errors/Errors';

export function Transactions (props) { // accountUid, currency
  const { accountUid, currency } = props;

  const dispatch = useDispatch();

  const transactionLists = useSelector(selectTransactionLists(accountUid));
  const roundUpAmounts = useSelector(selectRoundUpAmounts(accountUid));
  const errors = useSelector(selectErrors);

  const [ amountId, setAmountId ] = useState();
  const [ finalAmountId, setFinalAmountId ] = useState();

  useEffect(() => {
    if (transactionLists?.length > 0) {
      dispatch(setRoundUpAmounts(accountUid));
    }
  }, [transactionLists, accountUid, dispatch]);

  console.error(transactionLists);
  console.error(roundUpAmounts);

  const handleRadioChange = (event) => {
    setAmountId(event.target.value);
  };

  const handleRadioClick = (event) => {
    event.preventDefault();
    setFinalAmountId(amountId);
  };

  const toDateString = (isoString) => {
    return new Date(isoString).toDateString();
  };

  return errors.length > 0 ?
    <Errors errors={errors} /> :
    (
      <div>
        <div>
        <h2>Statement Period</h2>
          <div onChange={handleRadioChange}>
            {roundUpAmounts ?
              Object.entries(roundUpAmounts).map(([amountId, { range,minorUnits }]) => (
                <div key={amountId}>
                  <input
                    type='radio'
                    id='amount'
                    name='amount'
                    value={amountId}
                  /> {toDateString(range.minTs)} - {toDateString(range.maxTs)}: {minorUnits / 100} {currency}
                </div>
              )):
              null
            }

            <button
              onClick={handleRadioClick}>
                Select
            </button>
          </div>
          <div>
            {finalAmountId !== undefined ?
              <div>
                <SavingsGoals
                  accountUid={accountUid}
                  currency={currency}
                  amountId={finalAmountId}
                />
              </div> :
              null
            }
          </div>
        </div>
      </div>
    );
};
