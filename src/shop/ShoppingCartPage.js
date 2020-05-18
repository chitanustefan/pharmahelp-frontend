import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import { Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

class ShoppingCart extends Component {
  constructor(props) {
    super();
    this.placeOrder = this.placeOrder.bind(this);
    this.addOneItem = this.addOneItem.bind(this);
    this.removeOneItem = this.removeOneItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.state = {
      shopCart: JSON.parse(localStorage.getItem("shopCart")) || [],
      postError: null,
    };
  }

  componentDidMount(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let drugsJSON = params.get('drugs');
    let drugList = decodeURIComponent(drugsJSON);
    //"%5B%22113%22%2C%22118%22%5D"
    if(drugList != "null"){
      let items = drugList.match(/[0-9]+/g);
      items.forEach(id => {
          let url = "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/api/auth/getbyid?id="+id;
          axios.get(url)
          .then(res => {
              let drug = res.data;
              let item ={
                id: drug.id_drug,
                price:Math.floor(Math.random() * (50 - 10)) + 10,
                quantity: 1,
                pharmacy_id:101,
                pharmacy_name:"Catena",
                pharmacy_location:"Cluj-Napoca, Str Dorobantilor nr. 75",
                drug_name:drug.name,
                drug_details: drug.details,
                drug_prospectus: drug.prospectus,
                drug_activeSubstance: drug.activeSubstance,
                pharmacy_stock_quantity: 50
              }
              let shopCart = JSON.parse(localStorage.getItem('shopCart'));
              let foundItem = false;
              if(shopCart == null){
                localStorage.setItem('shopCart', JSON.stringify([item]));
              }else{
                shopCart.forEach(storedItem => {
                    if(storedItem.id === item.id){
                      storedItem.quantity += 1;
                      localStorage.setItem('shopCart', JSON.stringify(shopCart));
                      foundItem = true;
                    } 
                })
                if(!foundItem){
                  shopCart = [...shopCart, item];
                  localStorage.setItem('shopCart', JSON.stringify(shopCart));      
                }
              }
              this.setState({shopCart: JSON.parse(localStorage.getItem("shopCart"))})
          })
          .catch(err => this.setState({errorGetReq:true}))
      })
    }
  }
  placeOrder() {
    this.setState({postError : null})
    let shopCart = JSON.parse(localStorage.getItem('shopCart'));
    shopCart.forEach((element) => {
      element.price = element.price * element.quantity;
    });
    let totalPrice = 0;
    shopCart.forEach((element) => {
      totalPrice += element.price
    });
    let pharmacy = {
      id_pharmacy: shopCart[0].pharmacy_id,
      name: shopCart[0].pharmacy_name,
      location: shopCart[0].pharmacy_location
    }
    let drugsPerOrder = [];
    shopCart.forEach(item => {
      let orderItem = {
        total: item.price,
        quantity: item.quantity,
        drug: {
          id_drug: item.id,
          name: item.drug_name,
          status: "approved",
          details: item.drug_details,
          prospectus: item.drug_prospectus,
          activeSubstance: item.drug_activeSubstance
        }
      };
      drugsPerOrder = [...drugsPerOrder, orderItem]
    });

    let currentUser = "";
    axios.get('http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/user/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(res => {
      currentUser = res.data;
      delete currentUser.adminNotifications;
      delete currentUser.order;
      let order = {
        status:"pending",
        totalPrice: parseInt(totalPrice, 10),
        user: currentUser,
        pharmacy:pharmacy,
        drugPerOrders: drugsPerOrder
      }
      console.log(order);
      let url = "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/order/addorder"
      axios.post(url, order, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type' : `application/json`,
        },
      })
      .then(res => {
        this.setState({postError : false});
        var shopCart = []
        localStorage.setItem('shopCart', JSON.stringify(shopCart))
      })
      .catch(err => {this.setState({postError:true});})
    })
    .catch(err => this.setState({errorGetReq: true}));
  }

  addOneItem(id, e) {
    let shopCart = this.state.shopCart;
    shopCart.forEach((item) => {
      if (item.id === id) {
        if (item.quantity < item.pharmacy_stock_quantity) {
          item.quantity += 1;
        }
      }
    });
    this.setState({ shopCart: shopCart });
    localStorage.setItem("shopCart", JSON.stringify(this.state.shopCart));
  }

  removeOneItem(id, e) {
    let shopCart = this.state.shopCart;
    shopCart.forEach((item) => {
      if (item.id === id) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    });
    this.setState({ shopCart: shopCart });
    localStorage.setItem("shopCart", JSON.stringify(this.state.shopCart));
  }

  goToLogin(){
    window.location = "/pharma-help/login"
  }

  removeItem(id, e) {
    let shopCart = this.state.shopCart;
    shopCart = shopCart.filter((item) => item.id !== id) 
    this.setState({ shopCart: shopCart});
    localStorage.setItem("shopCart", JSON.stringify(shopCart));
  }

  render() {
    let shopCart = this.state.shopCart;
    let totalPrice = 0;
    shopCart.forEach((element) => {
      totalPrice += element.price * element.quantity;
    });
    const loggedUser = localStorage.getItem("accessToken") ? true : false;
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          {this.state.postError === false ? (
            <>
              <br />
              <br />
              <div
                className="banner"
                style={{ display: "flex", width: "fit-content" }}
              >
                <img
                  src={require("../public/images/success.png")}
                  alt="shop..."
                  style={{ width: "130px", marginLeft: "20px" }}
                />
                <h1 style={{ lineHeight: "10rem" }}>Your order has been registered!</h1>
              </div>
            </>
          ) : (
            <>
              <br />
              <br />
              <div
                className="banner"
                style={{ display: "flex", width: "fit-content" }}
              >
                <img
                  src={require("../public/images/shopCart.png")}
                  alt="shop..."
                  style={{ width: "130px", marginLeft: "20px" }}
                />
                <h3 style={{ lineHeight: "6rem" }}>Cart Items</h3>
              </div>

              <br />
              <div>
                <div className="banner" style={{width: "fit-content"}}>
                  {shopCart.length < 1 ? (
                    <h4>
                      {" "}
                      Your shopping cart is empty! Go and add some items!
                    </h4>
                  ) : (
                    <>
                      <table style={{ width: "100%" }}>
                        <tbody className="cell">
                          <tr>
                            <th>
                              <span style={{paddingRight: "10px"}}>Item Name</span> <hr />
                              <hr />
                            </th>
                            <th>
                            <span style={{paddingRight: "10px"}}>Price</span> <hr />
                              <hr />
                            </th>
                            <th>
                            <span style={{paddingRight: "10px"}}>Pharmacy</span>
                              <hr />
                              <hr />
                            </th>
                            <th>
                            <span style={{paddingRight: "10px"}}>Address</span>
                              <hr />
                              <hr />
                            </th>
                            <th>
                            <span style={{paddingRight: "10px"}}>Quantity</span> <hr />
                              <hr />
                            </th>
                          </tr>
                          {shopCart.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {item.drug_name} <hr />
                              </td>
                              <td>
                                {item.price * item.quantity} <hr />
                              </td>
                              <td>
                                {item.pharmacy_name} <hr />
                              </td>
                              <td>
                                {item.pharmacy_location} <hr />
                              </td>
                              <td style={{ display: "inline-flex" }}>
                                <form>
                                  <input
                                    style={{
                                      borderRadius: "8px",
                                      height: "40px",
                                      textAlign: "center",
                                    }}
                                    size="2"
                                    type="text"
                                    name="quantity"
                                    readOnly
                                    value={item.quantity}
                                  />
                                </form>
                                <div style={{ display: "inherit" }}>
                                  <Tooltip
                                    title="Add one item"
                                    arrow
                                    placement="top"
                                    onClick={this.addOneItem.bind(
                                      this,
                                      item.id
                                    )}
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      marginLeft: "4px",
                                      marginRight: "4px",
                                    }}
                                  >
                                    <Fab color="primary">
                                      <AddIcon />
                                    </Fab>
                                  </Tooltip>
                                  <Tooltip
                                    title="Remove one item"
                                    arrow
                                    placement="top"
                                    onClick={this.removeOneItem.bind(
                                      this,
                                      item.id
                                    )}
                                    style={{ width: "38px", height: "38px" }}
                                  >
                                    <Fab color="primary">
                                      <RemoveIcon />
                                    </Fab>
                                  </Tooltip>
                                </div>
                                <hr />
                              </td>
                              <td style={{ display: "inline" }}>
                                <Tooltip
                                  title="Delete item"
                                  arrow
                                  placement="top"
                                  onClick={this.removeItem.bind(this, item.id)}
                                >
                                  <IconButton aria-label="delete" style={{}}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
                <br />
                <div className="banner" style={{ width: "fit-content" }}>
                  <table style={{ width: "100%" }}>
                    <tbody className="cell">
                      <tr>
                        <th>
                          Order Summary
                          <hr />
                          <hr />
                        </th>
                      </tr>
                      <tr key="total-price">
                        <td>
                          Total price: {totalPrice}
                          <hr />
                        </td>
                      </tr>
                      <tr key="place-order">
                      {(loggedUser === true) ? (
                        <td>
                        <Button
                          size="lg"
                          variant="outline-success"
                          onClick={this.placeOrder}
                        >
                          Place Order
                        </Button>
                      </td>
                      ) : (
                        <td>
                        <Button
                          size="lg"
                          variant="outline-success"
                          onClick={this.goToLogin}
                        >
                          Go To Login Page
                        </Button>
                      </td>
                      )}
                        
                      </tr>
                      {this.state.postError === true ? (
                        <tr key="place-order-error">
                          <td style={{color:'red'}}>Something went wrong! Please try again!</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
export default ShoppingCart;
