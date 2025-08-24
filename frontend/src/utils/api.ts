import axios from "axios";

const makeApiRequest = async (url: string, method: string, data: unknown) => {
  let response;
  let error;
  try {
    response = await axios.request({
      url,
      method,
      data,
    });
    console.log("Response:", response.data);
  } catch (err: unknown) {
    console.error("Error making API request:", err);
    error = err;
  }
  return { response, error };
};

export { makeApiRequest };
