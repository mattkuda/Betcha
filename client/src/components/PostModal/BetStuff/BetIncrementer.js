import React, { Component } from "react";
import "./BetIncrementer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

class BetIncrementer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: parseInt(props.defValue.split(" ")[1].replace("+", "")),
    };
    this.regularSpread = parseInt(props.defValue.split(" ")[1].replace("+", ""));

    this.handleChange = this.handleChange.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }


  increment() {
    this.setState({
      count: this.state.count + 0.5,
    });
  }
  decrement() {
    this.setState({
      count: this.state.count - 0.5,
    });
  }
  reset() {
    this.setState({
      count: this.regularSpread,
    });
  }
  handleChange(event) {
    this.setState({ count: Number(event.target.value) });
  }

  render() {
    return (
      <div className="BI">
        <div className="jumbotron">
     
          <button onClick={this.decrement}>
            <i className="fas fa-minus"></i>
          </button>
          <form style={{ display: "inline-block" }}>
            <input
              className="jumbotron__window"
              style={{ display: "inline-block" }}
              value={this.state.count}
              onChange={this.handleChange}
            />
          </form>
          <div
            className="jumbotron__plus-minus"
            style={{ display: "inline-block" }}
          >
            <button onClick={this.increment}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <button className="jumbotron__delete" onClick={this.reset}>
            <i className="fas fa-undo"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default BetIncrementer;
