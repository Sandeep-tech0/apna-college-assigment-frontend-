import axios from "axios";
let baseurl = process.env.REACT_APP_BASE_URL || "http://localhost:3002/api/v1";

export const logout = () => {
  localStorage.removeItem("token"); // Replace with your actual implementation
  // Redirect to the login page
  window.location.href = "/"; // Replace with the URL of your login page
};

export const apiRequest = async ({ url, method, body, header }) => {
  let auth = { baseURL: baseurl };

  const instance = axios.create();

  instance.interceptors.response.use(
    async (response) => response,
    async (error) => {
      if (error.response && error.response.status === 403) {
        // If a 403 error is encountered, log out the user
        await logout();
      }
      // Return the error to continue handling it elsewhere in your code
      return Promise.reject(error);
    }
  );

  if (header) {
    const headers = { authorization: localStorage.getItem("token") };
    auth = { headers, baseURL: baseurl };
  }

  switch (method) {
    case "post":
      return await instance.post(url, body, auth);
    case "get":
      return await instance.get(url, auth);
    case "put":
      return await instance.put(url, body, auth);
    case "patch":
      return await instance.patch(url, body, auth);
    case "delete":
      return await instance.delete(url, auth);
    default:
      return false;
  }
};
