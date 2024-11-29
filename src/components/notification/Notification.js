import React, {useEffect, useState} from "react";
import {List, Spin, Alert} from "antd";
import "./Notification.scss"
import axiosClient from "../../utils/axiosClient";
import {BASE_URL} from "../../utils/apiURL";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userID = localStorage.getItem("userId");
                const response = await axiosClient.get(`${BASE_URL}/api/notifications/user/${userID}`);
                setNotifications(response.data);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải danh sách thông báo. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return (<div className="loading-container">
            <Spin size="large" tip="Đang tải thông báo..."/>
        </div>);
    }

    // Hiển thị lỗi
    if (error) {
        return (<div className="error-container">
            <Alert message="Lỗi" description={error} type="error" showIcon/>
        </div>);
    }

    const formatDate = (date) => {
        if (!date) return "Undefined";
        try {
            if (Array.isArray(date)) {
                const formattedDate = new Date(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0, date[5] || 0, date[6] || 0);
                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };
                return formattedDate.toLocaleString('vi-VN', options);
            }
            return new Date(date).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch {
            return "Undefined";
        }
    };

    return (
        <>
            <Header/>
        <div className="notifications-container">
            <h2>Danh sách thông báo</h2>
            {notifications.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <span className="notification-title">
                                    <strong>Thông báo:</strong>
                                </span>
                                }
                                description={
                                    <>
                                        <p className="notification-message">{item.message}</p>
                                        <small className="notification-time">
                                            <strong>Date created:</strong> {formatDate(item.createdAt)}
                                        </small>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <p>Không có thông báo nào.</p>
            )}
        </div>
            <Footer/>
        </>
    );
}
    export default Notifications;