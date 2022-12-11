import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccounts, selectErrors } from '../accounts/accountsSlice';
import { Transactions } from '../transactions/Transactions';
import { Errors } from '../errors/Errors';

export function Accounts () {  
  const accounts = useSelector(selectAccounts);
  const errors = useSelector(selectErrors);

  const [ selectedAccount, setSelectedAccount ] = useState({});

  console.error(accounts);

  const handleRadioChange = (event) => {
    const accountUid = event.target.value;
    const account = accounts.find(
      (account) => (account.accountUid === accountUid)
    );
    setSelectedAccount(account);
  };

  return errors.length > 0 ?
    <Errors errors={errors} /> :
    (
      <div>
        <div>
        <h2>Accounts</h2>
          <div onChange={handleRadioChange}>
            {accounts.length > 0 ?
              accounts.map((account) => (
                <div key={account.accountUid}>
                  <input
                    type='radio'
                    id='account'
                    name='account'
                    value={account.accountUid}
                  /> {account.name}
                </div>
              )):
              null
            }
          </div>
          <div>
            {Object.keys(selectedAccount).length > 0 ?
              <div>
                <Transactions
                  accountUid={selectedAccount.accountUid}
                  currency={selectedAccount.currency}
                />
              </div> :
              null
            }
          </div>
        </div>
      </div>
    );
};
