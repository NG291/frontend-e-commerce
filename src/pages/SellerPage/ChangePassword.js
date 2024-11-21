import React from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from "../../utils/apiURL";

const ChangePassword = () => {
    const navigate = useNavigate();

    // Validation schema using Yup
    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old Password is required"),
        newPassword: Yup.string()
            .min(4, "New Password must be at least 4 characters")
            .required("New Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const { oldPassword, newPassword } = values;

        try {
            const userId = localStorage.getItem("userId"); // Assumes userId is stored in localStorage
            const response = await axiosClient.post(
                `${BASE_URL}/api/users/${userId}/change-password`,
                { oldPassword, newPassword }
            );

            toast.success(response.data);
            resetForm(); // Reset form fields
            navigate("/"); // Redirect to HomePage after success
        } catch (error) {
            const errorMessage = error.response?.data || "Error changing password.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false); // Stop form submission state
        }
    };

    return (
        <Container className="my-5 d-flex justify-content-center">
            <div style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Change Password</h2>
                <Formik
                    initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <FormikForm>
                            <div className="mb-3">
                                <label htmlFor="oldPassword" className="form-label">
                                    Old Password
                                </label>
                                <Field
                                    type="password"
                                    name="oldPassword"
                                    className="form-control"
                                    placeholder="Enter old password"
                                />
                                <ErrorMessage
                                    name="oldPassword"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password
                                </label>
                                <Field
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    placeholder="Enter new password"
                                />
                                <ErrorMessage
                                    name="newPassword"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm New Password
                                </label>
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirm new password"
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Change Password"}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default ChangePassword;
