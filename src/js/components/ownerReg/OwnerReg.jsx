import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Textbox, Radiobox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./OwnerReg.css";
import validator from "validator";
import { message, notification, Tooltip } from "antd";
import Select from "react-select";
import { Link } from "react-router-dom";
import Message from "../shared/message";
import Player_img from "./usericon.png";
import Resizer from "../../../../node_modules/react-image-file-resizer";

const flatOptions = [
  {
    value: "101",
    label: "101",
  },
  {
    value: "102",
    label: "102",
  },
  {
    value: "103",
    label: "103",
  },
  {
    value: "104",
    label: "104",
  },
];

const ownerOptions = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

const phaseOptions = [
  {
    value: "Phase1",
    label: "Phase1",
  },
  {
    value: "Phase2",
    label: "Phase2",
  },
  {
    value: "Phase3",
    label: "Phase3",
  },
  {
    value: "Phase4",
    label: "Phase4",
  },
];
const buildingOptions = [
  {
    value: "LotusA",
    label: "LotusA",
  },
  {
    value: "LotusB",
    label: "LotusB",
  },
  {
    value: "LotusC",
    label: "LotusC",
  },
  {
    value: "LotusD",
    label: "LotusD",
  },
];

message.config({
  top: 30,
  duration: 1,
  maxCount: 1,
  rtl: false,
});

const customStyles = {
  border: "0px solid white",
  option: (provided, state) => ({
    ...provided,
    color: "#21bfb2",
    padding: 10,
    "&:hover": {
      color: "#FFF",
      backgroundColor: "#21bfb2",
    },
  }),
};

