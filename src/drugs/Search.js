import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import NavigationBar from "../navbar/NavigationBar";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

class Search extends Component {
  constructor() {
    super();
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.state = {
      foundDrug: "",
      expanded: false,
    };
  }
  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let drug = params.get('drug');
    let location = params.get('location');

    var regex = "^\\s*$";
    if (
      !drug.match(regex) &&
      !location.match(regex)
    ) {
      let url =
        "http://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/api/auth/nameandlocation?name=" +
        drug +
        "&location=" +
        location;
      console.log(url);
      axios
        .get(url)
        .then((res) => {
          console.log(res.data)
          this.setState({foundDrug: res.data})
          this.setState({ successGetReq: true });
        })
        .catch((err) => {
          this.setState({ errorGetReq: true });
        });
    }
  }

  handleExpandClick = (id) => (e) => {
    if (id !== this.state.expandedItem) {
      this.setState({ expandedItem: id });
      this.setState({ expanded: true });
    } else {
      this.setState({ expandedItem: id });
      this.setState({ expanded: !this.state.expanded });
    }
  };

  render() {
    const foundDrug = this.state.foundDrug ;
    const expanded = this.state.expanded;
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let drug = params.get('drug');
    let location = params.get('location');
    return (
      <div>
        <NavigationBar />
        <div className="main-page">
          <br />
          <h1>
            Search result for {drug} in{" "}
            {location}
          </h1>
          {(foundDrug !== "") ? (
            <div style={{width:'60vw', display: 'inline-block', marginTop:'30px'}}>
            <Card>
              <CardActionArea style={{ cursor: "default" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {foundDrug.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {foundDrug.details}
                  </Typography>
                  {
                    // <Typography variant="body1" component="p">
                    // Price: {foundDrug.price}
                    // </Typography>
                    // <Typography variant="body1" component="p">
                    //   Quantity on stock: {foundDrug.quantity}
                    // </Typography>
                  }
                </CardContent>
              </CardActionArea>
              <CardActions style={{ display: "block" }}>
                <Tooltip
                  title="View Prospectus"
                  aria-label="view-prospectus"
                  arrow
                  placement="top"
                >
                  <IconButton
                    id={foundDrug.id_drug}
                    onClick={this.handleExpandClick(foundDrug.id_drug)}
                    aria-expanded={expanded}
                    aria-label="show more"
                    className="expandButton"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
              <Collapse
                in={
                  foundDrug.id_drug === this.state.expandedItem
                    ? expanded
                    : null
                }
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography paragraph>Prospectus:</Typography>
                  <Typography paragraph>{foundDrug.prospectus}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </div>
          ) : (
            <h3> No drug found!</h3>
            )
          }
        </div>
      </div>
    );
  }
}
export default Search;
