const API_URL =
  import.meta.env.VITE_ENV === "PROD"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;

export default API_URL;
