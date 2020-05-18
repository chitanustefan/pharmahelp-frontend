import React, { Component } from "react";
import "./orderpage.css";
import axios from "axios";
import NavigationBar from "../navbar/NavigationBar";
import "../App.css";

class OrderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {
        id_order: "",
        status: "",
        pharmacy_name: "",
        totalPrice: "",
        //ce mai are o farmaciee om vedea
      },
      orders: [],
      error: false,
      errorGetReq: false,
    };
  }
  componentDidMount() {
    let currentUserId = "";
    axios
      .get("http://localhost:8080/user/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        currentUserId = res.data.id_user;
        let url =
          "http://localhost:8080/order/getOrdersByUser?idUser=" + currentUserId;
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": `application/json`,
            },
          })
          .then((res) => {
            this.setState({ orders: res.data });
          })
          .catch((err) => this.setState({ errorGetReq: true }));
      })
      .catch((err) => this.setState({ errorGetReq: true }));
  }

  render() {
    var errorGetReq = this.state.errorGetReq;

    var errorPostReq = this.state.errorPostReq;
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <br />
          <div className="banner" style={{ display: "flex" }}>
            <img
              src={require("../public/images/download.png")}
              alt="pharma..."
              style={{
                width: "130px",
                marginLeft: "20px",
                marginRight: "50px",
              }}
            />

            <h3 style={{ lineHeight: "3rem" }}>
              On this page you can see all the orders
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
                        Id Order <hr />
                        <hr />
                      </th>
                      <th>
                        Status <hr />
                        <hr />
                      </th>
                      <th>
                        Pharmacy Name <hr />
                        <hr />
                      </th>
                      <th>
                        Total Price <hr />
                        <hr />
                      </th>
                    </tr>
                    {this.state.orders.map((order) => (
                      <tr key={order.id_order}>
                        <td>
                          {order.id_order} <hr />
                        </td>
                        <td>
                          {order.status} <hr />
                        </td>
                        <td>
                          {order.pharmacy.name} <hr />
                        </td>
                        <td>
                          {order.totalPrice} <hr />
                        </td>
                      </tr>
                    ))}{" "}
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

export default OrderPage;
