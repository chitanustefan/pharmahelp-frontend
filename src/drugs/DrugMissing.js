//Vizualizeaza cele mai cerute medicamente care sunt lipsa pe piata, in functie de oras.

//select the city ?? cum un drop down button cu orasele luate cu un get de la farmacii

//lista cu medicamentele luate dupa oras in functie de stock si in functie de cat is cerute ce inseamna

//in work
import React, { Component } from "react";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import axios from "axios";
import Select from "react-select";
export class DrugMissing extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.loadreq = this.loadreq.bind(this);
    this.state = {
      city: {
        label: "",
        value: "",
      },
      cities: [],
      drugs: [],
      drug: {
        id: "",
        name: "",
        details: "",
        prospectous: "",
        status: "",
      },
      errorGetReq: false,
    };
  }
  loadreq() {
    axios
      .get(
        "https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/rfa/mostRequestedDrug/?location=" +
          this.state.city.label,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        this.setState({ drug: response.data });
        //console.log(response.data);
        //console.log(this.state.requests);
      })
      .catch(() => console.log("Eroare"), this.setState({ errorGetReq: true }));
  }
  handleChange = (city) => {
    this.setState({ city });
    //console.log(this.state.city);
    //axios get
    console.log(this.state.drugs);
    this.loadreq();
    console.log(this.state.drugs);
  };

  componentDidMount() {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    axios
      .get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/pharmacystock/locations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        this.setState(
          {
            cities: response.data.filter(onlyUnique),
          }
          //  this.setState({ cities: this.state.cities.filter(onlyUnique) })
        );
        //console.log(response.data);
        console.log(this.state.cities);
        console.log(this.state.cities);
      })
      .catch(() => console.log("Eroare"));
    //this.loadreq();
  }

  render() {
    // console.log(cg);
    //console.log(this.state.cities);
    var listOfObjects = [];
    this.state.cities.forEach(function (entry) {
      var singleObj = {};
      singleObj["label"] = entry;
      singleObj["value"] = entry;
      listOfObjects.push(singleObj);
    });
    console.log(this.state.city.label);
    var drug = this.state.drug;
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <br />
          <div className="banner" style={{ display: "center" }}>
            <div>
              <strong>Select a city:</strong>
            </div>
            <br />

            <Select
              className="form-select-item"
              onChange={this.handleChange}
              placeholder="Select"
              options={listOfObjects}
            />
          </div>
          <br />

          <div className="banner">
            <>
              <table style={{ width: "100%" }}>
                <tbody className="cell">
                  <tr>
                    <th>
                      Name <hr />
                      <hr />
                    </th>
                    <th>
                      Details <hr />
                      <hr />
                    </th>
                    <th>
                      Prospectous <hr />
                      <hr />
                    </th>
                    <th>
                      Status <hr />
                      <hr />
                    </th>
                  </tr>
                  {
                    <tr key={drug.id}>
                      <td>
                        {drug.name} <hr />
                      </td>
                      <td>
                        {drug.details} <hr />
                      </td>
                      <td>
                        {drug.prospectus} <hr />
                      </td>
                      <td>
                        {drug.status} <hr />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </>
          </div>
        </div>
      </div>
    );
  }
}
