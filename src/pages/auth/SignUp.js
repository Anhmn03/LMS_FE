import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import AuthForm from "../../components/auth/AuthForm";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { signUp, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("Passwords don't match");
      return;
    }

    try {
      const userData = {
        fullName: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        role: "60d0fe4f5311236168a109cc", // Using the role from your sample JSON
      };

      await signUp(userData);
      navigate("/verify-otp");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  return (
    <AuthForm
      title="Signup Your Account"
      onSubmit={handleSubmit}
      buttonText="Sign Up"
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
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

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

      <FormInput
        label="Confirm Password"
        type="password"
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={handleChange}
        required
      />
    </AuthForm>
  );
};

export default SignUp;
