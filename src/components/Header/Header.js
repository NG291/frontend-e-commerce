import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaSignInAlt, FaUserShield, FaBell } from 'react-icons/fa';
import { Button, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/apiURL";
import axiosClient from "../../utils/axiosClient";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const userRole = localStorage.getItem('role');
        setIsLoggedIn(!!token);
        setRole(userRole);

        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const userID = localStorage.getItem('userId');
                    const response = await axiosClient.get(`${BASE_URL}/api/users/${userID}`);
                    setUsername(response.data.name);
                    setAvatar(response.data.avatar || 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png');
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                }
            };
            fetchUserInfo();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleRequestSellerRole = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await axiosClient.post(`${BASE_URL}/api/users/request-seller-role`, { username});
            toast.success(response.data);
        } catch (error) {
            toast.error('Error requesting seller role!');
            console.error(error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm header-fixed">
            <div className="container">
                {/* Logo and Home Link */}
                <Link to="/" className="nav-link link-body-emphasis px-2 d-flex align-items-center">
                    <FaHome className="me-1" /> Home
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* User's specific navigation */}
                        {role === 'ROLE_USER' && (
                            <li className="nav-item">
                                <Button variant="outline-primary" className="position-relative"
                                        onClick={() => navigate('/cart')}>
                                    <FaShoppingCart />
                                </Button>
                            </li>
                        )}

                        {/* Seller's specific navigation */}
                        {role === 'ROLE_SELLER' && (
                            <li className="nav-item">
                                <Button variant="link" onClick={() => navigate('/seller-page')} className="nav-link">
                                    <FaUserShield className="me-1" /> Seller Page
                                </Button>
                            </li>
                        )}

                        {/* Admin's specific navigation */}
                        {role === 'ROLE_ADMIN' && (
                            <li className="nav-item">
                                <Button variant="link" onClick={() => navigate('/admin')} className="nav-link">
                                    <FaUserShield className="me-1" /> Admin Page
                                </Button>
                            </li>
                        )}

                        {/* Notification button */}
                        <li className="nav-item">
                            <Link to="/notification" className="nav-link">
                                <FaBell className="me-1" />
                            </Link>
                        </li>

                        {/* User Profile and Auth dropdown */}
                        <li className="nav-item">
                            <Dropdown>
                                <Dropdown.Toggle variant="link" id="dropdown-basic" className="nav-link">
                                    {isLoggedIn ? (
                                        <>
                                            <img
                                                src={`${BASE_URL}/images/${avatar}`}
                                                alt="Avatar"
                                                className="rounded-circle" width="30" height="30" />
                                            <span className="ms-2">{username}</span>
                                        </>
                                    ) : (
                                        'Account'
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {isLoggedIn ? (
                                        <>
                                            <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                            {role === 'ROLE_USER' && (
                                                <>
                                                    <Dropdown.Item as={Link} to="/UserOrders">Completed Orders</Dropdown.Item>
                                                    <Dropdown.Item as={Link} to="/UserPendingOrders">Pending Orders</Dropdown.Item>
                                                </>
                                            )}
                                            {role === 'ROLE_USER' && (
                                                <Dropdown.Item onClick={handleRequestSellerRole} className="text-dark">
                                                    Request Seller Role
                                                </Dropdown.Item>
                                            )}
                                            <Dropdown.Item as={Link} to="/change-password">Change Password</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Dropdown.Item as={Link} to="/login">
                                                <FaSignInAlt /> Login
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/register">
                                                Sign up
                                            </Dropdown.Item>
                                        </>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
