import {Outlet} from "react-router";
import './Layout.css';
import {BsDoorClosed, BsFileEarmark, BsFillHouseDoorFill, BsGearWideConnected} from "react-icons/bs";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {FaHome, FaUserShield} from "react-icons/fa";

function Layout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="container-fluid ">
            <div className="row">
                <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                    <div
                        className="offcanvas-md offcanvas-end bg-body-tertiary"
                        tabIndex={-1}
                        id="sidebarMenu"
                        aria-labelledby="sidebarMenuLabel"
                    >

                        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto bg-light text-dark">
                            <ul className="nav flex-column list-unstyled">
                                <li className="nav-item">
                                    <Link to="/seller-page" className="nav-link d-flex align-items-center gap-2">
                                        <FaUserShield/>Seller Page</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/SellerOrders" className="nav-link d-flex align-items-center gap-2">
                                        <BsFileEarmark/>Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/PendingOrders" className="nav-link d-flex align-items-center gap-2">
                                        <BsFileEarmark/>New order</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                                        <svg className="bi">
                                            <use xlinkHref="#people"/>
                                        </svg>
                                        Customers
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                                        <svg className="bi">
                                            <use xlinkHref="#graph-up"/>
                                        </svg>
                                        Reports
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                                        <svg className="bi">
                                            <use xlinkHref="#puzzle"/>
                                        </svg>
                                        Integrations
                                    </a>
                                </li>
                            </ul>
                            <hr className="my-3"/>
                            <ul className="nav flex-column mb-auto ">
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                                        <BsGearWideConnected/>
                                        Settings
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center gap-2" href="#"
                                       onClick={handleLogout}>
                                        <BsDoorClosed/>
                                        Sign out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Header/>
                    <Outlet/>
                    <Footer/>
                </main>
            </div>
        </div>
    )
}

export default Layout;