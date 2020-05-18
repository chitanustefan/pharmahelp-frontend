import React, { Component } from "react";
import axios from 'axios';
import "../App.css";
import NavigationBar from "../navbar/NavigationBar";
import DrugCard from './DrugCard';

class Drugs extends Component {
  constructor() {
    super();
    this.state = {
      drugs : [],
      errorGetReq : false,
      errorPostReq: false,
    }
  }

  componentDidMount() {
    axios.get('https://pharmahelpbackend-env.eba-ysu3wkyz.us-east-2.elasticbeanstalk.com/drug/getall', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(res => {
      let drugs = res.data;
      drugs.forEach(drug => {
          this.setState(state => {const drugs = [...state.drugs, drug]; return {drugs}})
      });
    })
    .catch(err => this.setState({errorGetReq: true}));
  };

  render() {
    const drugs = this.state.drugs;
    const errorGetReq = this.state.errorGetReq
    return (
      <div>
        <NavigationBar />
        <div className = "main-page">
          <br/>
          <h1>Drugs</h1>
          {(errorGetReq === true) ? (<h4>Could not get drugs from server!</h4>)
            :
            (
              (drugs.length === 0) ? (<h4>There is no drug in store!</h4>):
              (<div style={{margin:'4vw'}}>
                <div className="row" >         
                  {drugs.map((drug) =>
                    <DrugCard key={drug.id_drug} drug = {drug} />
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
export default Drugs;
