import { accessToken } from "../secrets/accessToken";

const corsUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://api-sandbox.starlingbank.com/api/v2/';

const Methods = {
  get: 'GET',
  put: 'PUT',
};

const send = async (method, route, data) => {
  console.error(route);
  let options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${corsUrl}${apiUrl}${route}`, options);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const apiClient = {
  get: async (route) => await send(Methods.get, route),
  put: async (route, data) => await send(Methods.put, route, data),
};

export default apiClient;
