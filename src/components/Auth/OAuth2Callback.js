import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OAuth2Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy token từ URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            // Lưu token vào localStorage
            localStorage.setItem('jwtToken', token);

            // Redirect người dùng sau khi lưu token
            toast.success('Login successful! Redirecting...');
            navigate('/'); // Điều hướng tới trang chính hoặc trang mong muốn
        } else {
            toast.error('Login failed! No token found.');
            navigate('/login'); // Điều hướng quay lại trang login
        }
    }, [navigate]);

    return (
        <div className="text-center mt-5">
            <h1>Processing...</h1>
        </div>
    );
};

export default OAuth2Callback;