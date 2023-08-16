import React, { Component } from "react";
import ReactDOM from "react-dom";
import "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { Button } from "antd";
import "./Registration_form.css";
import Resizer from "../../../../../node_modules/react-image-file-resizer";
import { Textbox, Radiobox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import validator from "validator";
import MessageDialog from "../message_dialog/MessageDialog.jsx";
import Player_img from "../assets/usericon.png";

class RegForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      gender: "",
      mobile_no: "",
      birth_year: "",
      photo: { Player_img },
      first_name_error: "false",
      last_name_error: "false",
      gender_error: "false",
      mobile_no_error: "false",
      birth_year_error: "false",
      photo_error: "false",
      validate: "",
      showMessage: ""
    };
    this.handleSubmitPlayer = this.handleSubmitPlayer.bind(this);
  }

  toggleValidating(validate) {
    this.setState({ validate });
  }

  handleUpdate = () => {
    this.props.getPlayerDetails();
  };

  handleSubmitPlayer = () => {
    const date = new Date();
    const stringDate = JSON.stringify(date);
    const valDate = stringDate.slice(1, 11);
    this.toggleValidating(true);
    const {
      first_name_error,
      last_name_error,
      mobile_no_error,
      birth_year_error,
      gender_error,
      photo_error
    } = this.state;
    if (
      !first_name_error &&
      !last_name_error &&
      !mobile_no_error &&
      !birth_year_error &&
      !gender_error
    ) {
      fetch("http://localhost:4000/playerRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          playerReg: {
            account_id: this.props.account_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            mobile_no: this.state.mobile_no,
            birth_year: this.state.birth_year,
            gender: this.state.gender,
            update_date: valDate,
            player_photo: this.state.photo
          }
        })
      });
      this.props.parentMethod();
      this.setState({ showMessage: true });
    }
  };

  playerPhotoHandler = () => {
    Resizer.imageFileResizer(
      event.target.files[0],
      192,
      192,
      "JPEG",
      100,
      0,
      uri => {
        this.setState({
          photo: uri
        });
      },
      "base64"
    );
  };

  render() {
    if (this.state.showMessage) {
      var showMessage = (
        <MessageDialog
          dialogMessage="Registered Successfully"
          messageType="positive"
          handleUpdate={this.handleUpdate}
        />
      );
    }
    const {
      first_name,
      last_name,
      gender,
      mobile_no,
      birth_year,
      photo,
      validate
    } = this.state;
    const genderFields = [
      { id: "Male", name: "Male" },
      { id: "Female", name: "Female" }
    ];
    return (
      <div className="container-fluid">
        <form className="regForm">
          <center>
            <h5>Registration Form</h5>
          </center>
          <div className="form-group ">
            <Textbox
              attributesInput={{
                className: "form-control registration_input",
                name: "first_name",
                placeholder: "First Name",
                type: "text"
              }}
              value={
                first_name.charAt(0).toUpperCase() +
                first_name.slice(1).toLowerCase()
              }
              onChange={(first_name, e) => {
                this.setState({ first_name });
              }}
              onBlur={e => {}}
              validate={validate}
              validationCallback={res =>
                this.setState({ first_name_error: res, validate: false })
              }
              validationOption={{
                className: "form-control",
                name: "First Name",
                reg: /^[a-zA-Z]*$/,
                check: true,
                required: true
              }}
            />
          </div>
          <div className="form-group ">
            <Textbox
              attributesInput={{
                className: "form-control registration_input",
                name: "last_name",
                placeholder: "Last Name",
                type: "text"
              }}
              value={
                last_name.charAt(0).toUpperCase() +
                last_name.slice(1).toLowerCase()
              }
              onChange={(last_name, e) => {
                this.setState({ last_name });
              }}
              onBlur={e => {}}
              validate={validate}
              validationCallback={res =>
                this.setState({ last_name_error: res, validate: false })
              }
              validationOption={{
                className: "form-control",
                name: "Last Name",
                reg: /^[a-zA-Z]*$/,
                check: true,
                required: true
              }}
            />
          </div>
          <div className="form-group ">
            <Textbox
              attributesInput={{
                className: "form-control registration_input",
                name: "mobile_no",
                placeholder: "Mobile Number",
                type: "text"
              }}
              value={mobile_no}
              onChange={(mobile_no, e) => {
                this.setState({ mobile_no });
              }}
              onBlur={e => {}}
              validate={validate}
              validationCallback={res =>
                this.setState({ mobile_no_error: res, validate: false })
              }
              validationOption={{
                className: "form-control",
                name: "Mobile Number",
                check: true,
                length: 10,
                required: true,
                customFunc: mobile_no => {
                  if (validator.isMobilePhone(mobile_no, "en-IN")) {
                    return true;
                  } else {
                    return "Please enter 10 digit valid mobile number.";
                  }
                }
              }}
            />
          </div>
          <div className="form-group ">
            <Textbox
              attributesInput={{
                className: "form-control registration_input",
                name: "birth_year",
                placeholder: "Birth Year",
                type: "text"
              }}
              value={birth_year}
              onChange={(birth_year, e) => {
                this.setState({ birth_year });
              }}
              onBlur={e => {}}
              validate={validate}
              validationCallback={res =>
                this.setState({ birth_year_error: res, validate: false })
              }
              validationOption={{
                className: "form-control  registration_input",
                name: "Birth year",
                check: true,
                required: true,
                customFunc: birth_year => {
                  if (
                    birth_year.length === 4 &&
                    birth_year >= 1935 &&
                    birth_year <= 2014
                  ) {
                    return true;
                  } else {
                    return "Birth year must be 4 digits from 1935 to 2014";
                  }
                }
              }}
            />
          </div>
          <div className="form-group form-inline">
            <div className="form_Label">
              <strong>
                <label> Select Gender:</label>
              </strong>
            </div>
            <div className="radioButtons">
              <Radiobox
                attributesWrapper={{}}
                attributesInputs={[
                  { id: "gen-0", name: "gender" },
                  { id: "gen-1", name: "gender" }
                ]}
                disabled={false}
                value={gender}
                validate={validate}
                validationCallback={res =>
                  this.setState({ gender_error: res, validate: false })
                }
                optionList={genderFields}
                customStyleContainer={{
                  display: "flex",
                  justifyContent: "flex-start"
                }}
                customStyleOptionListItem={{ marginRight: "50px" }}
                onChange={(gender, e) => {
                  this.setState({ gender });
                }}
                onBlur={e => {}}
                validationOption={{
                  name: "Gender",
                  check: true,
                  required: true
                }}
              />
            </div>
          </div>
          <div className="form-group form-inline">
            <div className="form_Label">
              <strong>
                <label>Select Player Photo:</label>
              </strong>
            </div>
            <Textbox
              attributesInput={{
                className: "form-control photoClass registration_input",
                name: "photo",
                placeholder: "Player photo",
                type: "file"
              }}
              onChange={this.playerPhotoHandler}
            />
          </div>
          <Button
            className="register_button"
            type="primary"
            onClick={this.handleSubmitPlayer}
          >
            Register
          </Button>
        </form>
        <div>{showMessage}</div>
      </div>
    );
  }
}
export default RegForm;
