import './App.scss';
// react router v6
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// pages
// components
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminPage from "./pages/AdminPage/AdminPage";
import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreatePage from "./pages/AdminPage/CreatePage";
import HomePage from "./pages/HomePage/HomePage";
import ProductList from "./components/Product/ProductList";
import ProductDetailPage from "./components/Product/ProductDetailPage";
import EditEmployeePage from "./pages/AdminPage/EditEmployeePage";
import UserSellerPage from "./pages/AdminPage/UserSellerPage";
import SellerPage from "./pages/SellerPage/SellerPage";
import AddProduct from "./pages/SellerPage/AddProduct";


function App() {
    return (
        <>
            <ToastContainer />
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
                    <Route path="/product/:id" element={<ProductDetailPage />}></Route>
                    <Route path="/edit-employee/:id" element={<EditEmployeePage />} />
                    <Route path="/user-seller-list" element={<UserSellerPage />} />
                    <Route path="/seller-page" element={<SellerPage />} />
                    <Route path="/add-product" element={<AddProduct />} />
                </Routes>
                <ToastContainer />
            </BrowserRouter>
        </>
    );
}

export default App;
