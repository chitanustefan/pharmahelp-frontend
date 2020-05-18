import React, { Component } from "react";
import "../App.css";
import {
  Navbar,
  Button,
  Nav,
  NavDropdown,
  Form,
  FormControl,
} from "react-bootstrap";
import Notification from "./Notification";
import data from "../config/data.json";
import { Redirect } from "react-router-dom";

class NavigationBar extends Component {
  constructor() {
    super();
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.logout = this.logout.bind(this);
    this.searchDrug = this.searchDrug.bind(this);
    this.state = {
      search: {
        drug: "",
        location: "",
      },
    };
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user-jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("shopCart");
    localStorage.removeItem("user-type")
  }

  handleSearchChange(e) {
    let search = this.state.search;
    search[e.target.name] = e.target.value;
  }

  searchDrug() {
    var regex = "^\\s*$";
    if (
      !this.state.search.drug.match(regex) &&
      !this.state.search.location.match(regex)
    ) {
      window.location = "/pharma-help/search-results?drug=" +
      this.state.search.drug +
      "&location=" +
      this.state.search.location
    }
  }

  render() {
    const loggedUser = localStorage.getItem("accessToken") ? true : false;
    const role = localStorage.getItem("role");
    const roles = data[0]["roles"];
    return (
      <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
          <Navbar.Brand href="/">
            <img
              src={require("../public/images/heart.svg")}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Heart"
            />
            Pharma Help
          </Navbar.Brand>

          {
            // <Form inline>
            //   <FormControl
            //     type="text"
            //     placeholder="Search for drug"
            //     className="mr-sm-2"
            //   />
            //   <Button variant="outline-info">Search</Button>
            // </Form>
          }
          {role === roles.admin ? (
            <NavDropdown title="Pharmacy">
              <NavDropdown.Item href="/pharma-help/addpharmacy">
                Add Pharmacy
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/pharma-help/pharmas">
                View Pharmacies
              </NavDropdown.Item>
            </NavDropdown>
          ) : loggedUser === true ? (
            <Button href="/pharma-help/pharmas" variant="outline-info">
              View Pharmacies
            </Button>
          ) : null}
          {(role === roles.pharmacist) | (role === roles.admin) ? (
            <NavDropdown title="Drugs">
              {(role === roles.pharmacist) | (role === roles.admin) ? (
                <NavDropdown.Item href="/pharma-help/register-drug">
                  Register One
                </NavDropdown.Item>
              ) : null}
              {role === roles.admin ? (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/pharma-help/view-drugs">
                    View All
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/pharma-help/drug-missing">
                    Most Requested Drugs
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/pharma-help/active-substance">
                    Active Substance
                  </NavDropdown.Item>
                </>
              ) : null}
            </NavDropdown>
          ) : null}
          {role === roles.pharmacist ? (
            <>
              <NavDropdown title="Pharmacy Stock">
                <NavDropdown.Item href="/pharma-help/add-drug-on-stock">
                  Add Drug on Stock
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/pharma-help/pharmacy-stock">
                  View Stock
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Reviews">
                <NavDropdown.Item href="/pharma-help/validate-reviews">
                  View News
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : null}

          {role === roles.admin ? (
            <NavDropdown title="Notifications">
              <Notification />
            </NavDropdown>
          ) : null}

          {role === roles.patient && loggedUser === true ? (
            <Button
              href="/pharma-help/request-med"
              variant="outline-info"
              style={{ marginLeft: "10px" }}
            >
              Request Drugs
            </Button>
          ) : null}
          {role === roles.patient && loggedUser === true ? (
            <Button
              href="/pharma-help/orderhistory"
              variant="outline-info"
              style={{ marginLeft: "10px" }}
            >
              Order History
            </Button>
          ) : null}
          {role === roles.patient && loggedUser === true ? (
            <Button
              href="/pharma-help/prescriptions"
              variant="outline-info"
              style={{ marginLeft: "10px" }}
            >
              Prescriptions
            </Button>
          ) : null}
          <Form inline style={{ marginLeft: "10px" }}>
            <FormControl
              type="text"
              name="drug"
              placeholder="Drug Name"
              className="mr-sm-2"
              onChange={this.handleSearchChange}
            />
            <FormControl
              type="text"
              name="location"
              placeholder="Location"
              className="mr-sm-2"
              onChange={this.handleSearchChange}
            />
            <Button variant="outline-info" onClick={this.searchDrug}>
              Search
            </Button>
          </Form>
        </Nav>
        <Nav>
          <Button
            href="/pharma-help/shopping-cart"
            variant="outline-danger"
            style={{ marginRight: "10px" }}
          >
            View Cart
          </Button>
          {loggedUser === true ? (
            <Button href="/" variant="outline-info" onClick={this.logout}>
              Log Out
            </Button>
          ) : (
            <Button href="/pharma-help/login" variant="outline-info">
              Log in
            </Button>
          )}
        </Nav>
      </Navbar>
    );
  }
}
export default NavigationBar;
