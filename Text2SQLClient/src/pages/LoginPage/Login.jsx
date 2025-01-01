import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function LoginCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("isVip", response.data.vip);
      
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
      message.error("Login failed. Please check your credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-blue-50"
        >
          Back to Home
        </Button>

        <Card 
          className="w-full shadow-2xl rounded-xl border-2 border-blue-50 backdrop-blur-sm bg-white/90"
        >
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

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your username!" }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
                className="rounded-lg h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg h-12"
              />
            </Form.Item>

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

            <Divider className="!mb-4">
              <Text className="text-gray-400">or</Text>
            </Divider>

            <div className="text-center">
              <Text className="text-gray-500">
                Don't have an account? {' '}
                <Button 
                  type="link" 
                  className="!p-0 !m-0 font-medium hover:text-purple-600"
                  onClick={() => message.info("Feature coming soon!")}
                >
                  Sign up now
                </Button>
              </Text>
            </div>
          </Form>
        </Card>

        <div className="text-center mt-8">
          <Text className="text-gray-500">
            © 2024 Your Company. All rights reserved.
          </Text>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginCustomer;
