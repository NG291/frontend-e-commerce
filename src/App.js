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

import 'bootstrap/dist/css/bootstrap.min.css';
import CreateEmployee from "./pages/AdminPage/CreateEmployee";
import HomePage from "./pages/HomePage/HomePage";

import ProductDetailPage from "./components/Product/ProductDetailPage";
import EditEmployeePage from "./pages/AdminPage/EditEmployeePage";
import UserSellerPage from "./pages/AdminPage/UserSellerPage";
import SellerPage from "./pages/SellerPage/SellerPage";
import AddProduct from "./pages/SellerPage/AddProduct";
import UpdateProduct from "./pages/SellerPage/UpdateProduct";
import Cart from "./components/Cart/Cart";


function App() {
    return (
        <>
            <ToastContainer/>
            <BrowserRouter>
                <Routes>
                    {/* Login*/}
                    <Route path="/login" element={<LoginPage/>}></Route>
                    {/*  Register*/}
                    <Route path="/register" element={<RegisterPage/>}></Route>
                    {/* Home page route */}
                    <Route path="/" element={<HomePage/>}/>
                    {/* Admin page route */}
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/create-employee" element={<CreateEmployee/>}/>
                    <Route path="/product/:id" element={<ProductDetailPage/>}></Route>
                    <Route path="/edit-employee/:id" element={<EditEmployeePage/>}/>
                    <Route path="/user-seller-list" element={<UserSellerPage/>}/>
                    <Route path="/seller-page" element={<SellerPage/>}/>
                    <Route path="/add-product" element={<AddProduct/>}/>
                    <Route path="/edit-product/:id" element={<UpdateProduct/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                </Routes>
                <ToastContainer/>
            </BrowserRouter>
        </>
    );
}

export default App;
