import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://app-api.scrabblenabiso.com",
});

export default axiosInstance