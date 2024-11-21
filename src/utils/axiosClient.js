import Axios from "axios";
import {toast} from "react-toastify";

const token = localStorage.getItem('jwtToken');

const parsedToken = token ? `Bearer ${token}` : '';

const axiosClient = Axios.create();

axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage và gắn vào header Authorization
        const parsedToken = localStorage.getItem('jwtToken');
        if (parsedToken) {
            config.headers['Authorization'] = `Bearer ${parsedToken}`;
        }
        return config;
    },
    (err) => {
        console.log({err});
        toast.error(err.response?.data?.message || 'Request failed', {position: "top-center"});
        return Promise.reject(err);
    }
);

export default axiosClient;