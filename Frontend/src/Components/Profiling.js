import React, { Component } from "react";
import "../LoginStyle.scss";

export class Profiling extends Component {
  state = {};

  handleSubmit() {}
  render() {
    const name = this.props.name;
    return (
      <div className="background">
        <h1>Welcome {name}!</h1>
        <form className="form">
          <h2>Please select your savings account : </h2>
          <label htmlFor="ocbc 360">OCBC 360</label>
          <input
            name="savings"
            type="checkbox"
            id="ocbc 360"
            value="ocbc 360"
          ></input>
          <br />
          <label htmlFor="ocbc Frank">OCBC Frank</label>
          <input
            name="savings"
            type="checkbox"
            id="ocbc Frank"
            value="ocbc Frank"
          ></input>
          <br />
          <label htmlFor="stanChart">StanChart Bonu$aver</label>
          <input
            name="savings"
            type="checkbox"
            id="stanChart"
            value="stanChart"
          ></input>
          <br />
          <label htmlFor="dbs"></label>
          DBS Multiplier
          <input name="savings" type="checkbox" id="dbs" value="dbs"></input>
          <br />
          <label htmlFor="none">None</label>
          <input name="savings" type="checkbox" id="none" value="none"></input>
          <br />
          <h2>Please select your stocks : </h2>
          <label htmlFor="amazon">
            AMZN
            <input
              name="stocks"
              type="checkbox"
              id="amazon"
              value="amazon"
            ></input>
          </label>
          <label htmlFor="apple">
            AAPL
            <input
              name="stocks"
              type="checkbox"
              id="apple"
              value="apple"
            ></input>
          </label>
          <label htmlFor="microsoft">
            MSFT
            <input
              name="stocks"
              type="checkbox"
              id="microsoft"
              value="microsoft"
            ></input>
          </label>
          <label htmlFor="none">
            None
            <input name="stocks" type="checkbox" id="none" value="none"></input>
          </label>
          <br />
          <input
            type="submit"
            value="NEXT"
            name="submit"
            onClick={this.handleSubmit}
          ></input>
        </form>
      </div>
    );
  }
}
