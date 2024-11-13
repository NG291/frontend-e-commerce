import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../utils/apiURL";

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                console.log("Authorization Header:", `Bearer ${localStorage.getItem("jwtToken")}`);
                const response = await axios.get(`${BASE_URL}/api/admin/employees`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                alert("Failed to fetch employee data.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleCreateEmployee = () => navigate("/create-employee");

    const handleResetPassword = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/admin/reset-password/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Password reset successfully!");
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("Failed to reset password.");
        }
    };

    const renderEmployees = () => {
        if (employees.length === 0) return <p>No employees found.</p>;

        return employees.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.contactphone}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td>
                    <button onClick={() => handleResetPassword(employee.id)}>Reset Password</button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <h1>Admin Page - Employee List</h1>
            <button onClick={handleCreateEmployee}>Create New Employee</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table border="1" style={{ marginTop: "20px" }}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>{renderEmployees()}</tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPage;
