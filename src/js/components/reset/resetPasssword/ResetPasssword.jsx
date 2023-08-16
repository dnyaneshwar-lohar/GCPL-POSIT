import React, { Component } from "react";
import { Card, Button } from "antd";
import { Form } from "react-bootstrap";
import "./ResetPasssword.css";
import axios from "axios";
import { BrowserRouter as Route, Link, Redirect, withRouter } from 'react-router-dom';
import Message from '../../shared/message';

class ResetPasssword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        Password: "",
        ConfirmPassword: "",
      },
      formErrors: {
        Password: "",
        ConfirmPassword: "",
      },
      formValidity: {
        Password: "",
        ConfirmPassword: "",
      },
      isSubmitting: false,
    };
  }

  handleChange = async ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    await this.setState({ formValues });
    await this.setState({ present: false });
    this.handleValidation(target);
  };

  handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const formValues = this.state.formValues;
    const isPassword = name === "Password";
    const isConfirmPassword = name === "ConfirmPassword";
    var passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6})/;
    validity[name] = value.length > 0;
    fieldValidationErrors[name] = validity[name]
      ? ""
      : `${name} is required and cannot be empty`;
    if (validity[name]) {
      if (isPassword) {
        validity[name] = passPattern.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} must contain one capital letter,one small letter,one special character`;
      }
      if (isConfirmPassword) {
        validity[name] = formValues.Password === value;
        console.log(validity[name]);
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `Password not match`;
      }
    }
    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { formValues, formValidity } = this.state;
    if (Object.values(formValidity).every(Boolean)) {
      this.sendResetConfirmationMail(
        this.getUrlParameter("token"),
        formValues.Password
      );
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

  sendResetConfirmationMail = async (token, newPassword) => {
    let res = await axios.post("http://localhost:4000/api/reset-password", {
      resetPasswordLink: token,
      newPassword: newPassword,
      role: this.props.role,
    });

    const message = res.data.message;
    if (message !== null) {
      Message.success(message);
      localStorage.removeItem('ResetToken');
      this.props.history.push("/login");
    }
  };

  getUrlParameter = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    let results = regex.exec(window.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  render = () => {
    const { formValues, formErrors, isSubmitting } = this.state;
    return (
      <div className="reset-container">
        <Card className="reset-pass-card">
          <p className="reset-pass-header">Reset your password</p>
          <div>
            <Form className="reset-pass-form" onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label
                  style={{ float: "left", marginTop: "6%", fontWeight: "700" }}
                >
                  New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="Password"
                  placeholder="Enter New Password"
                  className={`form-control ${
                    formErrors.Password ? "is-invalid" : ""
                  }`}
                  onChange={this.handleChange}
                  value={formValues.Password}
                />
                <div className="invalid-feedback">{formErrors.Password}</div>
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{ float: "left", marginTop: "6%", fontWeight: "700" }}
                >
                  Confirm New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Enter Confirm New Password"
                  className={`form-control ${
                    formErrors.ConfirmPassword ? "is-invalid" : ""
                  }`}
                  onChange={this.handleChange}
                  value={formValues.ConfirmPassword}
                />
                <div className="invalid-feedback">
                  {formErrors.ConfirmPassword}
                </div>
              </Form.Group>
              <Button
                type="primary"
                htmlType="submit"
                className="forget-pass-form-btn"
              >
                Continue
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  };
}

export default withRouter(ResetPasssword);
