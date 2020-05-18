import React, { Component } from "react";
import "./pharmacy.css";
import axios from "axios";
import NavigationBar from "../navbar/NavigationBar";
import "../App.css";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { Redirect } from "react-router-dom";
import data from "../config/data.json";

class PharmacyPage extends Component {
  constructor(props) {
    super(props);
    this.handleShopButtonClick = this.handleShopButtonClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.state = {
      pharmacy: {
        name: "",
        location: "",
        //ce mai are o farmaciee om vedea
      },
      pharmacies: [],
      error: false,
      errorGetReq: false,
      errorPostReq: false,
      pharmacy_id: "",
      pharmacy_name: "",
      pharmacy_location: "",
      pharmacy_id2: "",
      pharmacy_name2: "",
      pharmacy_location2: "",
      pharmacy_id3: "",
      pharmacy_name3: "",
      pharmacy_location3: "",
    };
  }
  componentDidMount() {
    axios
      .get("http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/pharmacies/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        let pharmacies = res.data;
        pharmacies.forEach((pharmacy) => {
          this.setState((state) => {
            const pharmacies = [...state.pharmacies, pharmacy];
            return { pharmacies };
          });
        });
      })
      .catch((err) => this.setState({ errorGetReq: true }));
  }

  handleShopButtonClick(id_pharmacy, pharmacy_name, pharmacy_location) {
    this.setState({ pharmacy_id: id_pharmacy });
    this.setState({ pharmacy_name: pharmacy_name });
    this.setState({ pharmacy_location: pharmacy_location });
  }
  handleEditButtonClick(id_pharmacy, pharmacy_name, pharmacy_location) {
    this.setState({ pharmacy_id2: id_pharmacy });
    this.setState({ pharmacy_name2: pharmacy_name });
    this.setState({ pharmacy_location2: pharmacy_location });
  }
  handleDeleteButtonClick(id_pharmacy, pharmacy_name, pharmacy_location) {
    this.setState({ pharmacy_id3: id_pharmacy });
    this.setState({ pharmacy_name3: pharmacy_name });
    this.setState({ pharmacy_location3: pharmacy_location });
  }

  render() {
    var errorGetReq = this.state.errorGetReq;
    //var pCount = this.state.pharmacies ? this.state.pharmacies.length : 0;
    //var footer = "There are " + pCount + " pharmacies";
    if (
      this.state.pharmacy_id !== "" &&
      this.state.pharmacy_name !== "" &&
      this.state.pharmacy_location !== ""
    ) {
      return (
        <Redirect
          to={{
            pathname: "/pharma-help/pharmas/" + this.state.pharmacy_id,
            state: {
              name: this.state.pharmacy_name,
              location: this.state.pharmacy_location,
            },
          }}
        />
      );
    }
    if (
      this.state.pharmacy_id2 !== "" &&
      this.state.pharmacy_name2 !== "" &&
      this.state.pharmacy_location2 !== ""
    ) {
      //redirect la un formular la ceva cand dau sumbit se face update
      return (
        <Redirect
          to={{
            pathname: "/pharma-help/editpharm/",
            state: {
              id: this.state.pharmacy_id2,
              name: this.state.pharmacy_name2,
              location: this.state.pharmacy_location2,
            },
          }}
        />
      );
    }
    if (
      this.state.pharmacy_id3 !== "" &&
      this.state.pharmacy_name3 !== "" &&
      this.state.pharmacy_location3 !== ""
    ) {
      let pharmacy = {
        id_pharmacy: this.state.pharmacy_id3,
        location: this.state.pharmacy_location3,
        name: this.state.pharmacy_name3,
      };
      //axios post delete pharmacy in care trimit id name location
      //axios get pharmacies ca sa mi se faca refresh
      axios
        .post("http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/pharmacies/delete", pharmacy, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          console.log("succes");
          window.location.reload(false);
        })
        .catch(
          (err) =>
            console.log("erroare") & this.setState({ errorPostReq: true })
        );
      // console.log(this.state.pharmacy_name3);
      //console.log(this.state.pharmacy_location3);
    }
    const roles = data[0]["roles"];
    var errorPostReq = this.state.errorPostReq;
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
                marginLeft: "20px",
                marginRight: "50px",
              }}
            />
            <h3 style={{ lineHeight: "3rem" }}>
              On this page you can see all the pharmacies
            </h3>
          </div>

          <br />
          <div className="banner">
            {(errorGetReq === true) | (errorPostReq === true) ? (
              <p className="register-error">Oops! Something went wrong!</p>
            ) : (
              <>
                <table style={{ width: "100%" }}>
                  <tbody className="cell">
                    <tr>
                      <th>
                        Name <hr />
                        <hr />
                      </th>
                      <th>
                        Address <hr />
                        <hr />
                      </th>
                      {localStorage.getItem("role") === roles.patient ? (
                        <th>
                          Shop <hr />
                          <hr />
                        </th>
                      ) : null}
                      {localStorage.getItem("role") === roles.admin ? (
                        <>
                          <th>
                            Edit <hr />
                            <hr />
                          </th>
                          <th>
                            Delete <hr />
                            <hr />
                          </th>
                        </>
                      ) : null}
                    </tr>
                    {this.state.pharmacies.map((pharmacy) => (
                      <tr key={pharmacy.id_pharmacy}>
                        <td>
                          {pharmacy.name} <hr />
                        </td>
                        <td>
                          {pharmacy.location} <hr />
                        </td>
                        {localStorage.getItem("role") === roles.patient ? (
                          <td>
                            <Tooltip
                              title="Shop"
                              onClick={this.handleShopButtonClick.bind(
                                this,
                                pharmacy.id_pharmacy,
                                pharmacy.name,
                                pharmacy.location
                              )}
                              style={{ width: "38px", height: "auto" }}
                            >
                              <Fab color="primary">
                                <AddShoppingCart />
                              </Fab>
                            </Tooltip>
                            <hr />
                          </td>
                        ) : null}
                        {localStorage.getItem("role") === roles.admin ? (
                          <>
                            <td>
                              <Tooltip
                                title="Edit"
                                onClick={this.handleEditButtonClick.bind(
                                  this,
                                  pharmacy.id_pharmacy,
                                  pharmacy.name,
                                  pharmacy.location
                                )}
                                style={{ width: "38px", height: "auto" }}
                              >
                                <Fab color="primary">
                                  <EditIcon />
                                </Fab>
                              </Tooltip>
                              <hr />
                            </td>
                            <td>
                              <Tooltip
                                title="Delete"
                                onClick={this.handleDeleteButtonClick.bind(
                                  this,
                                  pharmacy.id_pharmacy,
                                  pharmacy.name,
                                  pharmacy.location
                                )}
                                style={{ width: "38px", height: "auto" }}
                              >
                                <Fab color="primary">
                                  <DeleteIcon />
                                </Fab>
                              </Tooltip>
                              <hr />
                            </td>
                          </>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PharmacyPage;
