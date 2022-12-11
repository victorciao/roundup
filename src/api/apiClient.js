// not sure how the interviewer will be running this app
// but I had CORS issues on Chrome and had to use a proxy service
//
const corsUrl = 'https://cors-anywhere.herokuapp.com/';
// const corsUrl = '';
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
      'Authorization': `Bearer ${process.env.REACT_APP_API_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${corsUrl}${apiUrl}${route}`, options);
    return await response.json().catch((error) => {
      throw error;
    });
  } catch (error) {
    throw error;
  }
};

const apiClient = {
  get: async (route) => await send(Methods.get, route),
  put: async (route, data) => await send(Methods.put, route, data),
};

export default apiClient;
