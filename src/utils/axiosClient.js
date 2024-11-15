import Axios from "axios";
import {toast} from "react-toastify";

const token = localStorage.getItem('jwtToken');

const parsedToken = token ? `Bearer ${token}` : '';

const axiosClient = Axios.create();

axiosClient.interceptors.request.use(
    (config) => {
        config.headers.setAuthorization(parsedToken);
        return config;
    },
    (err) => {
        console.log({err});
        toast.error(err.respond?.err, {position: "top-center"})
        return Promise.reject(err);
    });

export default axiosClient;