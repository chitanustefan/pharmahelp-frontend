import React, { Component } from "react";
import "../pharmacy/pharmacy.css";
import axios from "axios";
import { InputText } from "primereact/components/inputtext/InputText";
import NavigationBar from "../navbar/NavigationBar";
import "../App.css";

class RequestDrugForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      request: {
        name: "",
        location: "",
      },
      errorEmptyInput: false,
      errorGetReq: false,
      errorPostReq: false,
      successPostReq: false,
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ errorEmptyInput: false });
    this.setState({ errorGetReq: false });
    this.setState({ errorPostReq: false });
    this.setState({ successPostReq: false });
    let request = {
      name: this.state.request.name || "",
      location: this.state.request.location || "",
    };
    var regex = "^\\s*$";
    if (request.name.match(regex) || request.location.match(regex)) {
      this.setState({ errorEmptyInput: true });
    } else {
      this.setState({ errorEmptyInput: false });
      let currentUserId = "";
      axios
        .get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/user/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          currentUserId = res.data.id_user;
          let url = "https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/rfa/requestDrug";
          axios
            .post(
              url,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
                params: {
                  name: this.state.request.name,
                  location: this.state.request.location,
                  idUser: currentUserId,
                },
              }
            )
            .then((res) => {
              this.setState({ successPostReq: true });
              this.setState({ errorPostReq: false });
              this.setState({ request: { name: "", location: "" } });
            })
            .catch((err) => {
              this.setState({ errorPostReq: true });
              this.setState({ successPostReq: false });
            });
        })
        .catch((err) => this.setState({ errorGetReq: true }));
    }
  }

  render() {
    const errorEmptyInput = this.state.errorEmptyInput;
    const errorGetReq = this.state.errorGetReq;
    const errorPostReq = this.state.errorPostReq;
    const successPostReq = this.state.successPostReq;
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <br />
          <div className="banner" style={{ display: "flex" }}>
            <img
              src={require("../public/images/drug.png")}
              alt="pharma..."
              style={{ width: "130px", marginLeft: "20px" }}
            />
            <h3 style={{ lineHeight: "3rem" }}>
              On this page you can request for supplementing the stock of a drug
              in a specific city.
            </h3>
          </div>
          <br />
          <div className="banner">
            <div id="addMed">
              <form onSubmit={this.handleSubmit}>
                <h3>
                  Please fill in the name and location to request for
                  supplementing the stock of a drug
                </h3>
                <label>
                  {" "}
                  <strong>Name:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <InputText
                  className="form-item"
                  id="request-name"
                  type="text"
                  size={30}
                  value={this.state.request.name}
                  onChange={(event) => {
                    let request = this.state.request;
                    request.name = event.target.value;
                    this.setState({ request: request });
                    this.setState({ errorEmptyInput: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ successPostReq: false });
                  }}
                />
                <br />
                <label>
                  {" "}
                  <strong>Location:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <InputText
                  className="form-item"
                  id="request-location"
                  type="text"
                  size={30}
                  value={this.state.request.location}
                  onChange={(event) => {
                    let request = this.state.request;
                    request.location = event.target.value;
                    this.setState({ request: request });
                    this.setState({ errorEmptyInput: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ successPostReq: false });
                  }}
                />
                <br /> <br />
                {errorEmptyInput === true ? (
                  <p className="register-error">Please fill out all fields!</p>
                ) : null}
                {errorGetReq === true ? (
                  <p className="register-error">Internal server error!</p>
                ) : null}
                {errorPostReq === true ? (
                  <p className="register-error">
                    Oops! Something went wrong! The medication does not exist or
                    name is incorrect. Please try again!
                  </p>
                ) : null}
                {successPostReq === true ? (
                  <p className="register-success">
                    Request added Successfully!
                  </p>
                ) : null}
                <button className="btn btn-outline-success" type="submit">
                  <strong>Request</strong>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestDrugForm;
