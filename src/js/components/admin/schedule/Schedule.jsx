import React, { Component } from "react";
import {
  Calendar,
  Card,
  Row,
  Col,
  Modal,
  Select,
  TimePicker,
  Input,
  DatePicker,
  Tooltip,
  Popconfirm,
  notification,
  Button,
} from "antd";
import axios from "axios";
import { Formik, Field, ErrorMessage, Form } from "formik";
import moment from "moment";
import Img from "./icon.png";
import * as Yup from "yup";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      teamNameData: [],
      nameData: [],
      selectedDate: "",
      selectedTournament: "",
      match_date: "",
      first_team: "",
      second_team: "",
      match_time: moment("00:00:00", "HH:mm:ss"),
      match_venue: "",
      dateError: "",
      choosen_date_moment: moment("0000-00-00", "YYYY-MM-DD"),
      matchDetails: [],
      tournamentData: [],
      tournamentIdData: [],
      dataArray: [],
      tournament_id: "",
      tournament_name: "",
      tournamentNameData: [],
      selectedTournament: [],
      secondTeamName: [],
      filterTeamName: [],
      renderCards: false,
      match_id: "",
      addOrUpdateClick: true,
      dateToUpdate: moment("0000-00-00", "YYYY-MM-DD"),
      unavailableTournament: false,
      saveButtonFlag: "",
      flag: false,
    };
  }

  componentDidMount() {
    this.getData();
    this.fetchTournament();
    this.getMatchDetails();
  }

  getMatchDetails = () => {
    fetch("http://localhost:4000/getMatchDetails")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          matchDetails: findresponse.data,
        });
      }),
      (error) => {
        console.log(error);
      };
  };

  getData = async () => {
    let res = await axios.get("http://localhost:4000/getTeamName");
    await this.setState({
      teamNameData: res.data,
      teamNameDataLenght: res.data.length,
    });
    for (var i = 0; i < this.state.teamNameDataLenght; i++) {
      this.state.nameData.push(this.state.teamNameData[i]);
    }
  };

  fetchTournament = async () => {
    let res = await axios.get("http://localhost:4000/getTournamentIdName");
    await this.setState({
      tournamentData: res.data,
    });
  };

  dateCellRender = (dateString) => {
    var dateInFormat = dateString.format("YYYY-MM-DD");
    if (this.state.matchDetails != undefined) {
      for (var i = 0; i < this.state.matchDetails.length; i++) {
        if (dateInFormat === this.state.matchDetails[i].match_date) {
          return <img src={Img} width="30px" height="30px" />;
        }
      }
    }
  };

  onSelectCalenderDate = async (value) => {
    const choosen_date = moment.utc(value, "MM-DD-YYYY").format("YYYY-MM-DD");
    await this.setState({
      choosen_date_moment: moment(choosen_date),
    });
    this.setState({
      selectedDate: moment(choosen_date).local().format("DD-MM-YYYY"),
      addOrUpdateClick: true,
      selectedTournament: "",
      first_team: "",
      second_team: "",
      match_time: moment("00:00:00", "HH:mm:ss"),
      match_venue: "",
    });
  };

  setModalVisible(modalVisible) {
    this.setState({
      tournamentNameData: [],
      modalVisible,
      tournamentError: "",
      teamOneError: "",
      teamTwoError: "",
      matchTimeError: "",
      matchVenueError: "",
    });
  }

  setSelectedTournament = (event) => {
    this.setState({
      selectedTournament: event,
    });
  };

  setSelectedTeamOne = (event) => {
    this.setState({
      first_team: event,
    });
    this.state.filterTeamName = this.state.nameData.filter((item) => {
      return item.team_name !== event;
    });
  };
  setSelectedTeamTwo = (event) => {
    this.setState({
      second_team: event,
    });
    this.setState({ teamTwoError: "", hasTeamTwoError: false });
  };
  setSelectedMatchTime = (time, timeString) => {
    this.setState({
      match_time: timeString,
    });
    if (
      this.state.match_time.length != 0 ||
      this.state.match_time.value == null
    ) {
      this.setState({ matchTimeError: "", hasMatchTimeError: false });
    }
  };
  setMatchVenue = (event) => {
    this.setState({
      match_venue: event,
    });
  };
  setUpdateDate = (date, datestring) => {
    this.setState({
      tournamentNameData: [],
      dateToUpdate: datestring,
      choosen_date_moment: moment(datestring),
    });
  };

  handleFormSubmit = async () => {
    if (this.state.addOrUpdateClick) {
      var showError = false;
      await this.state.tournamentData.map((row) => {
        if (
          this.state.selectedTournament === row.tournament_name &&
          (moment(this.state.dateToUpdate).isAfter(moment(row.EndDate)) ||
            moment(this.state.dateToUpdate).isBefore(moment(row.StartDate)))
        ) {
          showError = true;
        }
      });

      if (showError) {
        this.noDataAvailableNotification("error");
        this.setModalVisible(false);
      } else if (this.state.tournamentNameData.length === 0) {
        this.noDataAvailableNotification("error");
        this.setModalVisible(false);
      } else {
        if (
          moment(this.state.match_time).isSame(moment("00:00:00", "HH:mm:ss"))
        ) {
          await axios({
            method: "post",
            url: "http://localhost:4000/admin/schedule",
            data: {
              tournament_name: this.state.selectedTournament,
              match_date: this.state.selectedDate,
              first_team: this.state.first_team,
              second_team: this.state.second_team,
              match_time: "19:30:00",
              match_venue: this.state.match_venue,
            },
          }).then(
            (result) => {
              this.openNotification("success");
              if (result.statusText === "OK") {
                this.setState({
                  renderCards: true,
                  selectedTournament: "",
                  first_team: "",
                  second_team: "",
                  match_time: moment("00:00:00", "HH:mm:ss"),
                  match_venue: "",
                });
                this.getMatchDetails();
              } else {
                this.openNotification("success");
                this.setState({
                  renderCards: false,
                  selectedTournament: "",
                  first_team: "",
                  second_team: "",
                  match_time: moment("00:00:00", "HH:mm:ss"),
                  match_venue: "",
                });
              }
            },
            (error) => {}
          );
          this.setModalVisible(false);
        } else {
          await axios({
            method: "post",
            url: "http://localhost:4000/admin/schedule",
            data: {
              tournament_name: this.state.selectedTournament,
              match_date: this.state.selectedDate,
              first_team: this.state.first_team,
              second_team: this.state.second_team,
              match_time: this.state.match_time,
              match_venue: this.state.match_venue,
            },
          }).then(
            (result) => {
              this.openNotification("success");
              if (result.statusText === "OK") {
                this.setState({
                  renderCards: true,
                  selectedTournament: "",
                  first_team: "",
                  second_team: "",
                  match_time: moment("00:00:00", "HH:mm:ss"),
                  match_venue: "",
                });
                this.getMatchDetails();
              } else {
                this.setState({
                  renderCards: false,
                  selectedTournament: "",
                  first_team: "",
                  second_team: "",
                  match_time: moment("00:00:00", "HH:mm:ss"),
                  match_venue: "",
                });
              }
            },
            (error) => {}
          );
          this.setModalVisible(false);
        }
      }
    } else {
      if (this.state.match_venue == "") {
        this.setModalVisible(true);
      } else {
        axios({
          method: "post",
          url: `http://localhost:4000/admin/schedule/update`,
          data: {
            match_id: this.state.match_id,
            match_date: this.state.dateToUpdate,
            tournament_name: this.state.selectedTournament,
            first_team: this.state.first_team,
            second_team: this.state.second_team,
            match_time: this.state.match_time,
            match_venue: this.state.match_venue,
          },
        }).then(
          (res) => {
            this.openNotification("success");
            this.setState({
              dateToUpdate: moment("0000-00-00", "YYYY-MM-DD"),
              selectedTournament: this.state.selectedTournament,
              first_team: this.state.first_team,
              second_team: this.state.second_team,
              match_time: moment("00:00:00", "HH:mm:ss"),
              match_venue: this.state.match_venue,
            });
            this.getMatchDetails();
          },
          (error) => {}
        );
        this.setModalVisible(false);
      }
    }
  };

  // //-------------------update card-----------------------
  updateScheduleCard = (match_id) => {
    this.state.matchDetails.map((row) => {
      if (row.match_id === match_id) {
        this.setState({
          choosen_date_moment: moment(row.match_date),
          dateToUpdate: row.match_date,
          selectedDate: row.match_date,
          selectedTournament: row.tournament_name,
          first_team: row.first_team,
          second_team: row.second_team,
          match_time: row.match_time,
          match_venue: row.match_venue,
        });
      }
    });
    this.setState({
      tournamentNameData: [],
      match_id: match_id,
      addOrUpdateClick: false,
    });
    this.setModalVisible(true);
  };

  //-------------------delete card-----------------------
  deleteScheduleCard = async (match_id) => {
    await axios({
      method: "delete",
      url: `http://localhost:4000/admin/schedule/delete/:${match_id}`,
      data: {
        id: match_id,
      },
    }).then(
      (res) => {
        this.getMatchDetails();
      },
      (error) => {}
    );
  };

  //-------------------delete card-----------------------

  openNotification = (type) => {
    if (this.state.addOrUpdateClick) {
      notification[type]({
        message: "Schedule added successfully.!!",
      });
    } else {
      notification[type]({
        message: "Schedule updated successfully.!!",
      });
    }
  };

  errorNotification = (type) => {
    notification[type]({
      message: "You don't have match_details table ",
    });
  };
  noDataAvailableNotification = (type) => {
    notification[type]({
      message:
        "No tournament available for selected date, Please choose another date!!",
    });
  };
  sameTeamNotification = (type) => {
    notification[type]({
      message: "Please Select different team names...!!!",
    });
  };
  render() {
    const { value, selectedDate, choosen_date_moment } = this.state;
    const showcards = () => {
      if (this.state.renderCards) {
        this.state.matchDetails.map((val) => {
          return (
            <Card
              key={val.match_id}
              style={{
                marginTop: 5,
                marginLeft: 15,
                marginBottom: 5,
                width: "95%",
              }}
              title={
                <h4>
                  <img
                    src={Img}
                    width="25"
                    height="25"
                    style={{ marginRight: 15 }}
                  />
                  {val.tournament_name}
                </h4>
              }
              actions={[
                <a
                  key="list-update"
                  onClick={() => this.updateScheduleCard(val.match_id)}
                >
                  <Tooltip title="Update">
                    <EditTwoTone />
                  </Tooltip>
                </a>,
                <Popconfirm
                  title="Are you sure to delete this schedule?"
                  onConfirm={() => this.deleteScheduleCard(val.match_id)}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <a key="list-delete">
                    <DeleteTwoTone />
                  </a>
                </Popconfirm>,
              ]}
            >
              <div style={{ marginTop: 5, alignContent: "center" }}>
                <h5>
                  {val.first_team} Vs {val.second_team}
                </h5>
                <p>Date: {moment(val.match_date).format("LL")}</p>
                <p>Match time: {val.match_time}</p>
                <p>Venue: {val.match_venue} </p>
              </div>
            </Card>
          );
        });
      }
    };

    return (
      <div>
        <Row>
          <Col lg={18} md={24} sm={24} xl={18}>
            <Calendar
              style={{ height: "100%" }}
              value={value}
              dateCellRender={this.dateCellRender}
              className="calendar"
              onSelect={this.onSelectCalenderDate}
              onChange={() => this.setModalVisible(true)}
            />
          </Col>
          <Col
            style={{
              maxHeight: "790px",
              overflowX: "hidden",
              overflowY: "auto",
            }}
            lg={6}
            xl={6}
            md={24}
            sm={24}
          >
            {showcards()}
            {this.state.matchDetails != undefined
              ? this.state.matchDetails.map((val) => {
                  return (
                    <Card
                      className={"allCards"}
                      style={{
                        marginTop: 5,
                        marginLeft: 15,
                        marginBottom: 5,
                        width: "100%",
                      }}
                      title={
                        <h4>
                          <img
                            src={Img}
                            width="25"
                            height="25"
                            style={{ marginRight: 15 }}
                          />
                          {val.tournament_name}
                        </h4>
                      }
                      actions={[
                        <a
                          key="list-update"
                          onClick={() => this.updateScheduleCard(val.match_id)}
                        >
                          <Tooltip title="Update">
                            <EditTwoTone />
                          </Tooltip>
                        </a>,
                        <Popconfirm
                          title="Are you sure to delete this schedule?"
                          onConfirm={() =>
                            this.deleteScheduleCard(val.match_id)
                          }
                          onCancel={this.cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <a key="list-delete">
                            <DeleteTwoTone />
                          </a>
                        </Popconfirm>,
                      ]}
                    >
                      <div style={{ marginTop: 5, alignContent: "center" }}>
                        <h5>
                          {val.first_team} Vs {val.second_team}
                        </h5>
                        <p>Date: {moment(val.match_date).format("LL")}</p>
                        <p>Match time: {val.match_time}</p>
                        <p>Venue: {val.match_venue} </p>
                      </div>
                    </Card>
                  );
                })
              : this.errorNotification("error")}
          </Col>
        </Row>

        <Modal
          title={
            this.state.addOrUpdateClick
              ? `Add schedule for: ${selectedDate}`
              : `Update schedule for:`
          }
          centered
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          destroyOnClose={true}
          footer={null}
        >
          <Formik
            initialValues={{
              selectTournament: "",
              first_team: "",
              second_team: "",
              match_venue: "",
            }}
            validationSchema={Yup.object().shape({
              selectTournament: Yup.string().required("Select Tournament"),
              first_team: Yup.string().required("Select first Team "),
              second_team: Yup.string().required("Select second Team"),
              match_venue: Yup.string().required("Select match venue"),
            })}
            onSubmit={(fields) => {
              this.setState({
                selectedTournament: fields.selectTournament,
                first_team: fields.first_team,
                second_team: fields.second_team,
                match_venue: fields.match_venue,
              });
              if (fields != null) {
                if (fields.first_team == fields.second_team) {
                  this.sameTeamNotification("error");
                } else {
                  this.handleFormSubmit();
                }
              }
            }}
          >
            {({ errors, touched, setFieldValue }) => {
              return (
                <Form {...formItemLayout}>
                  {this.state.addOrUpdateClick ? null : (
                    <div class="form-group">
                      <label>
                        Date:<p>{this.state.addOrUpdateClick}</p>
                      </label>

                      <DatePicker
                        value={moment(this.state.dateToUpdate, "YYYY-MM-DD")}
                        style={{ width: "100%" }}
                        onChange={this.setUpdateDate}
                      />
                    </div>
                  )}
                  <div class="form-group">
                    <label>Tournament</label>
                    <Field
                      as={"select"}
                      name="selectTournament"
                      placeholder="Please select a tournament"
                      onSelect={(e) => {
                        let someValue = e.currentTarget.value;
                        this.setSelectedTournament(someValue);
                        setFieldValue("first_team", someValue);
                      }}
                      style={{ width: "100%" }}
                      className={
                        this.state.addOrUpdateClick
                          ? "form-control" +
                            (errors.selectTournament && touched.selectTournament
                              ? " is-invalid"
                              : "")
                          : "form-control"
                      }
                    >
                      {this.state.addOrUpdateClick ? (
                        <option value="" disabled>
                          Choose Tournament
                        </option>
                      ) : null}
                      {this.state.tournamentData.map((row) => {
                        if (
                          (choosen_date_moment.isAfter(moment(row.StartDate)) &&
                            choosen_date_moment.isBefore(
                              moment(row.EndDate)
                            )) ||
                          choosen_date_moment.isSame(row.EndDate) ||
                          choosen_date_moment.isSame(row.StartDate)
                        ) {
                          this.state.tournamentNameData.push(
                            row.tournament_name
                          );
                          return (
                            <option value={row.tournament_name}>
                              {row.tournament_name}
                            </option>
                          );
                        }
                      })}
                    </Field>
                    {this.state.addOrUpdateClick ? (
                      <ErrorMessage
                        name="selectTournament"
                        component="div"
                        className="invalid-feedback"
                      />
                    ) : null}
                  </div>
                  <div class="form-group">
                    <label>First Team</label>
                    <Field
                      as={"select"}
                      name="first_team"
                      placeholder="Please select a first_team"
                      onChange={(e) => {
                        let someValue = e.currentTarget.value;
                        this.setSelectedTeamOne(someValue);
                        setFieldValue("first_team", someValue);
                      }}
                      style={{ width: "100%" }}
                      className={
                        this.state.addOrUpdateClick
                          ? "form-control" +
                            (errors.first_team && touched.first_team
                              ? " is-invalid"
                              : "")
                          : "form-control"
                      }
                    >
                      {this.state.addOrUpdateClick ? (
                        <option value="" disabled>
                          Choose First Team
                        </option>
                      ) : (
                        <option value="" disabled>
                          {this.state.first_team}
                        </option>
                      )}
                      {this.state.nameData.map((val) => (
                        <option value={val.team_name}>{val.team_name}</option>
                      ))}
                    </Field>
                    {this.state.addOrUpdateClick ? (
                      <ErrorMessage
                        name="first_team"
                        component="div"
                        className="invalid-feedback"
                      />
                    ) : null}
                  </div>

                  <div class="form-group">
                    <label>Second Team</label>

                    <Field
                      as={"select"}
                      name="second_team"
                      placeholder="Please select a second_team"
                      onChange={(e) => {
                        let someValue = e.currentTarget.value;
                        this.setSelectedTeamTwo(someValue);
                        setFieldValue("second_team", someValue);
                      }}
                      style={{ width: "100%" }}
                      className={
                        this.state.addOrUpdateClick
                          ? "form-control" +
                            (errors.second_team && touched.second_team
                              ? " is-invalid"
                              : "")
                          : "form-control"
                      }
                    >
                      {this.state.addOrUpdateClick ? (
                        <option value="" disabled>
                          Choose Second Team
                        </option>
                      ) : (
                        <option value="" disabled>
                          {this.state.second_team}
                        </option>
                      )}

                      {this.state.filterTeamName.map((val) => (
                        <option value={val.team_name}>{val.team_name}</option>
                      ))}
                    </Field>
                    {this.state.addOrUpdateClick ? (
                      <ErrorMessage
                        name="second_team"
                        component="div"
                        className="invalid-feedback"
                      />
                    ) : null}
                  </div>
                  <div class="form-group">
                    <label>TimePicker</label>
                    <TimePicker
                      name="time_picker"
                      style={{ width: "100%" }}
                      onChange={this.setSelectedMatchTime}
                      value={moment(this.state.match_time, "HH:mm:ss")}
                      className={
                        "form-control" +
                        (errors.time_picker && touched.time_picker
                          ? " is-invalid"
                          : "")
                      }
                    />
                  </div>
                  <div class="form-group">
                    <label>Match Venue</label>
                    <Field
                      name="match_venue"
                      value={this.state.match_venue}
                      onChange={(e) => {
                        let someValue = e.currentTarget.value;
                        this.setMatchVenue(someValue);
                        setFieldValue("match_venue", someValue);
                      }}
                      className={
                        "form-control" +
                        (errors.match_venue && touched.match_venue
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="match_venue"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group">
                    {this.state.addOrUpdateClick ? (
                      <button type="submit" className="btn btn-primary mr-2">
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={this.handleFormSubmit}
                      >
                        Update
                      </button>
                    )}
                    <button
                      type="reset"
                      className="btn btn-secondary"
                      onClick={() => this.setModalVisible(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal>
      </div>
    );
  }
}

export default Schedule;
