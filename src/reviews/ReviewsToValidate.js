import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Button, Badge } from "react-bootstrap";
import StarRatingComponent from 'react-star-rating-component';
import data from "../config/data.json"

const status = data[0]["status"];

class ReviewsToValidate extends Component {
  constructor() {
    super();
    this.state = {
        errorGet : false,
        errorPost : false,
        reviews : []
    };
  }

  componentDidMount() {
    axios.get("https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/reviews/nonvalidated", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type' : `application/json`,
      },
    })
    .then(res => {
        let reviews = res.data;
        reviews.forEach(review => {
            this.setState(state => {
                let rev = {
                    comment: review.comment,
                    date: review.createdDate.split("T")[0],
                    idReview: review.id_review,
                    rating: review.rating,
                    emailUser: review.user.email,
                    nameUser: review.user.fullName,
                    drugName: review.drug.name,
                    status: review.status
                }
                const reviews = [...state.reviews, rev]; 
                return {reviews}
            })
        });
    })
    .catch(err => this.setState({errorGet:true}));
  };

  handleExpandClick = id => e => {
    if(id !== this.state.expandedItem){
      this.setState({expandedItem : id})
      this.setState({expanded: true});
    } else {
      this.setState({expandedItem : id})
      this.setState({expanded: !this.state.expanded});
    }
  };

  handleStatusChangeClick(idReview, status, e){
    var regex = "^\\s*$";
    let idString = idReview+"" || "";
    if (idString.match(regex) || status.match(regex)) {
      this.setState({ errorPost: true });
    } else {
      let url = "https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/reviews/validate?id="+idReview + "&status="+ status
      axios.put(url, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type' : `application/json`,
        },
      })
      .then(res => {
        window.location.reload();
      })
      .catch(err => this.setState({errorPost: true}));
    }
  };

  render() {
    const reviews = this.state.reviews;
    const errorPost = this.state.errorPost;
    const errorGet = this.state.errorGet;
    const expanded = this.state.expanded;
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
              Reviews
            </h1>
          </div>
          <br />
          {(errorGet === true) ? (
            <div className="banner">
                <h4>Could not get reviews from server!</h4>
            </div>)
            :
            (
              (reviews.length === 0) ? (
                <div className="banner">
                    <h4>There is no new review!</h4>
                </div>
                ):(
                <div style={{margin:'4vw'}}>
                    <div className="row" >         
                        {reviews.map((review) =>
                            <div key={review.idReview} className="col-md-4 col-md-offset-2" style={{marginTop:'2vh'}}>
                            <Card>
                            <CardActionArea style={{cursor:'default'}}>
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                {review.drugName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                User Name: {review.nameUser}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                User Email: {review.emailUser}
                                </Typography>
                                <StarRatingComponent 
                                name="review-rating" 
                                editing={false}
                                starCount={5}
                                value={review.rating}
                                />
                                <Typography>
                                    <Badge variant="warning">{(review.status).toUpperCase()}</Badge>
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions style={{display:'block'}}>
                                {(review.status === status.pending) ? 
                                ( <Button variant="success" onClick={this.handleStatusChangeClick.bind(this, review.idReview, status.approved)}> Approve </Button>) : null }
                                {(review.status === status.pending) ? 
                                ( <Button variant="danger" onClick={this.handleStatusChangeClick.bind(this, review.idReview, status.rejected)}> Reject </Button>) : null }
                                <Tooltip title="View Comment" aria-label="view-comment" arrow placement="top">
                                <IconButton
                                id={review.idReview}
                                onClick={this.handleExpandClick(review.idReview)}
                                aria-expanded={expanded}
                                aria-label="show more"
                                className="expandButton">
                                    <ExpandMoreIcon />
                                </IconButton>
                                </Tooltip>
                            </CardActions>
                            {(errorPost === true) ? (
                                <h4>Something went wrong!</h4>
                            ) : null}
                            <Collapse in={(review.idReview === this.state.expandedItem) ? expanded : null} timeout="auto" unmountOnExit>
                                <CardContent>
                                <Typography paragraph>Comment:</Typography>
                                <Typography paragraph>
                                {review.comment}
                                </Typography>
                                </CardContent>
                            </Collapse>
                            </Card>
                        </div>
                        )}
                    </div>
                </div>
              )
            )
          }
        </div>
      </div>
    );
  }
}
export default ReviewsToValidate;
