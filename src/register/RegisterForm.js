import React, { Component } from "react";
import "../App.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
class RegisterForm extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      registerSuccesfully: null,
      emptyInputError: null,
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ emptyInputError: null });
    this.setState({ registerSuccesfully: null });

    const account = {
      fullName: this.state.fullName || "",
      email: this.state.email || "",
      password: this.state.password || "",
    };
    var regex = "^\\s*$";
    if (
      account.fullName.match(regex) ||
      account.email.match(regex) ||
      account.password.match(regex)
    ) {
      this.setState({ emptyInputError: true });
    } else {
      axios
        .post("http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/api/auth/register", account)
        .then((response) => {
          console.log(account);
          this.setState({ registerSuccesfully: true });
        })
        .catch(
          () => console.log("Eroare"),
          this.setState({ registerFailed: true })
        );
    }
  }

  render() {
    if (this.state.registerSuccesfully) {
      return <Redirect to="/pharma-help/login" />;
    }

    var emptyInputError = this.state.emptyInputError;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <FaUser className="faIcons icon" />
            <input
              className="form-item"
              placeholder="Full Name"
              name="fullName"
              type="text"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <FaEnvelope className="faIcons icon" />
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
          {emptyInputError === true ? (
            <p className="register-error">Please fill out all fields!</p>
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

export default RegisterForm;
