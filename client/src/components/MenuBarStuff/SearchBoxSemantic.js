import React, { Component, useState, useEffect } from "react";
import { Search } from "semantic-ui-react";
import _ from 'lodash';
import "./SearchBoxSemantic.css";

const initialState = { isLoading: false, results: [], value: '' }

export default class SearchBoxSemantic extends Component {

  state = initialState

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });

  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.description.concat(result.title))

      this.setState({
        isLoading: false,
        results: _.filter(this.props.options, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <>

      <div className="mobile hidden">
        <Search className="mobile hidden"
          size='mini'
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
        />
      </div>

      <div className="mobile only">
        <Search className="mobile-search"
          style={{width: "100%"}}
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
        />
      </div>
      </>
    )
  }
}
