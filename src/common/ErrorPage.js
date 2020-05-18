import React, { Component } from "react";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
class ErrorPage extends Component {

  render() {
    return (
      <div className="main-page">
        <NavigationBar />
        <br/>
        <div>
            <div>
                <h1 className="register-error">Access forbidden to this resource!</h1>
            </div>
            <div>
                <img src={require("../public/images/error.png")} alt="welcome..." style={{width:'30vw'}}/>
            </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
