import React, { Component } from "react";
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
class PharmacyStock extends Component {
  constructor() {
    super();
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.state = {
      stock : [],
      errorGetReq : false,
      expanded : false,
    }
  }

  componentDidMount() {
    let currentUserId = "";
      axios.get('http://localhost:8080/user/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(res => {
        currentUserId = res.data.id_user;
        let url = "http://localhost:8080/pharmacystock/getallbypharmacist?idUser="+currentUserId;
        axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type' : `application/json`,
          },
        })
        .then(res => {
            let stock = res.data;
            stock.forEach(drug => {
                this.setState(state => {const stock = [...state.stock, drug]; return {stock}})
            });
        })
        .catch(err => this.setState({errorGetReq:true}))
      })
      .catch(err => this.setState({errorGetReq: true}));
  };

  handleExpandClick = id => e => {
    if(id !== this.state.expandedItem){
      this.setState({expandedItem : id})
      this.setState({expanded: true});
    } else {
      this.setState({expandedItem : id})
      this.setState({expanded: !this.state.expanded});
    }
  }

  render() {
    const stock = this.state.stock;
    const errorGetReq = this.state.errorGetReq;
    const expanded = this.state.expanded;
    return (
      <div>
        <NavigationBar />
        <div className = "main-page">
          <br/>
          <h1>Pharmacy Stock</h1>
          {(errorGetReq === true) ? (<h4>Could not get drugs from server!</h4>)
            :
            (
              (stock.length === 0) ? (<h4>There is no drug in store!</h4>):
              (<div style={{margin:'4vw'}}>
                <div className="row" >         
                  {stock.map((element) =>
                    <div key={element.drug.id_drug} className="col-md-4 col-md-offset-2" style={{marginTop:'2vh'}}>
                    <Card>
                    <CardActionArea style={{cursor:'default'}}>
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
                        <Typography variant="body1" component="p">
                        Quantity on stock: {element.quantity}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions style={{display:'block'}}>
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
                        <Typography paragraph>Prospectus:</Typography>
                        <Typography paragraph>
                        {element.drug.prospectus}
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
export default PharmacyStock;
