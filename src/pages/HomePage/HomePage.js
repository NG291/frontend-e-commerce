import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from '../../utils/apiURL';
import './HomePage.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductList from "../../components/Product/ProductList";
import { Button, Container, Dropdown, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import unorm from 'unorm';
const HomePage = () => {
    const [products, setProducts] = useState([]);  // Sản phẩm đã lọc
    const [originalProducts, setOriginalProducts] = useState([]); // Sản phẩm gốc
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categoryProducts, setCategoryProducts] = useState([]);

    // Fetch products và categories khi trang được load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/all`);
                setProducts(response.data);
                setOriginalProducts(response.data);
            } catch (error) {
                setError("Error fetching products.");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                setError("Error fetching categories.");
                console.error("Error fetching categories:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    // Tìm kiếm sản phẩm
    const handleSearch = (e) => {
        e.preventDefault();
        let filteredProducts = [...categoryProducts]; // Dữ liệu đã lọc theo danh mục
        const normalizedSearchTerm = unorm.nfd(searchTerm).replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (normalizedSearchTerm !== '') {
            filteredProducts = filteredProducts.filter(product => {
                const normalizedProductName = unorm.nfd(product.name).replace(/[\u0300-\u036f]/g, '').toLowerCase();
                return normalizedProductName.includes(normalizedSearchTerm);
            });
        }
        setProducts(filteredProducts);
    };

    // Lọc theo danh mục
    const handleCategoryChange = async (category) => {
        setSelectedCategory(category);

        let filteredProducts = [...originalProducts]; // Bắt đầu từ toàn bộ sản phẩm gốc

        if (category !== '') {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/category?categoryName=${category}`);
                filteredProducts = response.data;
            } catch (error) {
                setError("Error fetching products by category.");
                console.error("Error fetching products by category:", error);
            }
        }

        // Cập nhật sản phẩm sau khi lọc danh mục
        setCategoryProducts(filteredProducts); // Lưu lại sản phẩm đã lọc theo danh mục
        setProducts(filteredProducts); // Cập nhật dữ liệu hiển thị
    };

    // Lọc theo giá
    const handlePriceFilter = () => {
        let filteredProducts = [...categoryProducts]; // Dữ liệu đã lọc theo danh mục

        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            return (minPrice ? price >= minPrice : true) && (maxPrice ? price <= maxPrice : true);
        });

        // Cập nhật sản phẩm sau khi lọc giá
        setProducts(filteredProducts);
    };

    return (
        <>
            <Header />
            <div className="py-3 mb-4 border-bottom">
                <div className="container">
                    <Row className="align-items-center">
                        {/* Bộ lọc giá - Bên trái */}
                        <Col xs={12} md={6} lg={4} className="d-flex mb-3 mb-md-0 justify-content-start">
                            <InputGroup className="w-auto">
                                <FormControl
                                    type="number"
                                    placeholder="Min Price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    style={{ fontSize: '0.9rem', padding: '0.375rem 0.75rem', width: '120px' }}
                                />
                                <FormControl
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    style={{ fontSize: '0.9rem', padding: '0.375rem 0.75rem', width: '120px' }}
                                />
                                <Button variant="outline-primary" onClick={handlePriceFilter}
                                        style={{ fontSize: '0.9rem', width: 'auto' }}>
                                    Lọc
                                </Button>
                            </InputGroup>
                        </Col>

                        {/* Tìm kiếm theo tên và lọc theo danh mục - Bên phải */}
                        <Col xs={12} md={6} lg={8} className="d-flex mb-3 mb-md-0 justify-content-end">
                            <InputGroup className="w-auto">
                                {/* Tìm kiếm theo tên */}
                                <FormControl
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '0.9rem', padding: '0.375rem 0.75rem', width: '200px' }}
                                />
                                <Button type="submit" variant="outline-primary" onClick={handleSearch}
                                        style={{ fontSize: '0.9rem' }}>
                                    Search
                                </Button>

                                {/* Dropdown lọc theo danh mục */}
                                <Dropdown className="ms-2">
                                    <Dropdown.Toggle variant="outline-primary" id="category-dropdown"
                                                     style={{ fontSize: '0.9rem' }}>
                                        {selectedCategory || "Category"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleCategoryChange('')}>All
                                            Categories</Dropdown.Item>
                                        {categories.map((category) => (
                                            <Dropdown.Item key={category.id}
                                                           onClick={() => handleCategoryChange(category.name)}>
                                                {category.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup>
                        </Col>
                    </Row>
                </div>
            </div>

            <Container>
                <ProductList products={products} loading={loading} error={error} />
            </Container>

            <Footer />
        </>
    );
};

export default HomePage;
