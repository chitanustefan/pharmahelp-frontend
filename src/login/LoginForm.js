import React, { Component } from "react";
import axios from 'axios';
import "../App.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import host from '../host';

class LoginForm extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loginSuccessfully: null,
      error: false,
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(host);
    this.setState({ error: false });
    this.setState({ loginSuccessfully: null });
    const account = {
      email: this.state.email || "",
      password: this.state.password || "",
    };
    var regex = "^\\s*$";
    if (account.email.match(regex) || account.password.match(regex)) {
      this.setState({ error: true });
    } else {
        axios.post('https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/api/auth/login', account)
        .then(res => {
          localStorage.setItem('accessToken', res.data.accessToken || null)
          localStorage.setItem('role', res.data.role || null)
          // var shopCart = []
          // localStorage.setItem('shopCart', JSON.stringify(shopCart))
          this.setState({loginSuccessfully:true})
        })
        .catch(err => this.setState({loginSuccessfully:false}))
    }
  }

  render() {
    if (this.state.loginSuccessfully) {
      return <Redirect to="/" />;
    }
    var loginSuccessfully = this.state.loginSuccessfully;
    var error = this.state.error;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <FaUser className="faIcons icon" />
            <input
              className="form-item"
              placeholder="Email"
              name="email"
              type="text"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <FaLock className="faIcons icon" />
            <input
              className="form-item"
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleChange}
            />
          </div>
          {loginSuccessfully === false ? (
            <p className="register-error">Incorrect email or password</p>
          ) : null}
          {error === true ? (
            <p className="register-error">Please fill out both fields!</p>
          ) : null}
          <div className="App">
            <Button
              className="register-button"
              variant="success"
              type="submit"
              onClick={this.handleChange}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
export default LoginForm;
