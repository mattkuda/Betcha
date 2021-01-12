import React, { useEffect, useReducer, useRef, useCallback } from "react";
import { Search } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_USERS_FOR_USER_SEARCH_QUERY } from "../../util/graphql";


//state - use with Semantic UI Search
const initialState = {
  loadingSearch: false,
  results: [],
  value: '',
}

function searchReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loadingSearch: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loadingSearch: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}



function SearchBar() {

  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { loadingSearch, results, value } = state;
  const timeoutRef = useRef();

  const {loading, error, data } = useQuery(FETCH_USERS_FOR_USER_SEARCH_QUERY, {
    //fetchPolicy: "network-only",
  });

  /*
  The title field is required for Semantic UI search results - this is how it knows what to
  display for each item in the dropdown list. Since the title field is not part of our
  original data array, we must loop through the array and create a new field for each user
  called "title". In our case, we can set this to the full name of the user, followed by the
  username in parentheses.
  */

  if (loading === false) {
    for (const user of data.getAllUsers) {
      user.title = user.name + " (@" + user.username + ")";
    }
  }

  let filteredUsers = [];

  //every time the search value changes, this function gets called so that
  //we can display a new list of matches
  const handleSearchChange = useCallback((e, searchData) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: 'START_SEARCH', query: searchData.value })

    timeoutRef.current = setTimeout(() => {
      if (searchData.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      if (loading === false) {
        filteredUsers = data.getAllUsers.filter(user => {
          return user.name.toLowerCase().includes(searchData.value.toLowerCase())
       })
      }
      else {
        console.log("loading val = "+loading);
        console.log("data = "+data);
      }

      dispatch({
        type: 'FINISH_SEARCH',
        results: filteredUsers,
      })
    }, 300)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleResultSelect = (e, searchData) => {
    dispatch({ type: 'UPDATE_SELECTION', selection: searchData.result.name });

  }


  return (
    <div>
      <Search
        size="mini"
        style={{margin: "0 0 0 0", padding: "0 0 0 0"}}
        loading={loadingSearch}
        onResultSelect={(e, searchData) =>
          dispatch({ type: 'UPDATE_SELECTION', selection: searchData.result.name })
        }
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
      />
    </div>
  )
}

export default SearchBar;
