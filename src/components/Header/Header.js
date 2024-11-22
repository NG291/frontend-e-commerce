import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaHome, FaShoppingCart, FaSignInAlt, FaUserShield} from "react-icons/fa";
import {Button} from "react-bootstrap";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsLoggedIn(!!token);
        setIsAdmin(localStorage.getItem('role') === 'ROLE_ADMIN');
        setIsSeller(localStorage.getItem('role') === 'ROLE_SELLER');
        setIsUser(localStorage.getItem('role') === 'ROLE_USER');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <nav className="sticky-top py-2 bg-body-tertiary border-bottom">
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
                        {isUser && (<li className="nav-item">
                            <Link to="/change-password" className="nav-link link-body-emphasis px-2">
                                Change Password
                            </Link>
                        </li>)}
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
                    <ul className="nav">
                        {isLoggedIn ? (
                            <ul className="nav me-auto">
                                <li className="nav-item">
                                    <Link to="/UserOrders" className="nav-link link-body-emphasis px-2">Đơn hàng</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/UserPendingOrders" className="nav-link link-body-emphasis px-2">Đơn hàng của bạn</Link>
                                </li>

                </ul>

                <ul className="nav">
                    {isLoggedIn ? (
                        <ul className="nav me-auto">
                            <li className="nav-item">
                            <Button variant="link" onClick={handleLogout}
                                    className="nav-link link-body-emphasis px-2">
                                Logout
                            </Button>
                        </li>
                    </ul>
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
</>
)
    ;
}

export default Header;
