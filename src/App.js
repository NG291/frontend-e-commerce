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
import AdminPage from "./pages/AdminPage/AdminPage";
import Header from "./components/Header/Header";
import React from "react";
import Footer from "./components/Footer/Footer";

function App() {
    return (
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        {/* Login*/}
                        <Route path="/login" element={<LoginPage/>}></Route>
                        {/*  Register*/}
                        <Route path="/register" element={<RegisterPage/>}></Route>
                        {/* Home page route */}
                        <Route path="/" element={<Home />} />
                        {/* Admin page route */}
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                    <ToastContainer />
                </BrowserRouter>
            </Provider>
    );
}

export default App;
