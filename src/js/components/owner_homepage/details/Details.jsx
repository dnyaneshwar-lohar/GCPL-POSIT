import React, { Component } from "react";
import { Row, Col, List, Divider, Card, Steps } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
  TrophyTwoTone,
} from "@ant-design/icons";
import rank from "../teamImage/rank.jpg";
import "../ownerhomepage.css";
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      tournament_data: [],
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    fetch("http://localhost:4000/getTournament")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          tournament_data: findresponse.data,
        });
      });
  };
  render() {
    const bestPlayers = [
      {
        title: "Best Player",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Man Of the Match",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Wicket Player",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Caption",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Player",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Wicket Keeper",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Baller",
        name: "Rohit sharma",
        image: rank,
      },
      {
        title: "Best Player",
        name: "Rohit sharma",
        image: rank,
      },
    ];
    const { Step } = Steps;
    return (
      <div>
        <Row>
          <Col xl={15} lg={15} md={24} sm={24} xs={24} offset={1}>
            <Divider orientation="center">
              <h1 className="titleTournament">Process Of Registration</h1>
            </Divider>
            <Card className="mt-3">
              <Steps responsive>
                <Step status="finish" title="Login" icon={<UserOutlined />} />
                <Step
                  status="finish"
                  title="Registration"
                  description="Add Family Members."
                  icon={<SolutionOutlined />}
                />
                <Step
                  status="finish"
                  title="Pay"
                  description="Pay offline"
                  icon={<LoadingOutlined />}
                />
                <Step status="finish" title="Done" icon={<SmileOutlined />} />
              </Steps>
            </Card>
            <Divider orientation="center">
              <h1 className=" mt-4 titleTournament">Best Players</h1>
            </Divider>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={bestPlayers}
              renderItem={(item) => (
                <List.Item>
                  <Card className="design" title={item.title}>
                    <img className="imageResponsive" src={item.image} />
                    {item.name}
                  </Card>
                </List.Item>
              )}
            />
          </Col>
          <Col xl={6} lg={6} md={24} sm={24} xs={24} offset={1}>
            <Divider orientation="center">
              <h1 className="titleTournament">Upcoming Tournaments</h1>
            </Divider>
            <List
              className="design listDisplay"
              itemLayout="horizontal"
              dataSource={this.state.tournament_data}
              bordered
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<TrophyTwoTone style={{ fontSize: "20px" }} />}
                    title={item.tournament_name}
                    description={
                      item.StartDate.slice(0, 10) +
                      " to " +
                      item.EndDate.slice(0, 10)
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Details;
