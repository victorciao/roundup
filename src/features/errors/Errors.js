import React from 'react';

export function Errors (props) {
  const { errors } = props;
  return (
    <div>
      <div>
        <h2>An error has occurred: </h2>
          <div>
            {errors.length > 0 ?
              errors.map((error) => (
                <div key={error.message}>
                  {error.message}
                </div>
              )):
              null
            }
          </div>
      </div>
    </div>
  );
};
