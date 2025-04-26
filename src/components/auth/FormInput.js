import React from "react";
import { Form } from "react-bootstrap";

const FormInput = ({ label, type, name, value, onChange, placeholder }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type || "text"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
    </Form.Group>
  );
};

export default FormInput;
