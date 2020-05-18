import React, { Component } from "react";
import "./pharmacy.css";
import "../App.css";
import axios from "axios";
import { InputText } from "primereact/components/inputtext/InputText";
import NavigationBar from "../navbar/NavigationBar";
class AddPharmacyPage extends Component {
  constructor(props) {
    super(props);
    this.submit5 = this.submit5.bind(this);
    this.state = {
      pharmacy: {
        name: "",
        location: "",
      },
      error: false,
      errorPost: false,
      successPost: false,
    };
  }
  submit5(e) {
    e.preventDefault();
    let url =
      "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/pharmacies/register/?name=" +
      this.state.pharmacy.name +
      "&location=" +
      this.state.pharmacy.location;
    if (
      (this.state.pharmacy.name !== "") &
      (this.state.pharmacy.location !== "")
    ) {
      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": `application/json`,
            },
          }
        )
        .then((response) => {
          console.log(this.state.pharmacy);
          console.log("add pharmacy succesfull");
          this.setState({ successPost: true });
          this.setState({ pharmacy: { name: "", location: "" } });
        })
        .catch((err) => this.setState({ errorPost: true }));
    } else {
      this.setState({ error: true });
    }
  }
  render() {
    var error = this.state.error;
    var errorPost = this.state.errorPost;
    var successPost = this.state.successPost;
    return (
      <div>
        <NavigationBar />

        <div className="main-page">
          <br />
          <br />
          <div className="banner" style={{ display: "flex" }}>
            <img
              src={require("../public/images/pharmacy1.png")}
              alt="pharma..."
              style={{
                width: "130px",
                marginRight: "40px",
                marginLeft: "20px",
              }}
            />
            <h3 style={{ lineHeight: "3rem" }}>
              On this page you can register a pharmacy
            </h3>
          </div>
          <br />
          <div className="banner">
            <div id="addMed">
              <h3>Please fill in the information to register a pharmacy</h3>
              <label>
                {" "}
                <strong>Name:</strong> &nbsp;{" "}
              </label>{" "}
              <br />
              <InputText
                className="form-item"
                id="pjarmacy-name"
                type="text"
                size={30}
                style={{ width: "350px" }}
                value={this.state.pharmacy.name}
                onChange={(event) => {
                  let pharmacy = this.state.pharmacy;
                  pharmacy.name = event.target.value;
                  this.setState({ pharmacy: pharmacy });
                  this.setState({ error: false });
                }}
              />
              <br /> <br />
              <label>
                {" "}
                <strong>Address:</strong> &nbsp;{" "}
              </label>{" "}
              <br />
              <InputText
                className="form-item"
                id="location"
                type="text"
                size={30}
                style={{ width: "600px" }}
                value={this.state.pharmacy.location}
                onChange={(event) => {
                  let pharmacy = this.state.pharmacy;
                  pharmacy.location = event.target.value;
                  this.setState({ pharmacy: pharmacy });
                  this.setState({ error: false });
                }}
              />
              <br /> <br />
              {error === true ? (
                <p className="register-error">Please fill out both fields!</p>
              ) : null}
              {errorPost === true ? (
                <p className="register-error">
                  Oops! Something went wrong! Please try again!
                </p>
              ) : null}
              {successPost === true ? (
                <p className="register-success">Added successfully!</p>
              ) : null}
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={this.submit5}
              >
                <strong>Register Pharmacy</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPharmacyPage;
