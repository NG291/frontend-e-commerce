import React, { useEffect, useState } from "react";
import { Spinner, Alert, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from "../../utils/apiURL";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./profile.scss";
import { Link } from "react-router-dom";

const Info = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userID = localStorage.getItem("userId");
                const response = await axiosClient.get(`${BASE_URL}/api/users/${userID}`);
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                Đang tải thông tin người dùng...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert variant="danger">
                    Lỗi: {error}
                </Alert>
            </div>
        );
    }

    return (
        <>
            <Header />
            <Container className="profile-container">
                <Row className="my-5 justify-content-center">
                    <Col md={8}>
                        <Card className="profile-card">
                            <Card.Body>
                                {user ? (
                                    <Form>
                                        <Row>
                                            <Col sm={4} className="text-center">
                                                <div className="profile-avatar-container">
                                                    <img
                                                        src={`${BASE_URL}/images/${user.avatar}`}
                                                        alt="Avatar"
                                                        className="profile-avatar"
                                                    />
                                                </div>
                                            </Col>
                                            <Col sm={8}>
                                                <Form.Group controlId="formUserName">
                                                    <Form.Label>Tên</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={user.name}
                                                        readOnly
                                                    />
                                                </Form.Group>

                                            </Col>
                                        </Row>
                                    </Form>
                                ) : (
                                    <p>Không có thông tin người dùng.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Info;
