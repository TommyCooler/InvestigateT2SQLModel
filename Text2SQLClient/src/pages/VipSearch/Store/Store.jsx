import React, { useState, useEffect } from "react";
import { 
  Button, 
  message, 
  Typography
} from "antd";
import {
  StarFilled,
  LogoutOutlined,
  LaptopOutlined,
  ShopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./VipStore.scss";

export default function VipStore() {
  // States for data management
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("vip-store");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Định nghĩa columns cho Store
  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Store Name", accessorKey: "name" },
    { header: "Address", accessorKey: "address" },
    { header: "City", accessorKey: "city" },
    { header: "District", accessorKey: "district" }
  ];

  // Router hooks and auth state
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

  // Handle navigation
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
  };

  // Authentication handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isVip");
    message.success("Logged out successfully");
    navigate("/");
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredResults(results);
      setTotalItems(results.length);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = results.filter(store => {
      return (
        store.name.toLowerCase().includes(searchTermLower) ||
        store.address.toLowerCase().includes(searchTermLower) ||
        store.city.toLowerCase().includes(searchTermLower) ||
        store.district.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredResults(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  // Update filtered results when search term changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, results]);

  // Fetch all stores
  const fetchAllStores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/store/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const data = await response.json();
      setResults(data);
      setFilteredResults(data);
      setTotalItems(data.length);
      setSearchTerm("");

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch stores. Please try again.');
      message.error('Failed to load stores. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isVip) {
      fetchAllStores();
    }
  }, [isVip]);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Row click handler
  const handleRowClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  if (!isVip || !isLoggedIn) {
    return null;
  }

  return (
    <div className="store-page">
      {/* Navigation Header */}
      <div className="header">
        <div className="navigation-header">
          <div className="nav-buttons">
            <Button
              icon={<LaptopOutlined />}
              onClick={() => handleNavigation("vip-search")}
              className={`nav-button ${activeTab === "vip-search" ? "active" : ""}`}
            >
              VIP Laptop
            </Button>
            <Button
              type="primary"
              icon={<ShopOutlined />}
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
        <h1>VIP Store Locations</h1>
        <p>Exclusive access to our store network</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search stores..."
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
                onClick={fetchAllStores}
                loading={loading}
                className="refresh-button vip-button"
              >
                Refresh List
              </Button>
              <div className="total-products">
                <span className="label">Total Stores:</span>
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
          ) : filteredResults.length === 0 ? (
            <div className="empty-state">
              <p className="title">No stores found</p>
              <p className="subtitle">Please try again with different search term</p>
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
                          {row[column.accessorKey]}
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

      {/* Store Detail Modal */}
      {showModal && selectedStore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedStore.name}</h2>
              <button onClick={() => setShowModal(false)} className="close-button">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="store-details">
                <div className="detail-item">
                  <span className="label">Store ID:</span>
                  <span className="value">{selectedStore.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Address:</span>
                  <span className="value">{selectedStore.address}</span>
                </div>
                <div className="detail-item">
                  <span className="label">City:</span>
                  <span className="value">{selectedStore.city}</span>
                </div>
                <div className="detail-item">
                  <span className="label">District:</span>
                  <span className="value">{selectedStore.district}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}