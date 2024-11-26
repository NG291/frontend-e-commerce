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
    Dropdown,
    DropdownButton
} from "react-bootstrap";
import {BASE_URL} from "../../utils/apiURL";
import {toast} from "react-toastify";
import Swal from 'sweetalert2';

const SellerPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/products/seller`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.success("Failed to fetch product data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // Lọc sản phẩm dựa trên searchTerm
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset lại trang khi tìm kiếm
    }, [searchTerm, products]);

    const handleAddProduct = () => navigate("/add-product");

    const handleEditProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            toast.success("Product deleted successfully!");
            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product.");
        }
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const renderProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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
                <td>{product.price.toLocaleString('vi-VN')} VND</td>
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
        <>

            <Container fluid className="mt-5">
                <Row className="mb-4">
                    <Col md={8}>
                        <h1>Seller Page - Product List</h1>
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
                    <Col md={3} className="d-flex align-items-center justify-content-end">
                        <DropdownButton
                            id="dropdown-items-per-page"
                            title={`Show ${itemsPerPage} per page`}
                            variant="secondary"
                            onSelect={(value) => handleItemsPerPageChange(Number(value))}
                        >
                            <Dropdown.Item eventKey="5">5</Dropdown.Item>
                            <Dropdown.Item eventKey="10">10</Dropdown.Item>
                            <Dropdown.Item eventKey="15">15</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                    <Col md={2} className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleAddProduct}>
                            Add New Product
                        </Button>
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
                                <Button variant="secondary" onClick={handlePreviousPage}
                                        disabled={currentPage === 1}>
                                    Previous
                                </Button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <Button variant="secondary" onClick={handleNextPage}
                                        disabled={currentPage === totalPages}>
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
        </>
    );
};

export default SellerPage;
