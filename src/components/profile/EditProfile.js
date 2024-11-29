import React, { useState, useEffect } from "react";
import { Input, Button, Form, DatePicker, message, Card } from "antd";
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from "../../utils/apiURL";
import dayjs from "dayjs";  // Import dayjs
import { Link } from "react-router-dom"; // Import Link
import { CameraOutlined } from '@ant-design/icons';  // Icon cho ảnh đại diện
import "./profile.scss";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const EditProfile = ({ userId, onCloseEdit }) => {
    userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        birthDate: null,
        avatar: null,
    });

    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/users/${userId}`);
                const user = response.data;

                setFormData({
                    name: user.name || "",
                    phoneNumber: user.phoneNumber || "",
                    address: user.address || "",
                    birthDate: user.birthDate ? dayjs(user.birthDate) : null,
                    avatar: null,
                });
                setIsLoadingData(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                message.error("Không thể tải thông tin người dùng.");
                setIsLoadingData(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, birthDate: date }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar: file }));
        } else {
            message.error("Vui lòng chọn lại file hợp lệ.");
        }
    };

    const handleSave = async () => {
        const { name, phoneNumber, address, birthDate, avatar } = formData;

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", name);
        formDataToSubmit.append("phoneNumber", phoneNumber);
        formDataToSubmit.append("address", address);

        if (birthDate) {
            formDataToSubmit.append("birthDate", birthDate.format("YYYY-MM-DD"));
        }

        if (avatar) {
            formDataToSubmit.append("avatar", avatar);
        }

        setLoading(true);
        try {
            const response = await axiosClient.put(
                `${BASE_URL}/api/users/${userId}/update`,
                formDataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                message.success("Cập nhật thông tin thành công!");
                onCloseEdit();
            } else {
                message.error("Cập nhật thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Có lỗi xảy ra khi cập nhật thông tin.");
        }
        setLoading(false);
    };

    if (isLoadingData) {
        return (
            <div className="loading-container">
                <p>Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <Card title="Chỉnh sửa thông tin cá nhân" className="edit-profile-card shadow-lg rounded">
                    <Form layout="vertical" onFinish={handleSave}>
                        <Form.Item label="Tên" required>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên đầy đủ"
                                className="form-control"
                            />
                        </Form.Item>

                        <Form.Item label="Số điện thoại" required>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                className="form-control"
                            />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" required>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ"
                                className="form-control"
                            />
                        </Form.Item>

                        <Form.Item label="Ngày sinh">
                            <DatePicker
                                value={formData.birthDate}
                                onChange={handleDateChange}
                                format="YYYY-MM-DD"
                                className="form-control"
                            />
                        </Form.Item>

                        <Form.Item label="Ảnh đại diện">
                            <div className="avatar-upload-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="form-control-file"
                                    id="avatar-upload"
                                />
                                <label htmlFor="avatar-upload" className="avatar-label">
                                    <CameraOutlined className="avatar-icon" />
                                    {formData.avatar ? "Chọn ảnh khác" : "Chọn ảnh đại diện"}
                                </label>
                            </div>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} className="btn btn-success w-100">
                            Lưu
                        </Button>
                    </Form>

                    <Link to="/profile" className="btn btn-outline-primary mt-3 w-100">
                        Quay lại trang thông tin cá nhân
                    </Link>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default EditProfile;
