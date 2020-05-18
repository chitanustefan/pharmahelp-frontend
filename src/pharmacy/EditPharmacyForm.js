import React, { Component } from "react";
import "./pharmacy.css";
import "../App.css";
import axios from "axios";
import { InputText } from "primereact/components/inputtext/InputText";
import NavigationBar from "../navbar/NavigationBar";
class EditPharmacyPage extends Component {
  constructor(props) {
    super(props);
    this.submit5 = this.submit5.bind(this);
    this.state = {
      pharmacy: {
        id_pharmacy: "",
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
    let pharmacy = this.state.pharmacy;
    pharmacy.id_pharmacy = this.props.location.state.id;
    this.setState({ pharmacy: pharmacy });
    // this.setState(pharmacy, this.props.params.location.id);
    console.log(this.state.pharmacy);
    let url = "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/pharmacies/update";
    if (
      (this.state.pharmacy.name !== "") &
      (this.state.pharmacy.location !== "")
    ) {
      axios
        .post(url, this.state.pharmacy, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": `application/json`,
          },
        })
        .then((response) => {
          console.log(this.state.pharmacy);
          console.log("update pharmacy succesfull");
          this.setState({ successPost: true });
          // this.setState({ pharmacy: { name: "", location: "" } });
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

    var name = this.props.location.state.name;
    var location = this.props.location.state.location;

    //console.log(name);
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
                marginRight: "50px",
                marginLeft: "20px",
              }}
            />
            <h3 style={{ lineHeight: "3rem" }}>
              On this page you can edit a pharmacy
            </h3>
          </div>
          <br />
          <div className="banner">
            <div id="addMed">
              <h3>Please fill in the information to update a pharmacy</h3>
              <label>
                {" "}
                <strong>Name:</strong> &nbsp;{" "}
              </label>{" "}
              <br />
              <InputText
                className="form-item"
                placeholder={name}
                id="pjarmacy-name"
                type="text"
                size={30}
                style={{ width: "350px" }}
                value={this.state.pharmacy.name}
                onChange={(event) => {
                  let pharmacy = this.state.pharmacy;
                  pharmacy.name = event.target.value;
                  this.setState({ pharmacy: pharmacy });
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
                placeholder={location}
                id="location"
                type="text"
                size={30}
                style={{ width: "600px" }}
                value={this.state.pharmacy.location}
                onChange={(event) => {
                  let pharmacy = this.state.pharmacy;
                  pharmacy.location = event.target.value;
                  this.setState({ pharmacy: pharmacy });
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
                <p className="register-success">Update successfully!</p>
              ) : null}
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={this.submit5}
              >
                <strong>Update Pharmacy</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPharmacyPage;
