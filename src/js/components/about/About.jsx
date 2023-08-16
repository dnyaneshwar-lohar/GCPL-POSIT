import React, { Component } from "react";
import styles from "./About.css";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import player from "./aboutImage/player-registration.png";
import score from "./aboutImage/scoring.png";
import analysis from "./aboutImage/analysis.png";
import support from "./aboutImage/support.png";
import promote from "./aboutImage/promote-sponsors.png";
import device from "./aboutImage/device.jpg";
import affordable from "./aboutImage/affordable.png";
import cricket from "./aboutImage/cricket.jpg";
import { Card, Container, Row, Col } from "react-bootstrap";
import jwt_decode from "jwt-decode";

class About extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.player = this.player.bind(this);
    this.support = this.support.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token != null) {
      var decoded = jwt_decode(token);
      if (decoded.userData.role == "player") {
        this.setState({
          loggedIn: true,
        });
      }
    }
  }

  player = () => {
    if (this.state.loggedIn) {
      this.props.history.push("/ownerReg");
    } else {
      this.props.history.push("/");
    }
  };
  support = () => {
    if (this.state.loggedIn) {
      this.props.history.push("/contact");
    } else {
      this.props.history.push("/");
    }
  };
  render() {
    const style = {
      overflow: "hidden",
    };
    return (
      <div style={style}>
        <div style={{ padding: "1%" }}>
          <h2 className="about-header">GCPL </h2>

          <div className="row no-gutters">
            <div className="col-8">
              <div className="leftSide">
                <div className="about-middleContent">
                  <p>
                    GCPL is an online system to manage Cricket, Badminton stats
                    and results for national cricket bodies, leagues,
                    associations, clubs and even single teams. With over 50
                    statistics reports, it is a multi-user online service with
                    no software, app or download required. GCPL works on any
                    internet-enabled device. It features a built-in scoring
                    module that allows scorers to score matches live and add
                    ball-by-ball commentary.
                  </p>
                  <p>
                    With over 50 statistics reports, it is a multi-user online
                    service with no software, app or download required. GCPL
                    works on any internet-enabled device. It features a built-in
                    scoring module that allows scorers to score matches live and
                    add ball-by-ball commentary.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="rightSide">
                <div className="about-image">
                  <img
                    src={cricket}
                    alt="Cinque Terre"
                    className="about-image-responsive"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col">
              <div className="rightSide">
                <div className="about-image">
                  <img
                    src={device}
                    alt="Cinque Terre"
                    className="about-image-responsive"
                  />
                </div>
              </div>
            </div>
            <div className="col-8">
              <div className="leftSide">
                <div className="about-middleContent">
                  <p>
                    GCPL is an online system to manage Cricket, Badminton stats
                    and results for national cricket bodies, leagues,
                    associations, clubs and even single teams. With over 50
                    statistics reports, it is a multi-user online service with
                    no software, app or download required. GCPL works on any
                    internet-enabled device. It features a built-in scoring
                    module that allows scorers to score matches live and add
                    ball-by-ball commentary.
                  </p>
                  <p>
                    With over 50 statistics reports, it is a multi-user online
                    service with no software, app or download required. GCPL
                    works on any internet-enabled device. It features a built-in
                    scoring module that allows scorers to score matches live and
                    add ball-by-ball commentary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="parallox">
          <header>
            <h2>
              Ready to do <strong>something</strong>?
            </h2>
            <p>Participate in tournaments and win cash prizes</p>
          </header>
        </section>

        <h1 className="mt-4 ml-3 text-center">Cricket Scoring</h1>
        <div className="information">
          <Row className="ml-3">
            <Col className="text-center" onClick={this.player} sm={4}>
              <img src={player} />
              <h1>Player Registration</h1>
              <h3>Get new player registration directly</h3>
            </Col>
            <Col className="text-center" sm={4}>
              <img src={score} />
              <h1>Live Score</h1>
              <h3>Real time score updates</h3>
            </Col>
            <Col className="text-center" sm={4}>
              <img src={analysis} />
              <h1>Tournament Stats</h1>
              <h3>Comprehensive stats, graphs</h3>
            </Col>
          </Row>
          <Row className="ml-3">
            <Col className="text-center" sm={4}>
              <img src={affordable} />
              <h1>Affordable</h1>
              <h3>Live streaming tournaments</h3>
            </Col>
            <Col className="text-center" sm={4}>
              <img src={promote} />
              <h1>Promote Sponsors</h1>
              <h3>Sponsor Logos</h3>
            </Col>
            <Col className="text-center" onClick={this.support} sm={4}>
              <img src={support} />
              <h1>Support</h1>
              <h3>24/7 support</h3>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default About;
