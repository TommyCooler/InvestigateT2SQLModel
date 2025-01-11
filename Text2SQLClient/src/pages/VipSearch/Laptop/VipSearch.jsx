import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import {
  StarFilled,
  LogoutOutlined,
  LaptopOutlined,
  ShopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./VipSearch.scss";

export default function VipSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("vip-search");
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const isVip = localStorage.getItem("isVip") === "true";
  const isLoggedIn = !!localStorage.getItem("user");

  // VIP access check
  useEffect(() => {
    if (!isLoggedIn || !isVip) {
      message.error("VIP access required");
      navigate("/");
    }
  }, [isVip, isLoggedIn, navigate]);

  // Handle navigation between tabs
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
    setKeyword("");
    setCurrentPage(1);
  };

  // Authentication handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isVip");
    message.success("Logged out successfully");
    navigate("/");
  };

  // Search operation
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
      setResults(data);
      setTotalItems(data.length);
      if (data.length === 0) {
        message.info("No results found");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
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
    if (isVip) {
      fetchAllLaptops();
    }
  }, [isVip]);

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

  if (!isVip || !isLoggedIn) {
    return null;
  }

  return (
    <div className="search-page">
      {/* Navigation Header */}
      <div className="header">
        <div className="navigation-header">
          <div className="nav-buttons">
            <Button
              type="primary"
              icon={<LaptopOutlined />}
              className={`nav-button ${activeTab === "vip-search" ? "active" : ""}`}
            >
              VIP Laptop
            </Button>
            <Button
              icon={<ShopOutlined />}
              onClick={() => handleNavigation("vip-store")}
              className={`nav-button ${activeTab === "vip-store" ? "active" : ""}`}
            >
              VIP Store
            </Button>
          </div>
        </div>

        {/* VIP Status */}
        <div className="user-status vip">
          <StarFilled />
          <span>VIP Member</span>
        </div>

        {/* Logout Button */}
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {/* Header Content */}
      <div className="header-content">
        <h1>VIP Laptop Catalog</h1>
        <p>Exclusive access to our premium laptop collection</p>
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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search laptops..."
                  className="vip-search-input"
                />
                <Button
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                  className="search-button vip-button"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="search-actions">
              <Button
                onClick={fetchAllLaptops}
                loading={loading}
                className="refresh-button vip-button"
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
              <table className="vip-table">
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
              Previous
            </Button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
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
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button onClick={() => setShowModal(false)} className="close-button">
                ✕
              </button>
            </div>
            <div className="modal-body">
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