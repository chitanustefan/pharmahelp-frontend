import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
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
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Alert from 'react-bootstrap/Alert';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Button } from "react-bootstrap";
import StarRatingComponent from 'react-star-rating-component';

class PharmacyShop extends Component {
  constructor() {
    super();
    this.addToCart=this.addToCart.bind(this);
    this.leaveReview = this.leaveReview.bind(this);
    this.cancelReplaceOrder = this.cancelReplaceOrder.bind(this);
    this.replaceOrder = this.replaceOrder.bind(this);
    this.state = {
      stock : [],
      errorGetReq : null,
      errorGetReviewsReq: null,
      expanded : false,
      item : "",
      review: false,
      review_drug_id: null,
      review_drug_name: null,
      reviews : [],
      showAlert:false,
    }
  }

  componentDidMount() {
    let url = "http://localhost:8080/pharmacystock/getallbyidpharmacy?idPharmacy="+this.props.match.params.id;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type' : `application/json`,
      },
    })
    .then(res => {
        let stock = res.data;
        stock.forEach(drug => {
          this.setState(state => {const stock = [...state.stock, drug]; return {stock}});
        });
        this.setState({errorGetReq:false});
    })
    .catch(err => this.setState({errorGetReq:true}));

    axios.get("http://localhost:8080/reviews/validated", {
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
                drugName: review.drug.name,
                idReview: review.id_review,
                userName: review.user.fullName,
                userEmail: review.user.email,
                rating: review.rating
              }
              const reviews = [...state.reviews, rev]; 
              return {reviews}
            })
        });
    })
    .catch(err => this.setState({errorGetReviewsReq:true}));
  };

  addToCart(id_drug, price, drug_name, stock_quantity, drug_details, drug_prospectus, drug_activeSubstance, e){
      e.preventDefault();
      let item = {
          id: id_drug,
          price: price,
          quantity: 1,
          pharmacy_id : this.props.match.params.id,
          pharmacy_name: this.props.location.state.name,
          pharmacy_location: this.props.location.state.location,
          drug_name:drug_name,
          drug_details: drug_details || "",
          drug_prospectus: drug_prospectus || "",
          drug_activeSubstance: drug_activeSubstance || "",
          pharmacy_stock_quantity: stock_quantity,
      }
      this.setState({item:item})
      let shopStorage = JSON.parse(localStorage.getItem('shopCart'));
      let foundItem = false;
      if(shopStorage == null || shopStorage.length == 0){
        localStorage.setItem('shopCart', JSON.stringify([item]));
        return( NotificationManager.success(drug_name + ' added to your cart!'));
      } else {
        let pharmacyId = shopStorage[0].pharmacy_id;
        if(item.pharmacy_id !== pharmacyId){
          this.setState({showAlert : true})
        } else {
          shopStorage.forEach(storedItem => {
            if(storedItem.id === item.id){
              storedItem.quantity += 1;
              localStorage.setItem('shopCart', JSON.stringify(shopStorage));
              foundItem = true;
            } 
          })
          if(!foundItem){
            shopStorage = [...shopStorage, item];
            localStorage.setItem('shopCart', JSON.stringify(shopStorage));      
          }
          return( NotificationManager.success(drug_name + ' added to your cart!'));
        }
        
      }
  };

  leaveReview(drug_id, drug_name){
    this.setState({review_drug_id : drug_id})
    this.setState({review_drug_name : drug_name})
    this.setState({review : true})
  }

  handleExpandClick = id => e => {
    if(id !== this.state.expandedItem){
      this.setState({expandedItem : id})
      this.setState({expanded: true});
    } else {
      this.setState({expandedItem : id})
      this.setState({expanded: !this.state.expanded});
    }
  }

  cancelReplaceOrder(){
    this.setState({showAlert:false})
  }

  replaceOrder(){
    localStorage.setItem('shopCart', JSON.stringify([this.state.item]));
    this.setState({ showAlert: false});
    return( NotificationManager.success(this.state.item.drug_name + ' added to your cart!'));
  }

  render() {
    const stock = this.state.stock;
    const errorGetReq = this.state.errorGetReq;
    const expanded = this.state.expanded;
    const reviews = this.state.reviews;

    if(this.state.review){
      return <Redirect to={{
        pathname: "/pharma-help/leave-a-review/"+this.state.review_drug_id, 
        state:{
          drug_name: this.state.review_drug_name
        } 
      }}/>
    }
    return (
    <div>
        <NavigationBar />
        <div className = "main-page">
          <br/>
          <h1>{this.props.location.state.name}</h1>
          <h3>{this.props.location.state.location}</h3>
          {(errorGetReq === true) ? (<h4>Could not get drugs from server!</h4>)
            :
            (
              (stock.length === 0 && errorGetReq === false) ? (<h4 style={{color:"red"}}>There is no drug in store!</h4>):
              (<div style={{margin:'4vw'}}>
              <>
                <Alert show={this.state.showAlert} variant="danger">
                  <Alert.Heading>Delete items from shop cart!</Alert.Heading>
                  <p>
                    By adding this product you will lose your current items from your shopping cart!
                    You can place an order with items from the same pharmacy.
                  </p>
                  <hr />
                  <div style={{display:"inlineFlex"}}>
                    <Button style={{marginRight:"10px"}} onClick={this.replaceOrder} variant="danger">
                      Replace Order
                    </Button>
                    <Button onClick={this.cancelReplaceOrder} variant="outline-danger">
                      Cancel
                    </Button>
                  </div>
                  
                </Alert>
              </>
                <div className="row" >         
                  {stock.map((element) =>
                    <div key={element.drug.id_drug} className="col-md-4 col-md-offset-2" style={{marginTop:'2vh'}}>
                    <Card>
                    <CardActionArea style={{cursor:'default',height:"180px"}}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        {element.drug.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {element.drug.details}
                        </Typography>
                        <Typography variant="body1" component="p">
                        Price: {element.price}
                        </Typography>
                        {(element.quantity===0)?(
                            <Typography variant="body1" component="p" style={{color:"red"}}>
                                Out of stock!
                            </Typography>
                        ):null}
                        </CardContent>
                    </CardActionArea>
                    <CardActions style={{display:'block'}}>
                        {(element.quantity > 0) ? 
                        (<Tooltip title="Add to cart" arrow placement="top" 
                          onClick={this.addToCart.bind(this, element.drug.id_drug, element.price, element.drug.name, element.quantity, element.drug.details, element.drug.prospectus, element.drug.activeSubstance)} 
                          style={{width:"48px", height:"48px"}}>
                          <Fab color="primary" >
                            <AddIcon />
                          </Fab>
                          </Tooltip>
                        ):(
                          <Fab color="secondary" disabled>
                            <AddIcon />
                          </Fab>
                        )}
                        <Tooltip title="View Prospectus" aria-label="view-prospectus" arrow placement="top">
                        <IconButton
                        id={element.drug.id_drug}
                        onClick={this.handleExpandClick(element.drug.id_drug)}
                        aria-expanded={expanded}
                        aria-label="show more"
                        className="expandButton">
                            <ExpandMoreIcon />
                        </IconButton>
                        </Tooltip>
                    </CardActions>
                    {(errorGetReq === true) ? (
                        <h4>Internal server error!</h4>
                    ) : null}

                    <Collapse in={(element.drug.id_drug === this.state.expandedItem) ? expanded : null} timeout="auto" unmountOnExit>
                        <CardContent>
                        <Typography >Prospectus:</Typography>
                        <Typography paragraph>
                        {element.drug.prospectus}
                        </Typography>
                        {
                          (reviews.length > 0) ? (
                            <>
                            <hr/>
                            <hr/>
                            <Typography variant="h5" align="center" style={{marginBottom:"10px"}}>Reviews:</Typography>
                            </>
                          ): null
                        }
                        {
                          reviews.map((review) => 
                            (review.drugName === element.drug.name) ? (
                              <>
                              <div key={review.idReview}>
                              <div style={{display:"inline-flex"}}>
                                <Typography variant="h6">
                                  {review.userName}:
                                </Typography>
                                <StarRatingComponent 
                                  name="review-rating" 
                                  editing={false}
                                  starCount={5}
                                  value={review.rating}
                                  />
                              </div>
                              
                              <Typography>
                                {review.comment}
                              </Typography>
                              <hr/>
                              </div>
                              </>
                            ) : null
                          )
                        }
                        <Button variant="warning"
                        onClick={this.leaveReview.bind(this, element.drug.id_drug, element.drug.name)} 
                        >Leave a Review</Button>
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
        <NotificationContainer/>
    </div>
    );
  }
}
export default PharmacyShop;
