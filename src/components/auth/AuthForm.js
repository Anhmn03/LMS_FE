import React from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AuthForm = ({
  children,
  title,
  onSubmit,
  buttonText,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="w-100" style={{ maxWidth: "450px" }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img
              src="/images/OIP.jpg"
              alt="Oxford Logo"
              className="mx-auto mb-2"
              style={{ height: "60px" }}
            />
            <h2 className="fw-bold">{title}</h2>
          </div>

          <Form onSubmit={onSubmit}>
            {children}

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2 mt-3"
              style={{ backgroundColor: "#0a2463", borderColor: "#0a2463" }}
            >
              {buttonText}
            </Button>
          </Form>

          {footerText && (
            <div className="text-center mt-3">
              <p>
                {footerText}{" "}
                <Link to={footerLink} className="text-decoration-none">
                  {footerLinkText}
                </Link>
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthForm;
