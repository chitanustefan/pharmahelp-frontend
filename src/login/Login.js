import React, { Component } from "react";
import "../App.css";
import { Button } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "../register/RegisterForm";
import NavigationBar from "../navbar/NavigationBar";

class Login extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleRegisterForm = this.handleRegisterForm.bind(this);
    this.handleLoginForm = this.handleLoginForm.bind(this);
    this.state = {
      loginForm: true,
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleRegisterForm(e) {
    this.setState({ loginForm: false });
  }
  handleLoginForm(e) {
    this.setState({ loginForm: true });
  }
  render() {
    var loginForm = this.state.loginForm;
    return (
      <div>
        <NavigationBar />
        <div className="center">
          <div className="card">
            <h1>{loginForm ? "Login" : "Register"}</h1>
            {loginForm ? (
              <div>
                <LoginForm />
                <div className="register-card-footer">
                  <p> You do not have an account?</p>
                  <Button
                    className="register-button"
                    variant="light"
                    onClick={this.handleRegisterForm}
                  >
                    Register
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <RegisterForm />
                <div className="register-card-footer">
                  <p> You already have an account?</p>
                  <Button
                    className="register-button"
                    variant="light"
                    onClick={this.handleLoginForm}
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
