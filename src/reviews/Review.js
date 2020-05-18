import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import StarRatingComponent from 'react-star-rating-component';
import { Button } from "react-bootstrap";

class Review extends Component {
  constructor() {
    super();
    this.addReview = this.addReview.bind(this);
    this.state = {
        rating : 1,
        comment : "",
        postError: null,
        errorMessage: "",
    };
  }

  addReview(){
    this.setState({postError : null})
    let currentUserId = "";
    axios.get('http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/user/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(res => {
      currentUserId = res.data.id_user;
      let review = {
        rating: this.state.rating,
        comment: this.state.comment
      };
      let url = "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/reviews/add?userID=" + currentUserId + "&drugID=" + this.props.match.params.id
      axios.post(url, review, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type' : `application/json`,
        },
      })
      .then(res => {
        this.setState({postError : false});
      })
      .catch(err => {
            this.setState({postError:true}); 
            this.setState({errorMessage : err.response.data})
        })
    })
    .catch(err => this.setState({postError: true}));
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

  render() {
    const rating = this.state.rating;
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <br />
          <div
            className="banner"
            style={{ display: "flex", width: "fit-content" }}>
            <h1 style={{ lineHeight: "4rem" }}>
              Review for {this.props.location.state.drug_name}
            </h1>
          </div>
          <br />
          {(this.state.postError === false) ? (
            <div className="banner" style={{ display: "flex", width: "fit-content" }}>
                <img src={require("../public/images/success.png")} alt="shop..." style={{ width: "130px", marginLeft: "20px" }} />
                <h1 style={{ lineHeight: "10rem" }}>Your review has been registered!</h1>
            </div>
          ) : (
            <div className="banner">
            <h4>How much do you like this product: </h4>
            <StarRatingComponent 
            name="rate1" 
            starCount={5}
            value={rating}
            onStarClick={this.onStarClick.bind(this)}
            />
            <br/>
            <h4>Say what's on your mind about this product:</h4>
            <p>*this field is not mandatory</p>
            <form id="noter-save-form" method="POST">
                <textarea
                className="form-control"
                id="details"
                type="textarea"
                rows="3"
                style={{borderColor: "gray"}}
                onChange={(event) => {
                let c = this.state.comment;
                c = event.target.value;
                this.setState({ comment : c });
                }}
                />
            </form>
            <br/>
            <Button variant="warning" onClick={this.addReview} 
             >Add Review</Button>
             <br/>
             <br/>
            {(this.state.postError === true) ? (
                (this.state.errorMessage !== "") ? (
                    <h3 style={{color:'red'}}>{this.state.errorMessage}!</h3>
                ) : (
                    <h3 style={{color:'red'}}>Something went wrong! Please try again!</h3>
                )
            ) :null}
          </div>
          )}
        </div>
      </div>
    );
  }
}
export default Review;
