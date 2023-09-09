import React from "react";
import { Card, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, setUserDetails } from "../helpers";
import { useDispatch } from "react-redux";

const LoginOtp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [contactNo, setContactNo] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    if (!isOtpSent) {
      setLoading(true);
      const sendOtpResp = await sendOtp(values);
      setLoading(false);

      if (sendOtpResp?.success) {
        setContactNo(values.contactNo);
        toast.success(sendOtpResp.msg);
        setIsOtpSent(true);
      } else {
        toast.error(sendOtpResp.msg);
      }
    } else {
      setLoading(true);
      const verifyOtpResp = await verifyOtp({ ...values, contactNo });
      setLoading(false);

      if (verifyOtpResp?.success) {
        toast.success(verifyOtpResp.msg);
        dispatch(setUserDetails(verifyOtpResp.data));
        navigate("/dashboard");
      } else {
        toast.error(verifyOtpResp.msg);
      }
    }
  };

  return (
    <div className="loginOtp">
      <Row justify="center" align="middle" style={{ minHeight: "90vh" }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            title="Task Management"
            style={{ width: "100%", maxWidth: 400, color: "#06d6a0" }}
          >
            <Form onFinish={onFinish} layout="vertical">
              {!isOtpSent && (
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
                        if (value.length > 10 || value.length < 10) {
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
              {isOtpSent && (
                <Form.Item
                  label="OTP"
                  name="loginOtp"
                  rules={[
                    {
                      required: true,
                      message: "Login Otp is required.",
                    },
                    () => ({
                      validator(_, value) {
                        if (isNaN(value)) {
                          return Promise.reject(
                            "Login Otp has to be a number."
                          );
                        }
                        if (value.length !== 6) {
                          return Promise.reject("Login Otp must be 6 digits");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input />
                </Form.Item>
              )}
              <Button loading={loading} type="primary" htmlType="submit" block>
                {isOtpSent ? "Verify OTP" : "Send OTP"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginOtp;
