import React, { useState, useEffect } from "react";
import { 
  Button, 
  message, 
  Input, 
  Typography,
  Select
} from "antd";
import {
  StarFilled,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  LaptopOutlined,
  ShopOutlined,
  SearchOutlined,
  FilterOutlined
} from "@ant-design/icons";
import "./Store.scss";
import { useNavigate, useLocation } from "react-router-dom";

export default function Store() {
  // States for data management
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search and Filter states
  const [nameSearch, setNameSearch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Định nghĩa columns cho Store
  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Store Name", accessorKey: "name" },
    { header: "Address", accessorKey: "address" },
    { header: "City", accessorKey: "city" },
    { header: "District", accessorKey: "district" }
  ];

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
    resetFilters();
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
      setTotalItems(data.length);

      // Extract unique values for filters
      const uniqueAddresses = [...new Set(data.map(store => store.address))].filter(Boolean);
      const uniqueCities = [...new Set(data.map(store => store.city))].filter(Boolean);
      const uniqueDistricts = [...new Set(data.map(store => store.district))].filter(Boolean);
      
      setAddresses(uniqueAddresses);
      setCities(uniqueCities);
      setDistricts(uniqueDistricts);
      setFilteredResults(data);

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
    fetchAllStores();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...results];

    // Filter by store name
    if (nameSearch) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // Filter by address
    if (selectedAddress) {
      filtered = filtered.filter(store => store.address === selectedAddress);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(store => store.city === selectedCity);
    }

    // Filter by district
    if (selectedDistrict) {
      filtered = filtered.filter(store => store.district === selectedDistrict);
    }

    setFilteredResults(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  }, [results, nameSearch, selectedAddress, selectedCity, selectedDistrict]);

  // Reset filters
  const resetFilters = () => {
    setNameSearch("");
    setSelectedAddress("");
    setSelectedCity("");
    setSelectedDistrict("");
  };

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

  return (
    <div className="store-page">
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
        <h1>Store Locations</h1>
        <p>Find our stores across the country</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <Input
                  placeholder="Search store name..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-cell">
              <label>Address</label>
              <Select
                placeholder="Select address"
                value={selectedAddress}
                onChange={value => setSelectedAddress(value)}
                className="filter-select"
                allowClear
              >
                {addresses.map(address => (
                  <Select.Option key={address} value={address}>
                    {address}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="filter-cell">
              <label>City</label>
              <Select
                placeholder="Select city"
                value={selectedCity}
                onChange={value => setSelectedCity(value)}
                className="filter-select"
                allowClear
              >
                {cities.map(city => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="filter-cell">
              <label>District</label>
              <Select
                placeholder="Select district"
                value={selectedDistrict}
                onChange={value => setSelectedDistrict(value)}
                className="filter-select"
                allowClear
              >
                {districts.map(district => (
                  <Select.Option key={district} value={district}>
                    {district}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Button 
              onClick={resetFilters}
              icon={<FilterOutlined />}
              className="reset-filters-button"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <Typography.Text>
            Found {totalItems} stores
          </Typography.Text>
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
              <p className="subtitle">Try adjusting your filters</p>
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
            >
              Previous
            </Button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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
              <Button 
                type="text" 
                icon={<span>✕</span>} 
                onClick={() => setShowModal(false)}
              />
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