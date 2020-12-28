import React, { useState, useContext, useEffect } from "react";
import { Menu, Search } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$'),
// }))


const source = [{user: "Ben"}, {user: "Matt"}]

const initialState = {
  loading: false,
  results: [],
  value: '',
}

export default function SearchBar() {

  const { loading, data: { getUsers: users } = {} } = useQuery(
    FETCH_USERS_QUERY
  );

  const [input, setInput] = useState('');
  const [countryListDefault, setCountryListDefault] = useState();
  const [countryList, setCountryList] = useState();

  const fetchData = async () => {
    return await fetch('https://restcountries.eu/rest/v2/all')
      .then(response => response.json())
      .then(data => {
         setCountryList(data) 
         setCountryListDefault(data)
       });}

  const updateInput = async (input) => {
     const filtered = countryListDefault.filter(country => {
      return country.name.toLowerCase().includes(input.toLowerCase())
     })
     setInput(input);
     setCountryList(filtered);
  }

  useEffect( () => {fetchData()},[]);

  return (
    <div>
        <Search
          // loading={loading}
          // onResultSelect={(e, data) =>
          //   dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
          // }
          // onSearchChange={handleSearchChange}
          // results={results}
          // value={value}
        />
    </div>
  )
}

const FETCH_USERS_QUERY = gql`
  {
    getPosts {
      id
      body
      betType
      betAmount
      gameId {
        homeFullName
        awayFullName
        homeRecord
        awayRecord
        awayLogo
        homeLogo
        awayAbbreviation
        homeAbbreviation
        startTime
        broadcasts
        spread
        overUnder
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;