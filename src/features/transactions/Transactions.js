import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsGoals } from '../savingsGoals/SavingsGoals';
import {
  selectErrors,
  selectRoundUpAmounts,
  selectTransactionLists,
  setRoundUpAmounts
} from '../transactions/transactionsSlice';
import { Errors } from '../errors/Errors';

export function Transactions (props) {
  const { accountUid, currency } = props;

  const dispatch = useDispatch();

  const transactionLists = useSelector(selectTransactionLists(accountUid));
  const roundUpAmounts = useSelector(selectRoundUpAmounts(accountUid));
  const errors = useSelector(selectErrors);

  const [ amountId, setAmountId ] = useState();
  // additional state to prevent rerendering every time
  // the user clicks on a different radio option
  const [ finalAmountId, setFinalAmountId ] = useState();

  useEffect(() => {
    // the amounts to round up can only be computed
    // once the transactions are fetched
    if (transactionLists?.length > 0) {
      dispatch(setRoundUpAmounts(accountUid));
    }
  }, [transactionLists, accountUid, dispatch]);

  console.error(transactionLists);
  console.error(roundUpAmounts);
  console.error(errors);

  const handleRadioChange = (event) => {
    setAmountId(event.target.value);
  };

  const handleRadioClick = () => {
    setFinalAmountId(amountId);
  };

  // convert from an ISO timestamp to
  // a more human readable date string
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
              Object.entries(roundUpAmounts).map(([
                amountId,
                { range, minorUnits }
              ]) => (
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
