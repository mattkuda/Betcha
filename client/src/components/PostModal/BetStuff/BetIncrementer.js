import React, { Component } from "react";
import "./BetIncrementer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

class BetIncrementer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: parseFloat(props.defValue).toFixed(1),
    };
    this.regularSpread = props.defValue;

    this.handleChange = this.handleChange.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }

  increment() {
    this.setState({
      count: (parseFloat(this.state.count) + 0.5).toFixed(1),
    });
     console.log("1: " + this.state.count);
    this.props.finalizeBet(parseFloat(this.state.count));
    console.log("2");
  }
  decrement() {
    this.setState({
      count: (parseFloat(this.state.count) - 0.5).toFixed(1),
    });
    console.log("1: " + this.state.count);
    this.props.finalizeBet(parseFloat(this.state.count));
    console.log("2");
  }
  reset() {
    this.setState({
      count: parseFloat(this.state.count).toFixed(1),
    });
     console.log("1: " + this.state.count);
    this.props.finalizeBet(parseFloat(this.state.count));
    console.log("2");
  }
  handleChange(event) {
    this.setState({ count: event.target.value });
     console.log("1: " + this.state.count);
    this.props.finalizeBet(parseFloat(this.state.count));
    console.log("2");
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
              type="number"
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
