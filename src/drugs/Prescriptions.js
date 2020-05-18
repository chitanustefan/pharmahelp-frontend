import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import { QRCode } from 'react-qr-svg';

class Prescriptions extends Component {
  constructor() {
    super();
    this.state = {
      drugs: [],
      errorGetReq: false,
      errorPostReq: false,
    };

  }

  componentDidMount() {
    axios
      .get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/drug/getall", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        let drugs = res.data;
        drugs.forEach((drug) => {
          this.setState((state) => {
            const drugs = [...state.drugs, drug];
            console.log(drugs);
            return { drugs };
          });
        });
      })
      .catch((err) => this.setState({ errorGetReq: true }));
      
  }

  render() {
    var drugs = JSON.stringify(['8','9']);
    var url = 'http://localhost:3000/cart?drugs='+ encodeURIComponent(drugs);
    console.log(url);
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <h1>Medical Prescriptions</h1>
          <QRCode
            level="Q"
            style={{ width: 256 }}
            value={url}
          />
        </div>
      </div>
    );
  }
}
export default Prescriptions;
