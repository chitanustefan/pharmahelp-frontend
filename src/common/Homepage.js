import React, { Component } from "react";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import axios from "axios";


class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      currentUser : null,
      errorGetReq: false,
    };
  }
  
  componentDidMount() {
    if(localStorage.getItem("accessToken") != null){
      axios
        .get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/user/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          this.setState({currentUser : res.data})
        })
        .catch((err) => this.setState({ errorGetReq: true }));
    }
  };

  render() {
    const currentUser = this.state.currentUser;
    return (
      <div className="main-page">
        <NavigationBar />
        <div>
          <div>
            <img src={require("../public/images/welcome.png")} alt="welcome..." />
          </div>
          <div style={{position:'absolute'}}>
            <img src={require("../public/images/nurse2.gif")} alt="nurse..." />
          </div>
          <div >
           {(currentUser != null) ? (
             <>
                <h2>{currentUser.fullName}</h2>
                <h5>{(currentUser.role).toUpperCase()}</h5>
              </>
            ) : null }
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
