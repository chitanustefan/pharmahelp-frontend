import React, { Component } from "react";
import "../pharmacy/pharmacy.css";
import axios from "axios";
import { InputText } from "primereact/components/inputtext/InputText";
import NavigationBar from "../navbar/NavigationBar";
import "../App.css";

class EditDrugForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      drug: {
        id_drug: "",
        details: "",
        name: "",
        propsectus: "",
        activeSubstance: "",
      },
      erroremptyfields: false,
      errorPost: false,
      successPost: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    let drug = {
      id_drug: this.props.location.state.id_drug || "",
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
      console.log("please fill out fields error");
      this.setState({ erroremptyfields: true });
    } else {
      //axios post update
      let url = "https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/drug/update";
      axios
        .post(url, drug, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": `application/json`,
          },
        })
        .then((response) => {
          console.log(drug);
          console.log("update drug succesfull");
          this.setState({ successPost: true });
        })
        .catch((err) => this.setState({ errorPost: true }));
      console.log(drug);
    }
  }

  render() {
    var errorPost = this.state.errorPost;
    var name = this.props.location.state.name;
    var activeSubstance = this.props.location.state.activeSubstance;
    var details = this.props.location.state.details;
    var prospectus = this.props.location.state.prospectus;
    var error = this.state.erroremptyfields;
    var successPost = this.state.successPost;
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
              On this page you can update a new drug/medication
            </h3>
          </div>
          <br />
          <div className="banner">
            <div id="addMed">
              <form onSubmit={this.handleSubmit}>
                <h3>Please fill in the information to update a drug</h3>
                <label>
                  {" "}
                  <strong>Name:</strong> &nbsp;{" "}
                </label>{" "}
                <br />
                <InputText
                  className="form-item"
                  id="drug-name"
                  placeholder={name}
                  type="text"
                  size={30}
                  value={this.state.drug.name}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.name = event.target.value;
                    this.setState({ drug: drug });
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
                  placeholder={details}
                  type="textarea"
                  rows="3"
                  style={{ borderColor: "gray" }}
                  value={this.state.drug.details}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.details = event.target.value;
                    this.setState({ drug: drug });
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
                  placeholder={prospectus}
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
                  placeholder={activeSubstance}
                  id="activeSubstance"
                  type="textarea"
                  rows="2"
                  value={this.state.drug.activeSubstance}
                  style={{ borderColor: "gray" }}
                  onChange={(event) => {
                    let drug = this.state.drug;
                    drug.activeSubstance = event.target.value;
                    this.setState({ drug: drug });
                  }}
                />
                <br /> <br />
                {errorPost === true ? (
                  <p className="register-error">
                    Oops! Something went wrong! Please try again!
                  </p>
                ) : null}
                {error === true ? (
                  <p className="register-error">
                    Please complete all the fields!
                  </p>
                ) : null}
                {successPost === true ? (
                  <p className="register-success">update successfully!</p>
                ) : null}
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClick={this.handleChange}
                >
                  <strong>Update</strong>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditDrugForm;
