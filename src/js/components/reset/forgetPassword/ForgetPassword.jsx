import React, { Component } from "react";
import { Card, Button } from "antd";
import { Form } from "react-bootstrap";
import "./ForgetPassword.css";
import axios from "axios";
import { BrowserRouter as Route, Link, Redirect } from "react-router-dom";
import Message from "../../shared/message";

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        Email: "",
      },
      formErrors: {
        Email: "",
      },
      formValidity: {
        Email: false,
      },
      isSubmitting: false,
      present: false,
    };
  }

  handleChange = async ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    await this.setState({ formValues });
    this.alreadyPresent(formValues.Email);
    this.handleValidation(target);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { formValues, formValidity } = this.state;
    if (Object.values(formValidity).every(Boolean)) {
      if (this.state.present === true) {
        this.sendResetMail(formValues.Email);
        Message.success(
          `We sent a reset password email to ${formValues.Email}. Please click the reset password link to set your new password.`
        );
        await this.setState({ present: false });
      } else {
        Message.error(`The email you entered could not be found.`);
      }
      this.setState({ isSubmitting: false });
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key],
        };
        this.handleValidation(target);
      }
      this.setState({ isSubmitting: false });
    }
  };

  handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const isEmail = name === "Email";
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    validity[name] = value.length > 0;
    fieldValidationErrors[name] = validity[name]
      ? ""
      : `${name} is required and cannot be empty`;
    if (validity[name]) {
      if (isEmail) {
        validity[name] = emailTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} should be a valid email address`;
      }
    }
    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity,
    });
  };

  alreadyPresent = async (email) => {
    let res = await axios.post("http://localhost:4000/api/alreadyPresent", {
      email_id: email,
      role: this.props.role,
    });

    if (res.data.present === false) {
      await this.setState({
        present: false,
      });
    } else if (res.data.present === true) {
      await this.setState({
        present: true,
      });
    }
  };

  sendResetMail = async (email) => {
    let res = await axios.post("http://localhost:4000/api/forget-password", {
      email_id: email,
      role: this.props.role,
    });

    localStorage.setItem("ResetToken", res.data.token);
  };

  render = () => {
    const { formValues, formErrors, isSubmitting } = this.state;
    return (
      <div className="forget-container">
        <Card className="forget-pass-card">
          <p className="forget-pass-header">Reset your password</p>
          <p className="forget-pass-description">
            Enter your user account's verified email address and we will send
            you a password reset link.
          </p>
          <div>
            <Form className="forget-pass-form" onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label
                  style={{ float: "left", marginTop: "6%", fontWeight: "700" }}
                >
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="Email"
                  placeholder="Enter your email address"
                  className={`form-control ${
                    formErrors.Email ? "is-invalid" : ""
                  }`}
                  onChange={this.handleChange}
                  value={formValues.Email}
                />
                <div className="invalid-feedback">{formErrors.Email}</div>
              </Form.Group>
              <Button
                type="primary"
                htmlType="submit"
                className="forget-pass-form-btn"
              >
                Continue
              </Button>
              <Form.Group>
                <div className="forget-pass-login-link">
                  Remember your account password ? Back to{" "}
                  <Link to="/login">Login</Link>
                </div>
              </Form.Group>
            </Form>
          </div>
        </Card>
      </div>
    );
  };
}
