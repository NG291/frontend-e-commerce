import './App.scss';
// react router v6
import {BrowserRouter, Route, Routes} from 'react-router-dom';
// pages
// components
import store from "./store/store";
import {Provider} from "react-redux";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Home} from "./pages";

function App() {
    return (
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        {/* Login*/}
                        <Route path="/login" element={<LoginPage/>}></Route>
                        {/*  Register*/}
                        <Route path="/register" element={<RegisterPage/>}></Route>
                        {/* home page route */}
                        <Route path="/" element={<Home />} />
                    </Routes>
                    <ToastContainer />
                </BrowserRouter>
            </Provider>
    );
}

export default App;
