import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import { NavDropdown } from "react-bootstrap";

class Notification extends Component {
  constructor() {
    super();
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.state = {
      notifications: [],
      errorGetReq: false,
      errorPostReq: false,
    };
  }

  componentDidMount() {
    axios
      .get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/notifications/getunread", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        let notifications = res.data;
        notifications.forEach((notification) => {
          let date = new Date(notification.createdDate);
          notification.createdDate = date.toLocaleString();
          this.setState((state) => {
            const notifications = [...state.notifications, notification];
            return { notifications };
          });
        });
      })
      .catch((err) => this.setState({ errorGetReq: true }));
  }

  handleNotificationClick(id_admin_notifications, e) {
    let url = "https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/notifications/update?id=" +id_admin_notifications +"&readed=true";
    axios
      .put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": `application/json`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {this.setState({ errorPostReq: true });});
  }

  render() {
    const errorGetReq = this.state.errorGetReq;
    const notifications = this.state.notifications;
    return (
      <div>
        {errorGetReq === true ? (
          <NavDropdown.Item style={{ width: "max-content!important" }}>
            <h4>Could not get notifications from server!</h4>
          </NavDropdown.Item>
        ) : notifications.length === 0 ? (
          <NavDropdown.Item style={{ width: "max-content!important" }}>
            <h4>There is no new notification!</h4>
          </NavDropdown.Item>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id_admin_notifications}>
              <NavDropdown.Item
                href="/pharma-help/view-drugs"
                onClick={this.handleNotificationClick.bind(
                  this,
                  notification.id_admin_notifications
                )}
              >
                <div>
                  <h5>{notification.description}</h5>
                  <h6>{notification.createdDate}</h6>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </div>
          ))
        )}
      </div>
    );
  }
}
export default Notification;