var flagEmail = 0;
var arrayEmail = [];
var flagMobile = 0;
var arrayMobile = [];
var regStatus = "Pending with admin";
const date = new Date();
const stringDate = JSON.stringify(date);
const valDate = stringDate.slice(1, 11);
var namePattern = /^[a-zA-Z]*$/;
var passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6})/;
var user = "";
class OwnerReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phaseError: null,
      buildingError: null,
      flatError: null,
      ownerError: null,
      selectedPhase: "",
      selectedBuilding: "",
      selectedFlat: "",
      selectedOwner: "",
      hasPhaseError: true,
      hasBuildingError: true,
      hasFlatError: true,
      hasOwnerError: true,
      hasFirstNameError: true,
      hasLastNameError: true,
      hasGenderError: true,
      hasBirthYearError: true,
      hasPasswordError: true,
      hasMobileNoError: true,
      hasEmailError: true,
      validate: false,
      allEmail: [],
      allMobile: [],
      email: "",
      mobileNo: "",
      account_id: "",
      photo: { Player_img },
      account: {
        firstName: "",
        lastName: "",
        birthYear: "",
        password: "",
      },
      account_gender: {
        gender: "",
      },
    };
    this.handlePhaseChange = this.handlePhaseChange.bind(this);
    this.handlePhaseFocus = this.handlePhaseFocus.bind(this);
    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleBuilingFocus = this.handleBuilingFocus.bind(this);
    this.handleFlatChange = this.handleFlatChange.bind(this);
    this.handleFlatFocus = this.handleFlatFocus.bind(this);
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleOwnerFocus = this.handleOwnerFocus.bind(this);
  }

  componentDidMount() {
    this.getEmail();
    this.getMobile();
  }
  handlePhaseChange = (selectedPhase) => {
    this.setState({ selectedPhase });
    if (selectedPhase != null) {
      this.setState({ phaseError: "", hasPhaseError: false });
    }
  };

  handlePhaseFocus = (selectedPhase) => {
    if (this.state.selectedPhase.value == null) {
      this.setState({ phaseError: "Please Select Phase", hasPhaseError: true });
    }
  };
  handleBuildingChange = (selectedBuilding) => {
    this.setState({ selectedBuilding });
    if (selectedBuilding != null) {
      this.setState({ buildingError: "", hasBuildingError: false });
    }
  };

  handleBuilingFocus = (selectedBuilding) => {
    if (this.state.selectedBuilding.value == null) {
      this.setState({
        buildingError: "Please Select Building",
        hasBuildingError: true,
      });
    }
  };

  handleFlatChange = (selectedFlat) => {
    this.setState({ selectedFlat });
    if (selectedFlat != null) {
      this.setState({ flatError: "", hasFlatError: false });
    }
  };

  handleFlatFocus = (selectedFlat) => {
    if (this.state.selectedFlat.value == null) {
      this.setState({
        flatError: "Please Select Flat",
        hasFlatError: true,
        selectedFlat: "",
      });
    }
  };

  handleOwnerChange = (selectedOwner) => {
    this.setState({ selectedOwner });
    if (selectedOwner != null) {
      this.setState({ ownerError: "", hasOwnerError: false });
    }
  };

  handleOwnerFocus = (selectedOwner) => {
    if (this.state.selectedOwner.value == null) {
      this.setState({ ownerError: "Please Select Owner", hasOwnerError: true });
    }
  };

  getEmail = () => {
    fetch("http://localhost:4000/email")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          allEmail: findresponse.data,
        });
      })
      .then((findresponse) => {
        this.state.allEmail.map((emailData) => {
          arrayEmail.push(emailData.email_id);
        });
      });
  };

  getMobile = () => {
    fetch("http://localhost:4000/mobile")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          allMobile: findresponse.data,
        });
      })
      .then((findresponse) => {
        this.state.allMobile.map((mobileData) => {
          arrayMobile.push(mobileData.mobile_no);
        });
      });
  };

  toggleValidating = (validate) => {
    this.setState({
      validate,
    });
  };

  validateForm = async (e) => {
    e.preventDefault();
    this.toggleValidating(true);
    if (this.state.selectedPhase.value == null) {
      this.setState({ phaseError: "Please Select Phase", hasPhaseError: true });
    }

    if (this.state.selectedBuilding.value == null) {
      this.setState({
        buildingError: "Please Select Building",
        hasBuildingError: true,
      });
    }
    if (this.state.selectedFlat.value == null) {
      this.setState({ flatError: "Please Select Flat", hasFlatError: true });
    }
    if (this.state.selectedOwner.value == null) {
      this.setState({ ownerError: "Please Select Owner", hasOwnerError: true });
    }

    const {
      hasPhaseError,
      hasBuildingError,
      hasFlatError,
      hasOwnerError,
      hasFirstNameError,
      hasLastNameError,
      hasGenderError,
      hasBirthYearError,
      hasPasswordError,
      hasMobileNoError,
      hasEmailError,
    } = this.state;

    if (
      !hasPhaseError &&
      !hasBuildingError &&
      !hasFlatError &&
      !hasOwnerError &&
      !hasFirstNameError &&
      !hasLastNameError &&
      !hasGenderError &&
      !hasBirthYearError &&
      !hasPasswordError &&
      !hasMobileNoError &&
      !hasEmailError
    ) {
      await fetch(
        "http://localhost:4000/account/add?mobile_no=" +
          this.state.mobileNo +
          "&password=" +
          this.state.account.password +
          "&user_first_name=" +
          this.state.account.firstName +
          "&user_last_name=" +
          this.state.account.lastName +
          "&phase_no=" +
          this.state.selectedPhase.value +
          "&building_no=" +
          this.state.selectedBuilding.value +
          "&flat_no=" +
          this.state.selectedFlat.value +
          "&owner=" +
          this.state.selectedOwner.value +
          "&email_id=" +
          this.state.email +
          "&birth_year=" +
          this.state.account.birthYear +
          "&update_date=" +
          valDate +
          "&gender=" +
          this.state.account_gender.gender
      )
        .then(async (response) => await response.json())
        .then(
          async (response) =>
            await this.setState(
              {
                account_id: response.account_id,
              },
              () => {
                this.playerRegister();
              }
            )
        );
    } else {
      message.error("Please Fill the Form correctly..!");
    }
  };

  playerRegister = () => {
    fetch("http://localhost:4000/playerRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerReg: {
          account_id: this.state.account_id,
          first_name: this.state.account.firstName,
          last_name: this.state.account.lastName,
          mobile_no: this.state.mobileNo,
          birth_year: this.state.account.birthYear,
          gender: this.state.account_gender.gender,
          update_date: valDate,
          player_photo: this.state.photo,
        },
      }),
    });
    Message.success(
      "Hello " +
        this.state.account.firstName +
        ",Your account created successfully..!"
    );
    this.props.history.push("/login");
  };

  playerPhotoHandler = () => {
    Resizer.imageFileResizer(
      event.target.files[0],
      192,
      192,
      "JPEG",
      100,
      0,
      (uri) => {
        this.setState({
          photo: uri,
        });
      },
      "base64"
    );
  };

  render() {
    const {
      account,
      validate,
      account_gender,
      email,
      mobileNo,
      selectedPhase,
      selectedBuilding,
      selectedFlat,
      selectedOwner,
      phaseError,
      buildingError,
      flatError,
      ownerError,
    } = this.state;
    return (
      <div className="container ">
        <div className="d-flex justify-content-center">
          <div className="sign">
            <form className="regForm " id="myForm">
              <div className="row">
                <div className="form-group col-sm-6 s ">
                  <Select
                    value={selectedPhase}
                    placeholder="Phase"
                    styles={customStyles}
                    onChange={this.handlePhaseChange}
                    onBlur={this.handlePhaseFocus}
                    options={phaseOptions}
                  />
                  <div className="errorDiv">{this.state.phaseError}</div>
                </div>
                <div className="form-group col-sm-6 ">
                  <Select
                    value={selectedBuilding}
                    placeholder="Building"
                    styles={customStyles}
                    onChange={this.handleBuildingChange}
                    onBlur={this.handleBuilingFocus}
                    options={buildingOptions}
                  />
                  <div className="errorDiv">{this.state.buildingError}</div>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-sm-6 ">
                  <Select
                    value={selectedFlat}
                    placeholder="Flat"
                    styles={customStyles}
                    onChange={this.handleFlatChange}
                    onBlur={this.handleFlatFocus}
                    options={flatOptions}
                  />
                  <div className="errorDiv ">{this.state.flatError}</div>
                </div>
                <div className="form-group col-sm-6 ">
                  <Select
                    value={selectedOwner}
                    placeholder="Owner"
                    styles={customStyles}
                    onChange={this.handleOwnerChange}
                    onBlur={this.handleOwnerFocus}
                    options={ownerOptions}
                  />
                  <div className=" errorDiv">{this.state.ownerError}</div>
                </div>
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    name: "firstName",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    type: "text",
                    placeholder: "First Name",
                    required: true,
                  }}
                  value={
                    (account.firstName =
                      account.firstName.charAt(0).toUpperCase() +
                      account.firstName.slice(1).toLowerCase())
                  }
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasFirstNameError: res,
                      validate: false,
                    })
                  }
                  onChange={(firstName, e) => {
                    this.setState({
                      account: {
                        ...account,
                        firstName: e.target.value,
                      },
                    });
                  }}
                  onBlur={(e) => {}}
                  validationOption={{
                    name: "First Name",
                    check: true,
                    required: true,
                    customFunc: (firstName) => {
                      if (firstName.match(namePattern)) {
                        return true;
                      } else {
                        return "First Name must contain only characters";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    name: "lastName",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    type: "text",
                    placeholder: "Last Name",
                    required: true,
                  }}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasLastNameError: res,
                      validate: false,
                    })
                  }
                  value={
                    (account.lastName =
                      account.lastName.charAt(0).toUpperCase() +
                      account.lastName.slice(1).toLowerCase())
                  }
                  onChange={(lastName, e) => {
                    this.setState({
                      account: {
                        ...account,
                        lastName: e.target.value,
                      },
                    });
                  }}

                  onBlur={(e) => {}}
                  validationOption={{
                    name: "Last Name",
                    check: true,
                    required: true,
                    customFunc: (lastName) => {
                      if (lastName.match(namePattern)) {
                        return true;
                      } else {
                        return "Last Name must contain only characters";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group ">
                <div className=" row fieldBox">
                  <div className="form-control label_font_size col-sm-3 fieldLabel">
                    <label> Gender </label>
                  </div>

                  <Radiobox
                    attributesInput={{
                      id: "gender",
                      name: "gender",
                      className: "form-control label_font_size col-sm-7 ",
                    }}
                    optionList={[
                      {
                        id: "Male",
                        name: "Male",
                      },
                      {
                        id: "Female",
                        name: "Female",
                      },
                    ]}
                    validate={validate}
                    customStyleContainer={{
                      paddingTop: "5%",
                    }}
                    validationCallback={(res) =>
                      this.setState({
                        hasGenderError: res,
                        validate: false,
                      })
                    }
                    onChange={(gender, e) => {
                      this.setState({
                        gender,
                        account_gender: {
                          ...account_gender,
                          gender: gender,
                        },
                      });
                    }}
                    onBlur={(e) => {}}
                    validationOption={{
                      name: "Gender",
                      check: true,
                      required: true,
                    }}
                  />
                </div>
              </div>
              <div className="form-group ">
                <Textbox
                  attributesInput={{
                    id: "birthYear",
                    name: "birthYear",
                    placeholder: "Birth Year",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={account.birthYear}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasBirthYearError: res,
                      validate: false,
                    })
                  }
                  onChange={(birthYear, e) => {
                    this.setState({
                      birthYear,
                      account: {
                        ...account,
                        birthYear: birthYear,
                      },
                    });
                  }}

                  onBlur={(e) => {}}
                  validationOption={{
                    type: "number",
                    name: "Birth Year",
                    length: 4,
                    min: 1935,
                    max: 2014,
                  }}
                />
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    id: "password",
                    name: "password",
                    type: "password",
                    placeholder: "Password",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={account.password}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasPasswordError: res,
                      validate: false,
                    })
                  }
                  onChange={(password, e) => {
                    this.setState({
                      password,
                      account: {
                        ...account,
                        password: password,
                      },
                    });
                  }}
                  onBlur={(e) => {}}
                  validationOption={{
                    type: "string",
                    name: "Password",
                    customFunc: (password) => {
                      if (password.match(passPattern)) {
                        return true;
                      } else {
                        return "Password length must be 6,it must contain one capital letter,one small letter and one special character";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    id: "mobileNo",
                    name: "mobileNo",
                    type: "text",
                    placeholder: "Mobile No",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={mobileNo}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasMobileNoError: res,
                      validate: false,
                    })
                  }
                  onChange={(mobileNo, e) => {
                    this.setState({
                      mobileNo: mobileNo,
                    });
                  }}

                  onBlur={(e) => {}}
                  validationOption={{
                    type: "number",
                    name: "Mobile No",
                    length: 10,
                    customFunc: (mobileNo) => {
                      for (var i = 0; i < arrayMobile.length; i++) {
                        if (arrayMobile[i] != this.state.mobileNo) {
                          flagMobile = 1;
                          break;
                        }
                      }
                      for (var i = 0; i < arrayMobile.length; i++) {
                        if (arrayMobile[i] == this.state.mobileNo) {
                          flagMobile = 2;
                          break;
                        }
                      }
                      if (flagMobile == 1 || flagMobile == 0) {
                        return true;
                      }
                      if (flagMobile == 2) {
                        return "This Mobile No already exists..!";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    id: "email",
                    name: "email",
                    type: "text",
                    placeholder: "Email",
                    className:
                      "form-control label_font_size inputFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={email}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasEmailError: res,
                      validate: false,
                    })
                  }
                  onChange={(email, e) => {
                    this.setState({
                      email: email,
                    });
                  }}

                  onBlur={(e) => {}}
                  validationOption={{
                    type: "string",
                    name: "Email",
                    reg: /^[a-zA-Z]+[._]?[a-zA-Z0-9]+\@[a-zA-Z0-9]((-\w+)|(\w*))\.(com|edu|info|gov|int|mil|net|org|biz|name|museum|coop|aero|pro|tv|[a-zA-Z]{2})\.*[a-z.]*$/,
                    customFunc: (email) => {
                      for (var i = 0; i < arrayEmail.length; i++) {
                        if (arrayEmail[i] != this.state.email) {
                          flagEmail = 1;
                          break;
                        }
                      }
                      for (var i = 0; i < arrayEmail.length; i++) {
                        if (arrayEmail[i] == this.state.email) {
                          flagEmail = 2;
                          break;
                        }
                      }

                      if (flagEmail == 1 || flagEmail == 0) {
                        return true;
                      }
                      if (flagEmail == 2) {
                        return "This Email already exists..!";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group">
                <div className=" row fieldBox">
                  <div className="form-control label_font_size col-md fieldLabel">
                    <label> Photo </label>
                  </div>
                  <div className="col-md">
                    <Textbox
                      attributesInput={{
                        className: "photo",
                        name: "photo",
                        placeholder: "Player photo",
                        type: "file",
                      }}
                      customStyleContainer={{
                        paddingTop: "5%",
                      }}
                      onChange={this.playerPhotoHandler}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <Textbox
                  attributesInput={{
                    id: "Registration Status",
                    name: "Registration Status",
                    placeholder: "Registration Status",
                    className:
                      "form-control label_font_size status border-top-0 border-left-0 border-right-0",
                    disabled: true,
                  }}
                  value={regStatus}
                />
              </div>

              <div className="row">
                <div className="col-sm-2"> </div>
                <div className="col-sm-8">
                  <Button
                    type="submit"
                    className="btn btn-primary btn-block register "
                    onClick={this.validateForm}
                  >
                    Register
                  </Button>
                </div>
                <div className="col-sm-2"> </div>
              </div>
            </form>
          </div>
        </div>
        <div className="divBottom">
          <span className="txtBottom">Already have an account ?</span>{" "}
          <Link className="txtLogin" to="/login">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
}

export default OwnerReg;
