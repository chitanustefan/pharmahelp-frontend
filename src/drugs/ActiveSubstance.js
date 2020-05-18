import React, { Component } from "react";
import axios from 'axios';
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from "react-bootstrap";
import { PieChart } from 'react-minimal-pie-chart';

const colors = ['#FFEBCD','#7FFFD4','#DC143C', '#E9967A', '#00CED1', '#CD5C5C', '#FFF0F5', '#F08080', '#FFFACD', '#FFA07A']
class ActiveSubstance extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      drugs : [],
      activeSubstance: "",
      errorGetReq : false,
      totals: 0,
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({drugs:[]})
    if(this.state.activeSubstance !== ""){
        axios.get('https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/drug/get/sameActiveSubst?activeSubstance=' + this.state.activeSubstance, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(res => {
        let drugs = res.data;
        if(drugs != null){
            let totals = 0;
            let drugsAux = [];
            let i = 0;
            for (var key in drugs) {
                if (drugs.hasOwnProperty(key)) {
                    let item={
                        title: key,
                        value: drugs[key],
                        color: colors[i]
                    }
                    drugsAux = [...drugsAux, item];
                    if(i==colors.length){
                        i=0;
                    } else {
                        i++;
                    }
                }
            }
            drugsAux.forEach(drug => {
                this.setState(state => {const drugs = [...state.drugs, drug]; return {drugs}})
            });
            this.setState({activeSubstance: ""})
        }
    })
    .catch(err => this.setState({errorGetReq: true}));
    }
  };

  render() {
    const drugs = this.state.drugs;
    console.log(drugs)
    const errorGetReq = this.state.errorGetReq
    return (
      <div>
        <NavigationBar />
        <div className = "main-page">
        <br />
        <br />
        <div className="banner"style={{display:'flow-root', width: 'fit-content'}}>
            <img src={require("../public/images/activeSubstance.gif")} alt="pharma..." style={{width: '130px',marginLeft: '20px'}}/>
            <h3>View Active Substance Percentage</h3>
        </div>
        <br/>
        <div className="banner" style={{display: 'grid', width: 'max-content'}}>
            <form onSubmit={this.handleSubmit}>
            <div>
                <Tooltip title="" aria-label="select-price" arrow placement="top">
                  <input
                    className="form-item"
                    placeholder="Ex. 'Clor', 'Brom'"
                    name="activeSubstance"
                    type="text"
                    style={{height:"40px", fontSize:"20px"}}
                    value={this.state.activeSubstance}
                    onChange={(event) => {
                        let activeSubstance = this.state.activeSubstance;
                        activeSubstance = event.target.value;
                        this.setState({ activeSubstance: activeSubstance });
                        this.setState({ errorGetReq: false });
                      }}
                  />
                </Tooltip>
                <div className = "App">
                <Button
                variant="success"
                style={{width:'max-content'}}      
                type='submit'>
                View
                </Button>
                </div>
                {
                    (errorGetReq === true)? (
                        <h4 className="register-error">Oops! Something went wrong!</h4>
                    ):null
                }
            </div>
            </form>
            {(drugs.length > 0) ? (
                <div style={{marginTop:'40px'}}>
                <p>Hover one color to see drug name</p>
                <PieChart
                animationDuration={500}
                animationEasing="ease-out"
                center={[
                    50,
                    50
                ]}
                data={drugs}
                label={function noRefCheck(){}}
                labelPosition={60}
                labelStyle={function noRefCheck(){}}
                lengthAngle={360}
                lineWidth={20}
                paddingAngle={18}
                radius={50}
                rounded
                startAngle={0}
                viewBoxSize={[
                    100,
                    100
                ]}
                />
                </div>
            ) : null}
        </div>
      </div>
    </div>
    );
  }
}
export default ActiveSubstance;
