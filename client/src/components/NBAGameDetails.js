import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NBAGame from "../components/GameTypes/NBAGame";


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

function NBAGameDetails(props) {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  let myGameId = props.match.params.eventId;
  let myPeriod = 1;

  const { loading: periodOneLoading, error: periodOneError, data: periodOneData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodTwoLoading, error: periodTwoError, data: periodTwoData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodThreeLoading, error: periodThreeError, data: periodThreeData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodFourLoading, error: periodFourError, data: periodFourData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  if (periodOneLoading) return 'Loading...';
  if (periodOneError) return `Error! ${periodOneError.message}`;

  if (periodTwoLoading) return 'Loading...';
  if (periodTwoError) return `Error! ${periodTwoError.message}`;

  if (periodThreeLoading) return 'Loading...';
  if (periodThreeError) return `Error! ${periodThreeError.message}`;

  if (periodFourLoading) return 'Loading...';
  if (periodFourError) return `Error! ${periodFourError.message}`;

  return (
    <div>

    <h1>Plays In Game</h1>

    <h3>4th Quarter</h3>
    <Fragment>
      {
        periodFourData.getPlaysInNBAGameInPeriod.map(play => (
          <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
        ))
      }
    </Fragment>

    <h3>3rd Quarter</h3>
    <Fragment>
      {
        periodThreeData.getPlaysInNBAGameInPeriod.map(play => (
          <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
        ))
      }
    </Fragment>

    <h3>2nd Quarter</h3>
    <Fragment>
      {
        periodTwoData.getPlaysInNBAGameInPeriod.map(play => (
          <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
        ))
      }
    </Fragment>

    <h3>1st Quarter</h3>
    <Fragment>
      {
        periodOneData.getPlaysInNBAGameInPeriod.map(play => (
          <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
        ))
      }
    </Fragment>
    </div>
  )
}

const FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD = gql`
  query($myGameId: String!, $myPeriod: Int!) {
    getPlaysInNBAGameInPeriod(gameId: $myGameId, period: $myPeriod) {
      description
      specificData {
        homeScore
        awayScore
        time
        quarter
        possession
      }
    }
  }
`;

export default NBAGameDetails;
