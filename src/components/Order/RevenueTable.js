import React, {useState} from "react";
import {Button, Table, Form, Spinner, Alert} from "react-bootstrap"; // Sử dụng React Bootstrap
import axios from "axios";
import {toast} from "react-toastify"; // Thêm thông báo
import "react-toastify/dist/ReactToastify.css";
import {BASE_URL} from "../../utils/apiURL"; // Import BASE_URL từ file cấu hình
import * as XLSX from "xlsx";
import Footer from "../Footer/Footer"; // Import thư viện SheetJS (xlsx)

const RevenueTable = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const formatDate = (date) => {
        if (!date) return "Undefined";
        try {
            if (Array.isArray(date)) {
                const formattedDate = new Date(
                    date[0],
                    date[1] - 1,
                    date[2],
                    date[3] || 0,
                    date[4] || 0,
                    date[5] || 0,
                    date[6] || 0
                );
                const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
                return formattedDate.toLocaleDateString('vi-VN', options);
            }
            return new Date(date).toLocaleDateString('vi-VN');
        } catch {
            return "Undefined";
        }
    };

    const validateDateRange = () => {
        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            toast.error("Please select both start and end dates!");
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date cannot be later than end date.");
            toast.error("Start date must be before end date!");
            return false;
        }

        return true;
    };

    const fetchRevenueData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chuyển đổi định dạng ngày
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            // Gửi yêu cầu đến API
            const token = localStorage.getItem('jwtToken'); // Hoặc từ Redux, Context, v.v.

            const response = await axios.get(`${BASE_URL}/api/revenue`, {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setRevenueData(response.data);
            if (response.data.length === 0) {
                toast.info("No revenue data found for the selected date range.");
            } else {
                toast.success("Revenue data fetched successfully!");
            }
        } catch (err) {
            setError("Unable to fetch revenue data. Please try again.");
            toast.error("Error fetching revenue data!");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateDateRange()) {
            fetchRevenueData();
        }
    };

    // Hàm xuất dữ liệu ra file Excel
    const exportToExcel = () => {
        // Chuyển dữ liệu thành định dạng phù hợp với Excel
        const ws = XLSX.utils.json_to_sheet(revenueData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Revenue Data");

        // Tạo file Excel và tải xuống
        XLSX.writeFile(wb, `revenue_data_${startDate}_to_${endDate}.xlsx`);
    };

    return (
        <>
            <header/>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Revenue Management</h1>

                {/* Form nhập phạm vi ngày */}
                <Form onSubmit={handleSubmit} className="d-flex justify-content-center mb-4">
                    <Form.Group controlId="startDate" className="mx-2">
                        <Form.Label>Start Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="endDate" className="mx-2">
                        <Form.Label>End Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="align-self-end mx-2">
                        {loading ? <Spinner animation="border" size="sm"/> : "Fetch Revenue"}
                    </Button>
                </Form>

                {/* Hiển thị lỗi */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Hiển thị bảng doanh thu */}
                {revenueData.length > 0 && !loading && (
                    <div>
                        <Button
                            variant="success"
                            onClick={exportToExcel}
                            className="mb-3"
                        >
                            Export to Excel
                        </Button>
                        <Table striped bordered hover className="mt-4">
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity Sold</th>
                                <th>Total Revenue</th>
                                <th>Order Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {revenueData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.orderId}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price.toLocaleString()} VND</td>
                                    <td>{item.quantitySold}</td>
                                    <td>{item.totalRevenue.toLocaleString()} VND</td>
                                    <td>{formatDate(item.orderDate)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                {!loading && revenueData.length === 0 && !error && (
                    <p className="text-center mt-4">No data available for the selected date range.</p>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default RevenueTable;