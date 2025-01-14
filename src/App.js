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
import PaymentPage from "./components/Cart/PaymentPage";
import UserOrders from "./components/Order/UserOrders";
import SellerOrders from "./components/Order/SellerOrders";
import PendingOrders from "./components/Order/PendingOrders";
import ChangePassword from "./pages/SellerPage/ChangePassword";
import ForgotPasswordPage from "./pages/Password/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Password/PasswordResetPage";
import SellerProductList from "./components/Product/SellerProductList";
import UserPendingOrders from "./components/Order/UserPendingOrders";
import Layout from "./pages/Layout";
import Notification from "./components/notification/Notification";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import Info from "./components/profile/Info";
import "./global.scss"
import RevenueTable from "./components/Order/RevenueTable";

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
                    <Route element={<Layout/>}>
                        <Route path="/seller-page" element={<SellerPage/>}/>
                        <Route path="/SellerOrders" element={<SellerOrders/>}/>
                        <Route path="/PendingOrders" element={<PendingOrders/>}/>
                        <Route path="/Revenue" element={<RevenueTable/>}/>
                    </Route>
                    <Route path="/add-product" element={<AddProduct/>}/>
                    <Route path="/edit-product/:id" element={<UpdateProduct/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/payment" element={<PaymentPage/>}/>
                    <Route path="/UserOrders" element={<UserOrders/>}/>
                    <Route path="/change-password" element={<ChangePassword/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/seller/products" element={<SellerProductList />} />
                    <Route path="/UserPendingOrders" element={<UserPendingOrders/>} />
                    <Route path="/notification" element={<Notification/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/editprofile" element={<EditProfile/>} />
                    <Route path="/info" element={<Info/>} />
                </Routes>
                <ToastContainer/>
            </BrowserRouter>
        </>
    );
}

export default App;
