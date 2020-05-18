import React, { Component } from "react";
import axios from 'axios';
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import Select from "react-select";
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from "react-bootstrap";


class AddDrugOnStock extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      drug: {
        name: {value:'', label: 'Select an option'},
        quantity: "",
        price: ""
      },
      drugs : [],
      errorGetReq : false,
      errorPostReq: false,
      errorEmptyInput: false,
      successPostReq: false,
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/drug/getall', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(res => {
      let drugs = res.data;
      drugs.forEach(drug => {
          if(drug.status === "approved"){
            this.setState(state => {const drugs = [...state.drugs, { value: drug.id_drug, label: drug.name }]; return {drugs}})
          }
      });
    })
    .catch(err => this.setState({errorGetReq: true}));
  };

  handleChange(e) {
    let drug = this.state.drug;
    drug[e.target.name] = e.target.value
    this.setState({ drug : drug });
    this.setState({ errorEmptyInput : false});
    this.setState({ errorGetReq : false});
    this.setState({ errorPostReq : false});
    this.setState({ successPostReq : false});
  };

  handleDrugChange = selectedDrug => {
    let drug = this.state.drug;
    drug.name= selectedDrug;
    this.setState({ drug : drug });
    this.setState({ errorEmptyInput : false});
    this.setState({ errorGetReq : false});
    this.setState({ errorPostReq : false});
    this.setState({ successPostReq : false});
  };

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ errorEmptyInput : false});
    this.setState({ errorGetReq : false});
    this.setState({ errorPostReq : false});
    this.setState({ successPostReq : false});
    const drug = {
      id: this.state.drug.name.value || "",
      quantity:  this.state.drug.quantity || "",
      price: this.state.drug.price || "",
    };
    var regex = "^\\s*$";
    var id = ""+drug.id;
    if (id.match(regex) || drug.quantity.match(regex) || drug.price.match(regex)) {
      this.setState({ errorEmptyInput: true });
    } else {
      let currentUserId = "";
      axios.get('http://localhost:8080/user/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(res => {
        currentUserId = res.data.id_user;
        let url = "http://localhost:8080/pharmacystock/insertInStock?idUser="+currentUserId+"&idDrug="+drug.id;
        delete drug.id;
        console.log(url)
        axios.post(url, drug, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type' : `application/json`,
          },
        })
        .then(res => {
          this.setState({successPostReq : true});
          this.setState({drug: { quantity: "", price: "", name : {value:'', label: 'Select an option'} }});
        })
        .catch(err => {this.setState({errorPostReq:true}); console.log(err.response); this.setState({successPostReq : false})})
      })
      .catch(err => this.setState({errorGetReq: true}));
    }
  };

  render() {
    const drugs = this.state.drugs;
    const errorGetReq = this.state.errorGetReq;
    const errorPostReq = this.state.errorPostReq;
    const errorEmptyInput = this.state.errorEmptyInput;
    const success = this.state.successPostReq;
    return (
      <div>
        <NavigationBar />
        <div className = "main-page">
        <br />
        <br />
        <div className="banner"style={{display:'flex'}}>
            <img src={require("../public/images/store.png")} alt="pharma..." style={{width: '130px',marginLeft: '20px'}}/>
            <h3>On this page you add a drug on your pharmacy store</h3>
        </div>
        <br/>
        <div className="banner" style={{display: 'grid'}}>
          
          {(errorGetReq === true) ? (<h4>Could not get drugs from server!</h4>)
            :
            (
              (drugs.length === 0) ? (<h4>There is no drug in store!</h4>):
              (
              <form onSubmit={this.handleSubmit}>
                <div>
                <Tooltip title="Select the drug you want to add on pharmacy stock" aria-label="select-drug" arrow placement="top">
                  <Select
                  value = {this.state.drug.name}
                  className="form-select-item"
                  onChange={this.handleDrugChange}
                  options={drugs}
                  />
                </Tooltip>
                </div>
                <div>
                <Tooltip title="Set the quantity for drug" aria-label="select-price" arrow placement="top">
                  <input
                    className="form-item"
                    placeholder="Quantity"
                    name="quantity"
                    type="text"
                    value={this.state.drug.quantity}
                    onChange={this.handleChange}
                  />
                </Tooltip>
                </div>
                <div>
                <Tooltip title="Set the price for drug" aria-label="select-price" arrow placement="top">
                  <input
                    className="form-item"
                    placeholder="Price"
                    name="price"
                    type="text"
                    value={this.state.drug.price}
                    onChange={this.handleChange}
                  />
                </Tooltip>
                </div>
                {errorEmptyInput === true ? (
                  <p className="register-error">Please fill out all fields!</p>
                ) : null}
                {errorPostReq === true ? (
                  <p className="register-error">Oops! Something went wrong! Please try again!</p>
                ) : null}
                {success === true ? (
                  <p className="register-success">Added successfully!</p>
                ) : null}
                <div className="App">
                  <Button
                    className="register-button"
                    variant="success"
                    type="submit"
                  >
                  Submit
                </Button>
              </div>
              </form>
              )
            )
          }
        </div>
        </div>
      </div>
    );
  }
}
export default AddDrugOnStock;
