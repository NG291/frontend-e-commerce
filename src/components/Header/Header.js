import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaSignInAlt, FaUserShield } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";

const Header = () => {
    const [show, setShow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in by verifying the presence of a JWT token
    // useEffect(() => {
    //     const token = localStorage.getItem('jwtToken');
    //     setIsLoggedIn(!!token); // Set true if token exists, else false
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsLoggedIn(!!token);
        setIsAdmin(localStorage.getItem('role') === 'ROLE_ADMIN'); // Check if admin
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsLoggedIn(!!token);
        setIsSeller(localStorage.getItem('role') === 'ROLE_SELLER'); // Check if seller
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                        <FaShoppingCart/>
                    </Button>
                </div>
            </header>
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                    <Modal.Title>Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Replace with dynamic cart items when available */}
                    <p>Your cart is currently empty.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => { /* Handle checkout action here */ }}>
                        Proceed to Checkout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Header;
