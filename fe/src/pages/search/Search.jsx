import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Table,
  Input,
  Button,
  Typography,
  Card,
  Spin,
  Empty,
  notification,
  Badge,
  Tag,
  Tooltip,
  Statistic,
  Modal,
  message,
  Rate,
} from "antd";
import {
  SearchOutlined,
  ShoppingOutlined,
  ReloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  DollarCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import "./Search.scss";
import { getAllProducts } from "../../utils/axios/Product";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const navigate = useNavigate();
  const isVip = localStorage.getItem("isVip") === "true";
  const [translatedText, setTranslatedText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]); // Cột tự động

  const handleLoginClick = () => {
    navigate("/login");
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Đặt lại sản phẩm được chọn
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isVip");
    setIsLoggedIn(false);
    message.success("Logged out successfully");
    window.location.reload();
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const fetchedData = await getAllProducts();
      if (fetchedData) {
        setResults(fetchedData);
        calculateStats(fetchedData);

        // Tạo cột động từ dữ liệu
        const dynamicColumns = Object.keys(fetchedData[0] || {}).map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          dataIndex: key,
          key,
          render: (text) =>
            typeof text === "string" && text.length > 30
              ? `${text.substring(0, 30)}...`
              : text,
        }));
        setColumns(dynamicColumns); // Cập nhật cột
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch products",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/products/search",
        { params: { keyword } }
      );
      setResults(response.data);
      calculateStats(response.data);

      if (isVip) {
        const translationResponse = await axios.post(
          "http://localhost:8080/api/translate/google/googleTranslate",
          {
            vietnameseText: keyword,
            targetLanguage: "en",
          }
        );
        setTranslatedText(translationResponse.data.translated);
      }

      notification.success({
        message: "Search Completed",
        description: `Found ${response.data.length} products`,
      });
    } catch (error) {
      notification.error({
        message: "Search Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    setStats({ total });
  };

  const handleRowClick = (record) => {
    setSelectedProduct(record);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchAllProducts(); // Tải dữ liệu khi component được gắn kết
  }, []);

  const dataSource = results.map((product) => ({
    key: product.id,
    ...product,
  }));

  return (
    <div className="search-container">
      {/* Header */}
      <div className="header">
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

      {/* Main Content */}
      <div className="content">
        <Title level={1}>Product Catalog</Title>
        <Text>Discover and search through our extensive collection</Text>

        {/* Search Bar */}
        <div className="searchbar-container">
          <Input
            className="search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter product name..."
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="search-button"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.total}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </div>

        <div className="translate-container">
          {/* VIP Translation Section */}
          <div className="translate">
            {isVip && translatedText && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="vip-translation"
              >
                <Card
                  className="vip-translation-card"
                  title={
                    <div className="vip-title">
                      <StarFilled className="vip-icon" />
                      <span>VIP Translation</span>
                    </div>
                  }
                >
                  <div className="vip-content">
                    <div className="vip-section">
                      <Text strong className="label">
                        Original Text:
                      </Text>
                      <Text className="content">{keyword}</Text>
                    </div>
                    <div className="vip-section">
                      <Text strong className="label">
                        English Translation:
                      </Text>
                      <Text className="content">{translatedText}</Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="refresh">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchAllProducts}
            >
              Refresh Catalog
            </Button>
          </div>
        </div>

        <div className="table-container">
          {/* Table */}
          {loading ? (
            <Spin />
          ) : results.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 8,
                current: currentPage,
                onChange: setCurrentPage,
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Modal */}
            <Modal
              title={null}
              open={isModalOpen}
              onCancel={onClose}
              footer={null}
              width={1000}
              className="custom-modal"
            >
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="modal-card"
                >
                  <div className="modal-header">
                    <img
                      src={selectedProduct.imageUrl || "/default-product.jpg"}
                      alt={selectedProduct.title}
                      className="modal-image"
                    />
                    <Title level={3} className="modal-title">
                      {selectedProduct.title}
                    </Title>
                  </div>
                  <div className="modal-body">
                    <div className="modal-details">
                      <div>
                        <Text strong>Price:</Text>{" "}
                        <Tag color="green" icon={<DollarCircleOutlined />}>
                          ${Number(selectedProduct.price).toFixed(2)}
                        </Tag>
                      </div>
                      <div>
                        <Text strong>Availability:</Text>{" "}
                        <Badge
                          status={
                            selectedProduct.availability ? "success" : "error"
                          }
                          text={
                            selectedProduct.availability
                              ? "In Stock"
                              : "Out of Stock"
                          }
                        />
                      </div>
                      <div>
                        <Text strong>Rating:</Text>{" "}
                        <Rate
                          disabled
                          defaultValue={parseFloat(selectedProduct.rating) || 0}
                        />
                      </div>
                      <div>
                        <Text strong>Description:</Text>{" "}
                        <Tooltip title={selectedProduct.description}>
                          <Text>
                            {selectedProduct.description
                              ? selectedProduct.description.substring(0, 50) +
                                "..."
                              : "No description available"}
                          </Text>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </Modal>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Search;
