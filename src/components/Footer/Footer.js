import React from 'react';
import "./Footer.scss";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
      <footer className="footer bg-orange">
        <div className="container py-4 text-center">
          <div className="footer-links d-flex justify-content-center align-items-center text-white">
            <Link to="/" className="footer-link text-uppercase">Privacy Policy</Link>
            <span className="footer-divider"></span>
            <Link to="/" className="footer-link text-uppercase">Terms of Service</Link>
            <span className="footer-divider"></span>
            <Link to="/" className="footer-link text-uppercase">About E-commerce</Link>
          </div>
          <div className="footer-bottom mt-3">
          <span className="text-black fw-bold copyright-text text-manrope fs-14">
            &copy; 2024 E-commerce. All Rights Reserved.
          </span>
          </div>
        </div>
      </footer>
  );
};
export default Footer;
