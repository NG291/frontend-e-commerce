import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Container, Spinner, Alert, Row, Col, Card, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";

const SellerPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/products/all`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Failed to fetch product data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/"); // Điều hướng về trang chủ
    };

    const handleAddProduct = () => navigate("/add-product");

    const handleEditProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Product deleted successfully!");
            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/products/search?query=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            setProducts(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error searching products:", error);
            alert("Failed to search products.");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const renderProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

        if (currentProducts.length === 0) {
            return (
                <tr>
                    <td colSpan="5">
                        <Alert variant="warning">No products found.</Alert>
                    </td>
                </tr>
            );
        }

        return currentProducts.map((product) => (
            <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td className="d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" onClick={() => handleEditProduct(product.id)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                    </Button>
                </td>
            </tr>
        ));
    };

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <Container fluid className="mt-5">
            <Row className="mb-4">
                <Col md={8}>
                    <h1>Seller Page - Product List</h1>
                </Col>
                <Col md={4} className="d-flex justify-content-end gap-2">
                    <Button variant="primary" onClick={() => navigate("/")}>
                        HomePage
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>

            <Row className="align-items-center mb-3">
                <Col md={5}>
                    <Form.Control
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Button variant="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-end">
                    <DropdownButton
                        id="dropdown-items-per-page"
                        title={`Show ${itemsPerPage} per page`}
                        onSelect={(value) => handleItemsPerPageChange(Number(value))}
                    >
                        <Dropdown.Item eventKey="5">5</Dropdown.Item>
                        <Dropdown.Item eventKey="10">10</Dropdown.Item>
                        <Dropdown.Item eventKey="15">15</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleAddProduct}>
                        Add New Product
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading...</p>
                </div>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>{renderProducts()}</tbody>
                        </Table>
                        <div className="d-flex justify-content-between mt-3">
                            <Button variant="secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}

            <div className="text-center mt-2">
                <Link to="/" className="text-decoration-none">&larr; Back to Homepage</Link>
            </div>
        </Container>
    );
};

export default SellerPage;
