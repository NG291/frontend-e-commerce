import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserShield } from "react-icons/fa";
import { Button } from "react-bootstrap";

const Header = () => {
    const [show, setShow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsLoggedIn(!!token);
        setIsAdmin(localStorage.getItem('role') === 'ROLE_ADMIN');
        setIsSeller(localStorage.getItem('role') === 'ROLE_SELLER');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <>
            <nav className="py-2 bg-body-tertiary border-bottom">
                <div className="container d-flex flex-wrap">
                    <ul className="nav me-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link link-body-emphasis px-2 d-flex align-items-center">
                                <FaHome className="me-1"/> Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/features" className="nav-link link-body-emphasis px-2">Features</Link>
                        </li>
                    </ul>
                    <ul className="nav me-auto">
                        {isAdmin && (
                            <li className="nav-item">
                                <Button
                                    variant="link"
                                    onClick={() => navigate('/admin')}
                                    className="nav-link link-body-emphasis px-2"
                                >
                                    <FaUserShield className="me-1"/> Admin Page
                                </Button>
                            </li>
                        )}
                    </ul>
                    <ul className="nav me-auto">
                        {isSeller && (
                            <li className="nav-item">
                                <Button
                                    variant="link"
                                    onClick={() => navigate('/seller-page')}
                                    className="nav-link link-body-emphasis px-2"
                                >
                                    <FaUserShield className="me-1"/> Seller Page
                                </Button>
                            </li>
                        )}
                    </ul>

                    <ul className="nav">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <Button variant="link" onClick={handleLogout}
                                        className="nav-link link-body-emphasis px-2">
                                    Logout
                                </Button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link link-body-emphasis px-2">
                                        <FaSignInAlt/> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link link-body-emphasis px-2">Sign up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <Link to="/"
                          className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4 bold">E-commerce</span>
                    </Link>
                    <form className="col-12 col-lg-auto mb-3 mb-lg-0" role="search">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
                    </form>
                    <Button className="ms-2" variant="outline-primary" onClick={handleShow}>
                        <Link to="/cart" className="text-decoration-none text-dark">
                            <FaShoppingCart />
                        </Link>
                    </Button>
                </div>
            </header>
        </>
    );
}

export default Header;
