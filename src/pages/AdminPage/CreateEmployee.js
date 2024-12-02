import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {toast, ToastContainer} from "react-toastify";
import {BASE_URL} from "../../utils/apiURL";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header/Header";

const CreateEmployee = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(5, "Username must be at least 5 characters")
            .max(20, "Username must be at most 20 characters")
            .required("Username is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        name: Yup.string().required("Name is required"),
        birthDate: Yup.date()
            .nullable()
            .test("age", "Age must be between 18 and 60", (value) => {
                if (!value) return false;
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                return age >= 18 && age <= 60;
            })
            .required("Birth Date is required"),
        phone: Yup.string()
            .matches(/^0\d{9}$/, "Phone number must start with '0' and be 10 digits long")
            .required("Phone is required"),
        address: Yup.string().required("Address is required"),
        salary: Yup.number()
            .min(1, "Salary must be greater than 0")
            .max(99999999, "Salary must be less than 100,000,000")
            .required("Salary is required"),
    });

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            await axios.post(`${BASE_URL}/api/admin/create`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            toast.success("Employee created successfully!");
            setTimeout(() => navigate("/admin"), 2000);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to create employee. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Header/>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow" style={{width: "600px"}}>
                    <h3 className="text-center mb-4">Create Employee</h3>
                    <Formik
                        initialValues={{
                            username: "",
                            email: "",
                            name: "",
                            birthDate: "",
                            phone: "",
                            address: "",
                            salary: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({isSubmitting}) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <Field
                                            name="username"
                                            type="text"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="username" component="div" className="text-danger"/>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-danger"/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="birthDate" className="form-label">Birth Date</label>
                                        <Field
                                            name="birthDate"
                                            type="date"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="birthDate" component="div" className="text-danger"/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <Field
                                            name="phone"
                                            type="text"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-danger"/>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <Field
                                            name="address"
                                            type="text"
                                            className="form-control"
                                        />
                                        <ErrorMessage name="address" component="div" className="text-danger"/>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="salary" className="form-label">Salary</label>
                                    <Field
                                        name="salary"
                                        type="number"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="salary" component="div" className="text-danger"/>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Create"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate("/admin")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <ToastContainer/>
            </div>
            <footer/>
        </div>
    );
};

export default CreateEmployee;
