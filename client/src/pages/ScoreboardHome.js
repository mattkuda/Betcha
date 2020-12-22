import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { Input, Menu } from 'semantic-ui-react';
import gql from "graphql-tag";
//import { HashLink as Link } from 'react-router-hash-link';
import NFLGame from "../components/GameTypes/NFLGame";
import { Grid } from "semantic-ui-react";
import { AuthContext } from "../context/auth";


function ScoreboardHome() {

  const { user } = useContext(AuthContext);
  let myUsername = user.username;
  //let myUsername = 'user';

  const { loading, error, data } = useQuery(FETCH_USER_GAMES, {
    variables: { myUsername },
    pollInterval: 30000,
  });

  if (loading) return 'Loading user games...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h1>My Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              data.getUserPosts.map(post => (
                <Grid.Column>
                  <Link to={`/scoreboard/${post.gameId.eventId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={post.gameId.eventId} {...post.gameId} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>
    </div>
  )
}

const FETCH_USER_GAMES = gql`
  query($myUsername: String!) {
    getUserPosts(username: $myUsername) {
      id
      gameId {
        id
        eventId
        state
        stateDetails
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
    }
  }
`;

export default ScoreboardHome;
