import React from "react";
import { Card, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login, signUp, setUserDetails } from "../helpers";
import { useDispatch } from "react-redux";

const LoginSignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    if (isLogin) {
      setLoading(true);
      const loginResp = await login(values);
      setLoading(false);
      if (loginResp?.success) {
        toast.success(loginResp.msg);
        dispatch(setUserDetails(loginResp.data));
        navigate("/dashboard");
      } else {
        toast.error(loginResp.msg);
      }
    } else {
      setLoading(true);
      const signUpResp = await signUp(values);
      setLoading(false);
      if (signUpResp?.success) {
        toast.success(signUpResp.msg);
        setIsLogin(true);
      } else {
        toast.error(signUpResp.msg);
      }
    }
  };

  const handleLoginOtp = () => {
    navigate("login-otp");
  };

  return (
    <div className="loginSignup">
      <Row justify="center" align="middle" style={{ minHeight: "90vh" }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            title="Banking Application"
            style={{ width: "100%", maxWidth: 400, color: "#06d6a0" }}
          >
            <Form onFinish={onFinish} layout="vertical">
              {!isLogin && (
                <Form.Item label="First Name" name="firstName">
                  <Input />
                </Form.Item>
              )}
              {!isLogin && (
                <Form.Item label="Last Name" name="lastName">
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {!isLogin && (
                <Form.Item
                  label="Contact no."
                  name="contactNo"
                  rules={[
                    {
                      required: true,
                      message: "Contact no. is required.",
                    },
                    () => ({
                      validator(_, value) {
                        if (isNaN(value)) {
                          return Promise.reject(
                            "Contact no. has to be a number."
                          );
                        }
                        if (value.length !== 10) {
                          return Promise.reject(
                            "Contact no. must be 10 digits"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  block
                >
                  {isLogin ? "Login" : "SignUp"}
                </Button>
              </Form.Item>
              {isLogin && (
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleLoginOtp}
                    htmlType="submit"
                    block
                  >
                    Login With OTP
                  </Button>
                </Form.Item>
              )}
              {isLogin ? "Create new account?" : "Already have an account?"}
              <Button
                style={{ color: "#06d6a0" }}
                type="link"
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginSignUp;
