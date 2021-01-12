import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { Input, Menu } from "semantic-ui-react";
import gql from "graphql-tag";
//import { HashLink as Link } from 'react-router-hash-link';
import Game from "../components/GameTypes/Game";
import TopEvents from "../components/TopEvents";
import { Grid } from "semantic-ui-react";
import { AuthContext } from "../context/auth";


//If user has 2 or more bets on a game, won't display the game more than once.
function removeDuplicateGames(games) {
  let uniqueGames = [];
  let gameIDs = [];
  let gameID;
  for (const game of games) {
    gameID = game.gameId.gameId;
    //if ID is not yet in list of IDs, this is a unique game - push to array and add to list of gameIDs
    if (gameIDs.indexOf(gameID) === -1) {
      uniqueGames.push(game);
      gameIDs.push(gameID)
    }
  }
  return uniqueGames;
}


function ScoreboardHome() {
  const { user } = useContext(AuthContext);
  let myUsername = "";
  if (user) {
    myUsername = user.username;
  }
  const { loading, error, data } = useQuery(FETCH_USER_GAMES, {
    variables: { myUsername },
    pollInterval: 30000,
    skip: !user,
  });

  if (user) {
    if (loading) return "Loading user games...";
    if (error) return `Error! ${error.message}`;

    return (
      <div>
        <h1>My Games</h1>
        <Grid columns="two">
          <Grid.Row>
            <Fragment>
              {user ? (
                removeDuplicateGames(data.getUserPosts).map((post) => (
                  <Grid.Column>
                    <Link
                      to={`/scoreboard/${post.gameId.league}/${post.gameId.gameId}`}
                    >
                      <span className="card" style={{ display: "block" }}>
                        <Game key={post.gameId.gameId} {...post.gameId} />
                      </span>
                    </Link>
                  </Grid.Column>
                ))
              ) : (
                <div></div>
              )}
            </Fragment>
          </Grid.Row>
        </Grid>

        <TopEvents />

      </div>
    );
  } else {
    return (
      <div>
        <h3>Log in to see your games</h3>
      </div>
    );
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
        homeScore
        awayScore
        awayAbbreviation
        homeAbbreviation
        homeLines
        awayLines
        time
        period
        startTime
        broadcasts
        lastPlay
        spread
        overUnder
        spreadWinner
        ouResult
      }
    }
  }
`;

export default ScoreboardHome;
