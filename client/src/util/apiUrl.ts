const VITE_ENV = import.meta.env.VITE_ENV;
const VITE_DEV_API_URL = import.meta.env.VITE_DEV_API_URL;
const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;

const API_URL = VITE_ENV === "PROD" ? VITE_PROD_API_URL : VITE_DEV_API_URL;

export default API_URL;
