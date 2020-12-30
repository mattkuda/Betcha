import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { Input, Menu } from 'semantic-ui-react';
import gql from "graphql-tag";
//import { HashLink as Link } from 'react-router-hash-link';
import Game from "../components/GameTypes/Game";
import { Grid } from "semantic-ui-react";
import { AuthContext } from "../context/auth";


function ScoreboardHome() {

  const { user } = useContext(AuthContext);
  let myUsername = "";
  if (user) {
    myUsername = user.username;
  }
  const { loading, error, data } = useQuery(FETCH_USER_GAMES, {
    variables: { myUsername },
    pollInterval: 30000,
    skip: !user
  });

  if (user) {

    if (loading) return 'Loading user games...';
    if (error) return `Error! ${error.message}`;

    return (
      <div>
        <h1>My Games</h1>
        <Grid columns="two">
          <Grid.Row>
            <Fragment>
              { user ? (
                data.getUserPosts.map(post => (
                  <Grid.Column>
                    <Link to={`/scoreboard/${post.gameId.league}/${post.gameId.gameId}`}>
                      <span className="card" style={{"display": "block"}}>
                        <Game key={post.gameId.gameId} {...post.gameId} />
                      </span>
                    </Link>
                  </Grid.Column>
                ))
              ) : (<div></div>)
              }
            </Fragment>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  else {
    return (
      <div>
        <h3>Log in to see your games</h3>
      </div>
    )
  }

}

const FETCH_USER_GAMES = gql`
  query($myUsername: String!) {
    getUserPosts(username: $myUsername) {
      id
      gameId {
        id
        gameId
        state
        stateDetails
        league
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
