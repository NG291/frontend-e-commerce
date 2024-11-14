import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import {FaShoppingCart, FaHome, FaSignInAlt} from "react-icons/fa";
import {Button, Modal} from "react-bootstrap";


const Header = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <nav className="py-2 bg-body-tertiary border-bottom">
                <div className="container d-flex flex-wrap">
                    <ul className="nav me-auto">
                        <li className="nav-item"><Link to="/"
                                                       className="nav-link link-body-emphasis px-2 d-flex align-items-center active"
                                                       aria-current="page"><FaHome className="me-1"/> Home</Link></li>
                        <li className="nav-item"><a href="#" className="nav-link link-body-emphasis px-2">Features</a>
                        </li>
                    </ul>
                    <ul className="nav">
                        <li className="nav-item"><Link to="/login"
                                                       className="nav-link link-body-emphasis px-2"><FaSignInAlt/> Login</Link>
                        </li>
                        <li className="nav-item"><a href="#" className="nav-link link-body-emphasis px-2">Sign up</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <a href="/"
                       className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4">Double header</span>
                    </a>
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
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Header