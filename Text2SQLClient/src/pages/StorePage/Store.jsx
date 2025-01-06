import React, { useState, useEffect } from "react";
import { 
  Button, 
  message, 
  Card, 
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
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Định nghĩa cứng columns cho Store
  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Store Name", accessorKey: "name" },
    { header: "Address", accessorKey: "address" },
    { header: "City", accessorKey: "city" },
    { header: "District", accessorKey: "district" }
  ];

  // Filter states
  const [cityFilter, setCityFilter] = useState(null);
  const [districtFilter, setDistrictFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

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
      const response = await fetch(`http://localhost:8080/store/search?keyword=${encodeURIComponent(keyword)}`, {
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
        message.info("No stores found for your search");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
      message.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all stores
  const fetchAllStores = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = 'http://localhost:8080/store/all?';
      if (filters.city) url += `city=${filters.city}&`;
      if (filters.district) url += `district=${filters.district}`;

      const response = await fetch(url, {
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
      console.log('Fetched stores:', data);
      setResults(data);
      setTotalItems(data.length);

      // Extract unique cities and districts for filters
      const uniqueCities = [...new Set(data.map(store => store.city))];
      setCities(uniqueCities);

      const uniqueDistricts = [...new Set(data.map(store => store.district))];
      setDistricts(uniqueDistricts);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch stores. Please try again.');
      message.error('Failed to load stores. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    fetchAllStores({
      city: cityFilter,
      district: districtFilter
    });
  };

  // Reset filters
  const resetFilters = () => {
    setCityFilter(null);
    setDistrictFilter(null);
    fetchAllStores();
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllStores();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Row click handler
  const handleRowClick = (store) => {
    setSelectedStore(store);
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
        <h1>Store Locations</h1>
        <p>Find our stores across the country</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <Input
                  placeholder="Search stores..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined />}
                  suffix={
                    <Button
                      type="link"
                      icon={<FilterOutlined />}
                      onClick={() => setShowFilters(!showFilters)}
                    />
                  }
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="filter-section">
            <Card title="Filters" className="filter-card">
              <div className="city-filter">
                <Typography.Title level={5}>City</Typography.Title>
                <Select
                  placeholder="Select city"
                  value={cityFilter}
                  onChange={(value) => setCityFilter(value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {cities.map(city => (
                    <Select.Option key={city} value={city}>
                      {city}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              
              <div className="district-filter">
                <Typography.Title level={5}>District</Typography.Title>
                <Select
                  placeholder="Select district"
                  value={districtFilter}
                  onChange={(value) => setDistrictFilter(value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {districts.map(district => (
                    <Select.Option key={district} value={district}>
                      {district}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div className="filter-actions">
                <Button type="primary" onClick={handleFilterChange}>
                  Apply Filters
                </Button>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </Card>
          </div>
        )}

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
          ) : results.length === 0 ? (
            <div className="empty-state">
              <p className="title">No stores found</p>
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