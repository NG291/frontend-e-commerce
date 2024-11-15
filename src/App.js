import './App.scss';
// react router v6
import {BrowserRouter, Route, Routes} from 'react-router-dom';
// pages
// components
import {Provider} from "react-redux";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminPage from "./pages/AdminPage/AdminPage";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreatePage from "./pages/AdminPage/CreatePage";
import HomePage from "./pages/HomePage/HomePage";
import EditEmployeePage from "./pages/AdminPage/EditEmployeePage";


function App() {
    return (
            <>
                <BrowserRouter>
                    <Routes>
                        {/* Login*/}
                        <Route path="/login" element={<LoginPage/>}></Route>
                        {/*  Register*/}
                        <Route path="/register" element={<RegisterPage/>}></Route>
                        {/* Home page route */}
                        <Route path="/" element={<HomePage />} />
                        {/* Admin page route */}
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/create-employee" element={<CreatePage />} />
                        <Route path="/edit-employee/:id" element={<EditEmployeePage />} /> {/* Add route */}
                    </Routes>
                    <ToastContainer />
                </BrowserRouter>
            </>
    );
}

export default App;
