const apiRoot = 'https://api-sandbox.starlingbank.com/api/v2/';
const Methods = {
  get: 'GET',
  put: 'PUT',
};

const send = async (method, route, data) => {
  let options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_API_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${apiRoot}${route}`, options);
  return await response.json();
};

const apiClient = {
  get: (route) => send(Methods.get, route),
  put: (route, data) => send(Methods.put, route, data),
};

export default apiClient;
