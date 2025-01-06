import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
} from "antd";
import {
  StarFilled,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  LaptopOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import './Store.scss';
import { useNavigate, useLocation } from "react-router-dom";

export default function Store() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const isVip = localStorage.getItem("isVip") === "true";
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add state for active tab
  const [activeTab, setActiveTab] = useState(location.pathname === "/store" ? "store" : "laptop");

  // Handle navigation between tabs
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
    setKeyword('');
    setResults([]);
    setCurrentPage(1);
  };

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

  // Handle the search operation
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/search?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all laptops (or products)
  const fetchAllLaptops = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/laptops');
      if (!response.ok) throw new Error('Failed to fetch laptops');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLaptops();
  }, []);

  useEffect(() => {
    if (results && results.length > 0) {
      const dynamicColumns = Object.keys(results[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessorKey: key
      }));
      setColumns(dynamicColumns);
      setTotalItems(results.length);
    }
  }, [results]);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="search-page">
      {/* Navigation Header */}
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

      {/* User Header Section */}
      <div className="header">
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
        <div className="header-content">
          <h1>StoreStore Catalog</h1>
          <p>Browse and search through our collection of store</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Stats Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search laptops by name, type, or specifications..."
                />
                <button onClick={handleSearch} className="search-button">
                  🔍
                </button>
              </div>
            </div>
            
            <div className="search-actions">
              <button onClick={fetchAllLaptops} className="refresh-button">
                Refresh List
              </button>
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
                <button onClick={() => setError(null)} className="close-button">✕</button>
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
                    <tr key={row.id || rowIndex} onClick={() => handleRowClick(row)}>
                      {columns.map((column) => (
                        <td key={column.accessorKey}>
                          {column.accessorKey === 'price' 
                            ? <span className="price-value">${Number(row[column.accessorKey]).toFixed(2)}</span>
                            : row[column.accessorKey]}
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
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Prev
            </button>
            <span className="page-info">{currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
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