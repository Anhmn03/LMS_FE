import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState(null);
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();

  // Remove useEffect dependency on user state and handle navigation directly

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const result = await signIn(formData.email, formData.password);
      console.log("Sign in result:", result);

      if (result.success) {
        // Navigate based on user role directly after successful login
        const userRole = result.data.data?.user?.role?.name?.toLowerCase();
        console.log("User role for navigation:", userRole);

        if (userRole == "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      setLoginError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <AuthForm
      title="Sign in Your Account"
      onSubmit={handleSubmit}
      buttonText="Sign In"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >
      {(loginError || error) && (
        <Alert variant="danger" className="mb-4">
          {loginError || error}
        </Alert>
      )}

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          label="Remember my preference"
          checked={formData.rememberMe}
          onChange={handleChange}
        />

        <Link to="/forgot-password" className="text-decoration-none">
          Forgot Password?
        </Link>
      </div>
    </AuthForm>
  );
};

export default SignIn;
