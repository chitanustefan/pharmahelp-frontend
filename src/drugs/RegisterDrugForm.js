import React, { Component } from "react";
import "../pharmacy/pharmacy.css";
import axios from "axios";
import { InputText } from "primereact/components/inputtext/InputText";
import NavigationBar from "../navbar/NavigationBar";
import "../App.css";
import data from "../config/data.json";

const roles = data[0]["roles"];

class RegisterDrugForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      drug: {
        details: "",
        name: "",
        propsectus: "",
        activeSubstance: "",
      },
      errorEmptyInput: false,
      errorGetReq: false,
      errorPostReq: false,
      successPostReq: false,
      errorMessage: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ successPostReq: false });
    this.setState({ errorMessage: "" });
    this.setState({ errorPostReq: false });
    let drug = {
      name: this.state.drug.name || "",
      details: this.state.drug.details || "",
      prospectus: this.state.drug.propsectus || "",
      activeSubstance: this.state.drug.activeSubstance || "",
    };
    var regex = "^\\s*$";
    if (
      drug.name.match(regex) ||
      drug.details.match(regex) ||
      drug.prospectus.match(regex) ||
      drug.activeSubstance.match(regex)
    ) {
      this.setState({ errorEmptyInput: true });
      this.setState({ successPostReq: false });
    } else {
      this.setState({ errorEmptyInput: false });
      let currentUserId = "";
      axios
        .get("http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/user/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          currentUserId = res.data.id_user;
          let url = "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/drug/";
          if (localStorage.getItem("role") === roles.admin) {
            url += "admin/add?id=" + currentUserId;
          }
          if (localStorage.getItem("role") === roles.pharmacist) {
            url += "pharmacist/add?id=" + currentUserId;
          }
          axios
            .post(url, drug, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": `application/json`,
              },
            })
            .then((res) => {
              this.setState({ successPostReq: true });
              this.setState({
                drug: {
                  details: "",
                  name: "",
                  propsectus: "",
                  activeSubstance: "",
                },
              });
            })
            .catch((err) => {
              this.setState({ errorPostReq: true });
              this.setState({ successPostReq: false });
              console.log(err.response)
              if(err.response.data === "Drug already exists"){
                this.setState({ errorMessage: err.response.data });
              }
              if (this.state.errorMessage === "Drug already exists") {
                this.setState({
                  drug: {
                    details: "",
                    name: "",
                    propsectus: "",
                    activeSubstance: "",
                  },
                });
              }
            });
        })
        .catch((err) => {
          this.setState({ errorGetReq: true });
        });
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
              On this page you can register a new drug/medication
            </h3>
          </div>
          <br />
          <div className="banner">
            <div id="addMed">
              <form onSubmit={this.handleSubmit}>
                <h3>Please fill in the information to register a drug</h3>
                <label>
                  {" "}
                  <strong>Name:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <InputText
                  className="form-item"
                  id="drug-name"
                  type="text"
                  size={30}
                  value={this.state.drug.name}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.name = event.target.value;
                    this.setState({ drug: drug });
                    this.setState({ successPostReq: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ errorEmptyInput: false });
                  }}
                />
                <br />
                <label>
                  {" "}
                  <strong>Details:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <textarea
                  className="form-control"
                  id="details"
                  type="textarea"
                  rows="3"
                  style={{ borderColor: "gray" }}
                  value={this.state.drug.details}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.details = event.target.value;
                    this.setState({ drug: drug });
                    this.setState({ successPostReq: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ errorEmptyInput: false });
                  }}
                />
                <br /> <br />
                <label>
                  {" "}
                  <strong>Prospectus:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <textarea
                  className="form-control"
                  id="prospectus"
                  type="textarea"
                  rows="5"
                  size={100}
                  value={this.state.drug.propsectus}
                  style={{ borderColor: "gray" }}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.propsectus = event.target.value;
                    this.setState({ drug: drug });
                    this.setState({ successPostReq: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ errorEmptyInput: false });
                  }}
                />
                <br /> <br />
                <label>
                  {" "}
                  <strong>Active Substance:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <textarea
                  className="form-control"
                  id="activeSubstance"
                  type="textarea"
                  rows="2"
                  value={this.state.drug.activeSubstance}
                  style={{ borderColor: "gray" }}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.activeSubstance = event.target.value;
                    this.setState({ drug: drug });
                    this.setState({ successPostReq: false });
                    this.setState({ errorGetReq: false });
                    this.setState({ errorPostReq: false });
                    this.setState({ errorEmptyInput: false });
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
                  this.state.errorMessage !== "" ? (
                    <p className="register-error">{this.state.errorMessage}!</p>
                  ) : (
                    <p className="register-error">
                      Oops! Something went wrong! Please try again!
                    </p>
                  )
                ) : null}
                {successPostReq === true ? (
                  <p className="register-success">Added Successfully!</p>
                ) : null}
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClick={this.handleChange}
                >
                  <strong>Register</strong>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterDrugForm;
