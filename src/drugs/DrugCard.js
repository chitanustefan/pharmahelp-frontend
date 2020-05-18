import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { Button, Badge } from "react-bootstrap";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import data from "../config/data.json";
import { Redirect } from "react-router-dom";

const status = data[0]["status"];

class DrugCard extends Component {
  constructor() {
    super();
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleStatusChangeClick = this.handleStatusChangeClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.state = {
      expanded: false,
      expandedItem: "",
      errorPostReq: false,
      drug_id: "",
      drug_activeSubstance: "",
      drug_details: "",
      drug_name: "",
      drug_prospectus: "",
      drug_id2: "",
      drug_activeSubstance2: "",
      drug_details2: "",
      drug_name2: "",
      drug_prospectus2: "",
    };
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

  handleStatusChangeClick(id_drug, status, e) {
    let drug = {
      id: id_drug || "",
      status: status || "",
    };
    var regex = "^\\s*$";
    let idString = id_drug + "" || "";
    if (idString.match(regex) || drug.status.match(regex)) {
      this.setState({ error: true });
    } else {
      let url =
        "http://localhost:8080/drug/validate?id=" +
        drug.id +
        "&status=" +
        drug.status;
      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": `application/json`,
            },
          }
        )
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => this.setState({ errorPostReq: true }));
    }
  }
  handleEditButtonClick(
    drug_id,
    drug_activeSubstance,
    drug_details,
    drug_name,
    drug_prospectus
  ) {
    this.setState({ drug_id: drug_id });
    this.setState({ drug_activeSubstance: drug_activeSubstance });
    this.setState({ drug_details: drug_details });
    this.setState({ drug_name: drug_name });
    this.setState({ drug_prospectus: drug_prospectus });
  }
  handleDeleteButtonClick(
    drug_id,
    drug_activeSubstance,
    drug_details,
    drug_name,
    drug_prospectus
  ) {
    this.setState({ drug_id2: drug_id });
    this.setState({ drug_activeSubstance2: drug_activeSubstance });
    this.setState({ drug_details2: drug_details });
    this.setState({ drug_name2: drug_name });
    this.setState({ drug_prospectus2: drug_prospectus });
  }
  render() {
    const expanded = this.state.expanded;
    const errorPostReq = this.state.errorPostReq;
    if (
      this.state.drug_id2 !== "" &&
      this.state.drug_name2 !== "" &&
      this.state.drug_activeSubstance2 !== "" &&
      this.state.drug_prospectus2 !== "" &&
      this.state.drug_details2 !== ""
    ) {
      let drug = {
        id_drug: this.state.drug_id2,
        activeSubstance: this.state.drug_activeSubstance2,
        details: this.state.drug_details2,
        name: this.state.drug_name2,
        prospectus: this.state.drug_prospectus2,
      };

      axios
        .post("http://localhost:8080/drug/delete", drug, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          console.log("succes");
          window.location.reload(false);
        })
        .catch((err) => console.log("erroare"));
    }
    if (
      this.state.drug_id !== "" &&
      this.state.drug_name !== "" &&
      this.state.drug_activeSubstance !== "" &&
      this.state.drug_prospectus !== "" &&
      this.state.drug_details !== ""
    ) {
      return (
        <Redirect
          to={{
            pathname: "/pharma-help/editdrug/",
            state: {
              id_drug: this.state.drug_id,
              activeSubstance: this.state.drug_activeSubstance,
              details: this.state.drug_details,
              name: this.state.drug_name,
              prospectus: this.state.drug_prospectus,
            },
          }}
        />
      );
    }
    return (
      <div className="col-md-4 col-md-offset-2" style={{ marginTop: "2vh" }}>
        <Card>
          <CardActionArea
            style={{ cursor: "default", height: "28vh", overflow: "hidden" }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.drug.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {this.props.drug.details}
              </Typography>
              <Typography>
                <Badge variant="warning">
                  {this.props.drug.status.toUpperCase()}
                </Badge>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions style={{ display: "block" }}>
            {this.props.drug.status === status.pending ? (
              <Button
                variant="success"
                onClick={this.handleStatusChangeClick.bind(
                  this,
                  this.props.drug.id_drug,
                  status.approved
                )}
              >
                {" "}
                Approve{" "}
              </Button>
            ) : null}
            {this.props.drug.status === status.pending ? (
              <Button
                variant="danger"
                onClick={this.handleStatusChangeClick.bind(
                  this,
                  this.props.drug.id_drug,
                  status.rejected
                )}
              >
                {" "}
                Reject{" "}
              </Button>
            ) : null}
            {this.props.drug.status === status.approved ? (
              <Button
                variant="danger"
                onClick={this.handleStatusChangeClick.bind(
                  this,
                  this.props.drug.id_drug,
                  status.rejected
                )}
              >
                {" "}
                Reject{" "}
              </Button>
            ) : null}
            {this.props.drug.status === status.rejected ? (
              <Button
                variant="success"
                onClick={this.handleStatusChangeClick.bind(
                  this,
                  this.props.drug.id_drug,
                  status.approved
                )}
              >
                {" "}
                Approve{" "}
              </Button>
            ) : null}
            <Tooltip
              title="Show more"
              aria-label="show-more"
              arrow
              placement="top"
            >
              <IconButton
                id={this.props.drug.id_drug}
                onClick={this.handleExpandClick(this.props.drug.id_drug)}
                aria-expanded={expanded}
                aria-label="show more"
                className="expandButton"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Edit"
              onClick={this.handleEditButtonClick.bind(
                this,
                this.props.drug.id_drug,
                this.props.drug.activeSubstance,
                this.props.drug.details,
                this.props.drug.name,
                this.props.drug.prospectus
              )}
              arrow
              placement="top"
              style={{ width: "38px", height: "auto" }}
            >
              <Fab>
                <EditIcon color="action" />
              </Fab>
            </Tooltip>
            <Tooltip
              title="Delete"
              onClick={this.handleDeleteButtonClick.bind(
                this,
                this.props.drug.id_drug,
                this.props.drug.activeSubstance,
                this.props.drug.details,
                this.props.drug.name,
                this.props.drug.prospectus
              )}
              arrow
              placement="top"
              style={{ width: "38px", height: "auto" }}
            >
              <Fab>
                <DeleteIcon color="action" />
              </Fab>
            </Tooltip>
            <hr />
          </CardActions>
          {errorPostReq === true ? <h4>Something went wrong!</h4> : null}

          <Collapse
            in={
              this.props.drug.id_drug === this.state.expandedItem
                ? expanded
                : null
            }
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Typography paragraph>Prospectus:</Typography>
              <Typography paragraph>{this.props.drug.prospectus}</Typography>
              <Typography paragraph>Active Substance:</Typography>
              {this.props.drug.activeSubstance !== null ? (
                <Typography paragraph>
                  {this.props.drug.activeSubstance}
                </Typography>
              ) : (
                <Typography paragraph>none</Typography>
              )}
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default DrugCard;
