import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import AuthForm from "../../components/auth/AuthForm";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      // Store email for OTP verification
      localStorage.setItem("recoveryEmail", email);
      navigate("/verify-otp");
    } catch (error) {
      console.error("Forgot password request failed:", error);
    }
  };

  return (
    <AuthForm
      title="Forgot Password"
      onSubmit={handleSubmit}
      buttonText="Submit"
      footerText="Already have an account?"
      footerLink="/signin"
      footerLinkText="Sign in"
    >
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        required
      />
    </AuthForm>
  );
};

export default ForgotPassword;
