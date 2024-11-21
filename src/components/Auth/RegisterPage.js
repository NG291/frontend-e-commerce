import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterPage.scss';
import { BASE_URL } from "../../utils/apiURL";

const RegisterPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(1, 'Username must have at least 1 character')
                .max(50, 'Username must not exceed 50 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Email must be a valid format')
                .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Email must be a @gmail.com')
                .required('Email is required'),
            password: Yup.string()
                .min(4, 'Password must have at least 4 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post(`${BASE_URL}/api/auth/register`, values);
                toast.success('Registration successful!', { autoClose: 200 });
                navigate('/login');
            } catch (error) {
                // Handle backend validation errors properly
                const errorResponse = error.response?.data;
                if (errorResponse) {
                    // Check for specific validation errors
                    if (errorResponse.includes("User already existed!")) {
                        toast.error('Username is already taken. Please choose another one.', { autoClose: 200 });
                    }
                    if (errorResponse.includes("Email already existed!")) {
                        toast.error('Email is already in use. Please use another email.', { autoClose: 200 });
                    }
                    // Display other validation errors if any
                    if (errorResponse.username) {
                        toast.error(`Username error: ${errorResponse.username}`, { autoClose: 200 });
                    }
                    if (errorResponse.email) {
                        toast.error(`Email error: ${errorResponse.email}`, { autoClose: 200 });
                    }
                    if (errorResponse.password) {
                        toast.error(`Password error: ${errorResponse.password}`, { autoClose: 200 });
                    }
                } else {
                    toast.error('Registration failed. Please try again!', { autoClose: 200 });
                }
            }
        },
    });

    return (
        <div className="register-page d-flex align-items-center justify-content-center vh-100">
            <div className="register-form-container container p-4 border rounded shadow" style={{ maxWidth: '400px' }}>
                <h2 className="register-title text-center">Register</h2>
                <form onSubmit={formik.handleSubmit} className="register-form">
                    <div className="input-field mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${formik.errors.username && formik.touched.username ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('username')}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="invalid-feedback">{formik.errors.username}</div>
                        )}
                    </div>
                    <div className="input-field mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${formik.errors.email && formik.touched.email ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="input-field mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${formik.errors.password && formik.touched.password ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="invalid-feedback">{formik.errors.password}</div>
                        )}
                    </div>
                    <button type="submit" className="register-btn w-100" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account? <Link to="/login">Login now!</Link></p>
                </div>
                <div className="text-center mt-2">
                    <Link to="/" className="text-decoration-none">&larr; Back to Homepage</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
