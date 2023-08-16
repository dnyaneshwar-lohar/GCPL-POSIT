import React, { Component } from "react";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import styles from "./Journey.css";
import Cricket from "./journeyImage/cricket.jpg";
import device from "./journeyImage/device.jpg";
import league from "./journeyImage/league.jpg";
import {Jumbotron} from "react-bootstrap";
class Journey extends Component {
  render() {
    return (
      <div className="style">
        <div>
          <header className="masthead">
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-12 text-center">
                  <h1 className="mainContent">GCPL Journey</h1>
                </div>
              </div>
            </div>
          </header>
          <Jumbotron>
          <div className="container-fluid px-0 py-0">
            <div className="row">
              <div className="col">
                <div className="journey-header-content">
                  <h2>
                    <strong>
                      {" "}
                      Cricket Results and Stats Management System for Leagues,
                      Clubs and Teams{" "}
                    </strong>
                  </h2>
                  <center>
                    <img
                      className="about-header-image rounded-circle"
                      src={Cricket}
                      alt="Cinque Terre"
                    />
                  </center>
                  <h2>
                    <strong>
                      Manage Your Cricket Results and <br /> Stats Online
                    </strong>
                  </h2>
                  <h5>
                    GCPL is an online system to manage Cricket, Badminton stats
                    and results for national cricket bodies, leagues,
                    associations, clubs and even single teams. With over 50
                    statistics reports, it is a multi-user online service with
                    no software, app or download required. GCPL works on any
                    internet-enabled device. It features a built-in scoring
                    module that allows scorers to score matches live and add
                    ball-by-ball commentary.
                  </h5>
                </div>
              </div>
            </div>
          </div>
          </Jumbotron>
          <div style={{ marginBottom: "2%" }}>
            <div className="row">
              <div className="col">
                <div className="journey-middle-image">
                  <div className="journey-middle-image-left">
                    <img
                      src={device}
                      alt="Cinque Terre"
                      className="responsiveimg"
                    />
                  </div>
                </div>
                <div className="alert alert-info journey-child1">
                  <div className="journey-middle-content">
                    <h2>
                      <strong> Cricket Results Management </strong>
                    </h2>
                    <h5>Manage Results From Any Device</h5>
                    <p>
                      Gather scorecards electronically via any internet-enabled
                      pc, mac, laptop, tablet or mobile device. Either enter
                      completed scorecards or score matches with ball-by-ball
                      commentary live. Publish match results and ladders in real
                      time. All from a browser. True multi-user with unlimited
                      users. No software or app to download.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div
                  className="alert alert-warning journey-child2"
                  role="alert"
                >
                  <div className="journey-middle-content">
                    <h2>
                      <strong> Player and Team Management </strong>
                    </h2>
                    <h5>Player and Team Management</h5>
                    <p>
                      Manage draws, umpires, scorers, grounds, teams, player
                      availability, player registrations, player contact
                      details, competition points, ladders and more.
                    </p>
                  </div>
                </div>
                <div className="journey-middle-image">
                  <div className="journey-middle-image-right">
                    <img
                      src={league}
                      alt="Cinque Terre"
                      className="responsiveimg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Journey;