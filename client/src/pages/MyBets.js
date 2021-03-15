import React, { useContext, useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import MyBetGame from "../components/GameTypes/MyBetGame";
import { Grid } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
//import { FETCH_ACTIVE_LEAGUES_QUERY } from "../util/graphql";


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


function MyBets() {
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
        <h1>My Bets</h1>
        <Grid columns="two">
          <Grid.Row>
            <Fragment>
              {user ? (
                data.getUserPosts.filter((post) => post.gameArray).map((post) => (
                  <Grid.Column>
                    {
                      removeDuplicateGames(post.gameArray).map((game) => (
                        <Link
                          to={`/scoreboard/${game.gameId.league}/${game.gameId.gameId}`}
                        >
                          <span className="card" style={{ display: "block" }}>
                            <MyBetGame key={game.gameId.gameId} {...game} />
                          </span>
                        </Link>
                      ))
                    }
                  </Grid.Column>
                ))
              ) : (
                <div></div>
              )}
            </Fragment>
          </Grid.Row>
        </Grid>

      </div>
    )
  }
}

const FETCH_USER_GAMES = gql`
  query($myUsername: String!) {
    getUserPosts(username: $myUsername) {
      id
      gameArray {
        betType
        betAmount
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
  }
`;


export default MyBets;
