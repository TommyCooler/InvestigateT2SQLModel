import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Divider, Spin } from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Validate Form
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  // Handle Login
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Log request data for debugging
      console.log('Login attempt with:', {
        username: values.username,
        timestamp: new Date().toISOString()
      });

      const response = await axios.post(
        "http://localhost:8080/user/login",
        {
          username: values.username,
          password: values.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000 // 5 seconds timeout
        }
      );

      // Log successful response
      console.log('Login response:', {
        status: response.status,
        timestamp: new Date().toISOString()
      });

      if (response.data) {
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("isVip", response.data.vip);
        
        // Show success message
        message.success({
          content: response.data.message || "Login successful!",
          duration: 2,
          style: {
            marginTop: '20vh',
          },
        });

        // Clear form
        form.resetFields();

        // Navigate to home page
        navigate("/");
      }
    } catch (error) {
      // Log error details
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });

      // Show appropriate error message
      if (error.code === "ECONNABORTED") {
        message.error("Connection timeout. Please try again.");
      } else if (error.response) {
        // Server responded with error
        message.error(error.response.data?.message || "Login failed. Please check your credentials!");
      } else if (error.request) {
        // Request made but no response
        message.error("No response from server. Please try again later.");
      } else {
        // Other errors
        message.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error("Please check your input!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-blue-50"
        >
          Back to Home
        </Button>

        {/* Login Card */}
        <Card 
          className="w-full shadow-2xl rounded-xl border-2 border-blue-50 backdrop-blur-sm bg-white/90"
        >
          <Spin spinning={loading}>
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Title level={2} className="!mb-2 !text-transparent !bg-clip-text !bg-gradient-to-r from-blue-600 to-purple-600">
                  Welcome Back!
                </Title>
                <Text className="text-gray-500">
                  Sign in to access our services
                </Text>
              </motion.div>
            </div>

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              size="large"
              validateMessages={validateMessages}
            >
              {/* Username Field */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                  { min: 3, message: "Username must be at least 3 characters!" }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Username"
                  className="rounded-lg h-12"
                  autoComplete="username"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  { min: 6, message: "Password must be at least 6 characters!" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  className="rounded-lg h-12"
                  autoComplete="current-password"
                />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item className="mb-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium text-base"
                >
                  Sign In
                </Button>
              </Form.Item>

              {/* Divider */}
              <Divider className="!mb-4">
                <Text className="text-gray-400">or</Text>
              </Divider>

              {/* Sign Up Link */}
              <div className="text-center">
                <Text className="text-gray-500">
                  Don't have an account? {' '}
                  <Button 
                    type="link" 
                    className="!p-0 !m-0 font-medium hover:text-purple-600"
                    onClick={() => {
                      message.info("Registration feature coming soon!");
                    }}
                  >
                    Sign up now
                  </Button>
                </Text>
              </div>
            </Form>
          </Spin>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text className="text-gray-500">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Text>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;