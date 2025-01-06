import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import {
  StarFilled,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  LaptopOutlined,
  ShopOutlined,
  SearchOutlined,
  TranslationOutlined
} from "@ant-design/icons";
import "./Search.scss";
import { useNavigate, useLocation } from "react-router-dom";

export default function Search() {
  // States for data management
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // User status
  const isVip = localStorage.getItem("isVip") === "true";

  // Tab state
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/store" ? "store" : "laptop"
  );

  // Handle navigation between tabs
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
    setKeyword("");
    setResults([]);
    setCurrentPage(1);
  };

  // Authentication handlers
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isVip");
    setIsLoggedIn(false);
    message.success("Logged out successfully");
    window.location.reload();
  };

  // Basic search operation
  const handleSearch = async () => {
    if (!keyword.trim()) {
      message.warning("Please enter a search keyword");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Search results:', data);
      setResults(data);
      setTotalItems(data.length);
      if (data.length === 0) {
        message.info("No results found for your search");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
      message.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Natural Language Query search with translation
  const handleNLQSearch = async () => {
    if (!keyword.trim()) {
      message.warning("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First translate the query
      const translateResponse = await fetch('http://localhost:8080/googleTranslate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vietnameseText: keyword,
          targetLanguage: 'en'
        })
      });

      if (!translateResponse.ok) {
        throw new Error('Translation failed');
      }

      const translateData = await translateResponse.json();
      console.log('Translated query:', translateData);

      // Then search using the translated query
      const searchResponse = await fetch('http://localhost:8080/searchByNLQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vietnameseText: keyword,
          targetLanguage: 'en'
        })
      });

      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchData = await searchResponse.json();
      setResults(searchData);
      setTotalItems(searchData.length);

      if (searchData.length === 0) {
        message.info("No results found");
      }
    } catch (err) {
      console.error('NLQ Search error:', err);
      setError('Search failed. Please try again.');
      message.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all laptops
  const fetchAllLaptops = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/laptops', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch laptops');
      }

      const data = await response.json();
      console.log('Fetched laptops:', data);
      setResults(data);
      setTotalItems(data.length);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch laptops. Please try again.');
      message.error('Failed to load laptops. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllLaptops();
  }, []);

  // Set up columns when data is loaded
  useEffect(() => {
    if (results && results.length > 0) {
      const dynamicColumns = Object.keys(results[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessorKey: key,
      }));
      setColumns(dynamicColumns);
    }
  }, [results]);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Row click handler
  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="search-page">
      {/* Navigation Header */}
      <div className="header">
        <div className="navigation-header">
          <div className="nav-buttons">
            <Button
              type={activeTab === "laptop" ? "primary" : "default"}
              icon={<LaptopOutlined />}
              onClick={() => handleNavigation("laptop")}
              className={`nav-button ${activeTab === "laptop" ? "active" : ""}`}
            >
              Laptop
            </Button>
            <Button
              type={activeTab === "store" ? "primary" : "default"}
              icon={<ShopOutlined />}
              onClick={() => handleNavigation("store")}
              className={`nav-button ${activeTab === "store" ? "active" : ""}`}
            >
              Store
            </Button>
          </div>
        </div>

        {/* User Status Section */}
        {isLoggedIn && (
          <div className={`user-status ${isVip ? "vip" : "normal"}`}>
            {isVip ? (
              <>
                <StarFilled />
                <span>VIP Member</span>
              </>
            ) : (
              <>
                <UserOutlined />
                <span>Normal Member</span>
              </>
            )}
          </div>
        )}

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
      </div>

      {/* Header Content */}
      <div className="header-content">
        <h1>Laptop Catalog</h1>
        <p>Browse and search through our collection of laptops</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNLQSearch()}
                  placeholder="Tìm kiếm laptop (có thể dùng tiếng Việt)..."
                />
                <div className="search-buttons">
                  <Button
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                    className="search-button"
                    title="Basic Search"
                  >
                    Search
                  </Button>
                  <Button
                    icon={<TranslationOutlined />}
                    onClick={handleNLQSearch}
                    loading={loading}
                    className="nlq-search-button"
                    title="Search in Vietnamese"
                  >
                    VN Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="search-actions">
              <Button
                onClick={fetchAllLaptops}
                loading={loading}
                className="refresh-button"
              >
                Refresh List
              </Button>
              <div className="total-products">
                <span className="label">Total Products:</span>
                <span className="value">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Popup */}
        {error && (
          <div className="error-popup">
            <div className="error-popup-content">
              <div className="error-popup-header">
                <h2>Error</h2>
                <button onClick={() => setError(null)} className="close-button">
                  ✕
                </button>
              </div>
              <div className="error-details">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="results-table">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading data...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <p className="title">No laptops found</p>
              <p className="subtitle">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.accessorKey}>{column.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, rowIndex) => (
                    <tr
                      key={row.id || rowIndex}
                      onClick={() => handleRowClick(row)}
                    >
                      {columns.map((column) => (
                        <td key={column.accessorKey}>
                          {column.accessorKey === "price" ? (
                            <span className="price-value">
                              ${Number(row[column.accessorKey]).toFixed(2)}
                            </span>
                          ) : (
                            row[column.accessorKey]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Prev
            </Button>
            <span className="page-info">
              {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-header">
                <h2>{selectedProduct.name}</h2>
                <button onClick={() => setShowModal(false)} className="close-button">
                  ✕
                </button>
              </div>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Price</span>
                  <p className="price-value">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </p>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Type</span>
                  <p className="spec-value">{selectedProduct.type}</p>
                </div>
                <div className="spec-item">
                  <span className="spec-label">CPU</span>
                  <p className="spec-value">{selectedProduct.cpu}</p>
                </div>
                <div className="spec-item">
                  <span className="spec-label">GPU</span>
                  <p className="spec-value">{selectedProduct.gpu}</p>
                </div>
                <div className="spec-item">
                  <span className="spec-label">RAM</span>
                  <p className="spec-value">{selectedProduct.ram}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}