import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Row, Col, Form, Button } from "react-bootstrap";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const { verifyOtp, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d+$/.test(newValue)) {
      const newOtp = [...otp];
      newOtp[index] = newValue.slice(-1); // Only keep the last character
      setOtp(newOtp);

      // Move focus to next input if this one is filled
      if (newValue !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus to previous input on backspace
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6);
      const newOtp = [...Array(6)].map((_, i) => digits[i] || "");
      setOtp(newOtp);

      // Focus the last input or the next empty one
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleResendOtp = () => {
    // Implementation for resending OTP
    console.log("Resending OTP...");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      alert("Please enter all digits of the OTP");
      return;
    }

    try {
      const email = localStorage.getItem("recoveryEmail") || "";
      await verifyOtp(email, otpString);
      navigate("/reset-password");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <AuthForm
      title="Sent OTP on Your Email"
      onSubmit={handleSubmit}
      buttonText="Submit"
    >
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4">
        <Row className="justify-content-center">
          {[...Array(6)].map((_, index) => (
            <Col xs={2} key={index} className="px-1">
              <Form.Control
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="text-center"
                style={{ height: "48px", fontSize: "1.25rem" }}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div className="text-center mb-3">
        <Button
          variant="link"
          onClick={handleResendOtp}
          className="p-0 text-decoration-none"
          style={{ fontSize: "0.9rem" }}
        >
          Resent OTP
        </Button>
      </div>

      <div className="text-end mt-3">
        <Link
          to="/signin"
          className="text-decoration-none"
          style={{ fontSize: "0.9rem" }}
        >
          Back to Login Page
        </Link>
      </div>
    </AuthForm>
  );
};

export default OtpVerification;
