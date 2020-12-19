import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NFLGame from "../components/GameTypes/NFLGame";
import { Grid } from "semantic-ui-react";
import './scoreboard.css';


/*

For alpha release, the Scoreboard home page should include:

 - a user's list of games (games that they are betting on)
 - a list of other top events
 - links to the pages for each specific league

Other possible additions:

 - list of games that friends are betting on
 - games with the most bets on them (most popular games to bet)


TODO:

 - Get a scoreboard working for all types of NFL Games

*/


/*

Adding comment here (NFL).

*/

function NFLScoreboard() {

  const { loading: pregameLoading, error: pregameError, data: pregameData } = useQuery(FETCH_NFL_PREGAMES, {
    pollInterval: 30000,
  });
  const { loading: livegameLoading, error: livegameError, data: livegameData } = useQuery(FETCH_NFL_LIVEGAMES, {
    pollInterval: 30000,
  });
  const { loading: postgameLoading, error: postgameError, data: postgameData } = useQuery(FETCH_NFL_POSTGAMES, {
    pollInterval: 30000,
  });

  if (pregameLoading) return 'Loading pregames...';
  if (pregameError) return `Error! ${pregameError.message}`;

  if (livegameLoading) return 'Loading livegames...';
  if (livegameError) return `Error! ${livegameError.message}`;

  if (postgameLoading) return 'Loading postgames...';
  if (postgameError) return `Error! ${postgameError.message}`;

  return (
    <div>

    <h1>Upcoming Games</h1>
    <Grid columns="two">
      <Grid.Row>
        <Fragment>
          {
            pregameData.getNFLPregames.map(game => (
              <Grid.Column>
                <Link to={`/scoreboard/nfl/${game.eventId}`}>
                  <span className="card" style={{"display": "block"}}>
                    <NFLGame key={game.eventId} {...game} />
                  </span>
                </Link>
              </Grid.Column>
            ))
          }
        </Fragment>
      </Grid.Row>
    </Grid>


    <h1>Live Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              livegameData.getNFLLivegames.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/nfl/${game.eventId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={game.eventId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>

    <h1>Completed Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              postgameData.getNFLPostgames.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/nfl/${game.eventId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={game.eventId} {...game} />
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

const FETCH_NFL_PREGAMES = gql`
{
    getNFLPregames {
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
      specificData {
        weatherDescription
      }
    }
}
`;

const FETCH_NFL_LIVEGAMES = gql`
{
   getNFLLivegames {
    id
    eventId
    state
    stateDetails
    homeFullName
    homeScore
    homeLogo
    homeAbbreviation
    awayFullName
    awayScore
    awayLogo
    awayAbbreviation
    time
    period
    lastPlay
    specificData {
      down
      distance
      yardLine
      homeTimeouts
      awayTimeouts
    }
  }
}
`;

const FETCH_NFL_POSTGAMES = gql`
{
   getNFLPostgames {
    id
    eventId
    state
    stateDetails
    homeFullName
    homeAbbreviation
    homeScore
    homeLines
    homeLogo
    awayFullName
    awayAbbreviation
    awayScore
    awayLines
    awayLogo
    spreadWinner
    ouResult
  }
}
`;

export default NFLScoreboard;
