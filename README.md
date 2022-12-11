# Starling Bank Technical Challenge

## Overview

To get to the actual business logic of the application quickly and not have to create the toolchain from scratch, I bootstrapped it with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

This is the first time I've worked with Redux Toolkit and the new paradigm for creating store slices, updating and accessing state, and using side effects.

To run the app without downloading it and installing its dependencies, open _____ to view it in your browser.

## Getting Started

In the project directory, you can run:

### `yarn` or `yarn install`

Installs the dependencies of the app.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## File Organization & Architecture

### `src/index.js`

Entry point of the app that connects the Redux store to the React app.

### `src/App.js`

Entry point of the React app.

### `src/app/store.js`

Redux store, sliced into 3 parts based on the business logic and API endpoints.

### `src/features`

Includes 3 subdirectories - `accounts`, `savingsGoals`, and `transactions`, each with its own React component, Redux store slice, and calls to corresponding API endpoints.

`accounts` is responsible for fetching the accounts for a user, displaying them, and passing on the selected account to `transactions`.

`transactions` is responsible for fetching the transactions for an account in the last ~4 weeks, computing the amounts to round up, displaying them, and passing them onto `savingsGoals`.

`savingsGoals` is responsible for fetching the savings goals for an account, displaying them, allowing the user to add new goals, and allowing the user to add the round-up amounts to them.

### Others

`src/features/errors` displays errors from API calls. `api/apiClient.js` wraps the Fetch API.

To fetch transactions for 4 weeks, the app makes 4 requests - one per week. Doing so simplifies the business logic and removes the need to find all transactions within a date range when computing roundup amounts, which is more suitable from the scope of the project. The downside of it is having 3 additional requests, which increases load time and the likelihood of one or more of the requests encountering a network error.

## Known Limitations & Areas of Improvement

### Data Persistence

Data in the app do not persist between page loads, and some React components will lose states once torn down. This is because the app is not connected to a persistent data store nor do I have access to the Starling Backend. Ideally we'd mark a transaction as "rounded up" and associate it with a round-up activity on the Starling Backend.

### UI & Error Handling

I went light on the UI so there is very little styling and no user input validation. User inputs are assumed to be valid, and, if not, errors will be returned by the backend. In addition, errors are handled not as gracefully by rendering an error component for any backend error returned, which the user cannot recover from.

While requests to add a new savings goal and round-up amounts to a savings goal are inflight, I'd add UI indications (e.g. greying out the buttons, displaying toasts, etc) so the user knows something is happening.

### Unit Tests & Types

I didn't write unit tests due to the project scope, but, in the ideal world, I'd write Jest tests for all the modules/components. I would also create Flow types for all the files.

### API Access Token

The API access token is stored as an environment variable in `.env` and accessed via `process.env`, which isn't the most secure way of handling secrets. In the ideal world, I'd store it in a secrets service and fetched it with a key.

### Retrying Network Requests

The application breaks if any of the API calls fails. I would implement network request retrying logic in the API client to improve resilience.
