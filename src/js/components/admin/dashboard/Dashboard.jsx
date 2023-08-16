import React, { Component } from "react";
import { Card, Row, Col, Button, List, Avatar, Skeleton } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import TournamentListPage from "../tournament/list/TournamentListPage";
import TournamentFormPage from "../tournament/form/TournamentFormPage";

class Dashboard extends Component {

  render() {
    const twoColumnsResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 }
    };

    const threeColumnsResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 }
    };

    return (
      <React.Fragment>
        <Row gutter={24}>
          <Col {...twoColumnsResponsiveProps}>
            {
              <Button shape="round" style={{ marginBottom: 20 }}>
                {"Create Event"}
              </Button>
            }
            <TournamentFormPage/>
          </Col>

          <Col {...twoColumnsResponsiveProps}>
            {
              <Button shape="round" style={{ marginBottom: 20 }}>
                {"All Event "}
                <ArrowRightOutlined />
              </Button>
            }
            <Card bodyStyle={{ padding: 25 }}>
              <TournamentListPage/>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Dashboard;
