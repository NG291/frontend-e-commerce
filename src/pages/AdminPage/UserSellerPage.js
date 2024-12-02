import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {
    Table,
    Button,
    Container,
    Spinner,
    Alert,
    Row,
    Col,
    Card,
    Form,
    Pagination,
    DropdownButton,
    Dropdown
} from "react-bootstrap";
import {BASE_URL} from "../../utils/apiURL";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const UserSellerPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5); // Default users per page
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/users`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const approveSeller = async (userId) => {
        try {
            await axios.post(`${BASE_URL}/api/admin/approve-seller/${userId}`, {}, {
                headers: {"Authorization": `Bearer ${localStorage.getItem("jwtToken")}`},
            });
            setUsers(prevUsers =>
                prevUsers.map(user => {
                    if (user.id === userId) {
                        return {
                            ...user,
                            roles: [...user.roles.filter(role => role.name !== 'ROLE_USER'),
                                {name: 'ROLE_SELLER'}]
                        };
                    }
                    return user;
                })
            );
            alert("Seller approved successfully.");
        } catch (error) {
            console.error("Error approving seller:", error);
            alert("Failed to approve seller.");
        }
    };

    const rejectSeller = async (userId) => {
        try {
            await axios.post(`${BASE_URL}/api/admin/reject-seller/${userId}`, {}, {
                headers: {"Authorization": `Bearer ${localStorage.getItem("jwtToken")}`},
            });
            alert("Seller rejected successfully.");
        } catch (error) {
            console.error("Error rejecting seller:", error);
            alert("Failed to reject seller.");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const shouldShowApprovalButtons = (user) => {
        return user.roles.some(role => role.name === 'ROLE_USER') &&
            !user.roles.some(role => role.name === 'ROLE_SELLER' || role.name === 'ROLE_ADMIN');
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderUsers = () => {
        if (currentUsers.length === 0) {
            return (
                <tr>
                    <td colSpan="9">
                        <Alert variant="warning">No users found.</Alert>
                    </td>
                </tr>
            );
        }
        return currentUsers.map((user) => (
            <tr key={user.id}>
                <td>{user.username || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.age !== null && user.age !== undefined ? user.age : "N/A"}</td>
                <td>{user.phoneNumber || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
                <td>{user.salary !== null && user.salary !== undefined ? user.salary : "N/A"}</td>
                <td>
                    {user.roles.length > 0 ? (
                        user.roles.map((role, index) => (
                            <span key={index} className="badge bg-primary me-1">
                                {role.name}
                            </span>
                        ))
                    ) : (
                        "N/A"
                    )}
                </td>
                <td>
                    {shouldShowApprovalButtons(user) && (
                        <>
                            <Button
                                variant="success"
                                onClick={() => approveSeller(user.id)}
                                className="me-2"
                            >
                                Approve
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => rejectSeller(user.id)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </td>
            </tr>
        ));
    };

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
            pageNumbers.push(i);
        }
        return (
            <Pagination>
                {pageNumbers.map(number => (
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}
            </Pagination>
        );
    };

    return (
        <>
            <Header/>
            <Container fluid className="mt-5">
                <Row className="mb-4">
                    <Col md={8}>
                        <h1>User & Seller List</h1>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Username or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <DropdownButton title={`Items per page: ${usersPerPage}`} variant="secondary">
                            <Dropdown.Item onClick={() => {
                                setUsersPerPage(5);
                                setCurrentPage(1);
                            }}>5</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setUsersPerPage(10);
                                setCurrentPage(1);
                            }}>10</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setUsersPerPage(15);
                                setCurrentPage(1);
                            }}>15</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary"/>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Salary</th>
                                    <th>Roles</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>{renderUsers()}</tbody>
                            </Table>
                            {renderPagination()}
                        </Card.Body>
                    </Card>
                )}
                <div className="text-center mt-2">
                    <Link to="/" className="text-decoration-none text-primary fw-bold">&larr; Back to Homepage</Link>
                </div>
            </Container>
            <Footer/>
        </>
    );
};

export default UserSellerPage;
