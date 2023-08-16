import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./Contact.css";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {PhoneTwoTone, MailTwoTone, HomeTwoTone} from '@ant-design/icons';

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <section className="team">
          <Container className="text-center">
            <Row>
              <Col>
                <Card className="card">
                  <Card.Body>
                  <PhoneTwoTone className="contactIcon" />
                    <Card.Title className="card-title">
                      <h1 className="title">Phone</h1>
                    </Card.Title>
                    <Card.Text></Card.Text>
                    <div className="content">
                      <h4>+91 84319 05557</h4>
                      <h4> +91 99709 38958 (India)</h4>
                      <h4>+91 650 787 4757</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="card">
                  <Card.Body>
                  <MailTwoTone className="contactIcon" />
                    <Card.Title className="card-title">
                      <h1 className="title">Mail</h1>
                    </Card.Title>
                    <div className="content">
                      <h4>Email: pst@company.com</h4>
                      <h4>Website: positsource.com</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="card">
                  <Card.Body>
                  <HomeTwoTone className="contactIcon" />
                    <Card.Title className="card-title">
                      <h1 className="title">Address</h1>
                    </Card.Title>
                    <div className="content">
                      <h4>Unit 705,Supreme Headquarters</h4>
                      <h4> Yash Orchid Private Road</h4>
                      <h4> Baner, Pune, Maharashtra</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }
}

export default Contact;
