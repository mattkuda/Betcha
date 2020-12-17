import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NFLGame from "../components/GameTypes/NFLGame";


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

function NFLGameDetails(props) {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  let myGameId = props.match.params.eventId;
  let myPeriod = 1;

  const { loading: periodOneLoading, error: periodOneError, data: periodOneData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodTwoLoading, error: periodTwoError, data: periodTwoData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodThreeLoading, error: periodThreeError, data: periodThreeData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodFourLoading, error: periodFourError, data: periodFourData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
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
    <Menu secondary>
      <Menu.Item
        name="home"
        content="Home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      />
      <Menu.Item
        name="nfl"
        content="NFL"
        active={activeItem === "nfl"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard/nfl"
      />
      <Menu.Item
        name="ncaaf"
        content="NCAAF"
        active={activeItem === "ncaaf"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard/ncaaf"
      />
      <Menu.Item
        name="ncaabmens"
        content="NCAAB (Mens)"
        active={activeItem === "ncaabmens"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard/ncaabmens"
      />
    </Menu>

    <h1>Plays In Game</h1>

    <h3>Q4</h3>
    <Fragment>
      {
        periodFourData.getPlaysInNFLGameInPeriod.map(play => (
          <p>{play.description}</p>
        ))
      }
    </Fragment>

    <h3>Q3</h3>
    <Fragment>
      {
        periodThreeData.getPlaysInNFLGameInPeriod.reverse().map(play => (
          <p>{play.description}</p>
        ))
      }
    </Fragment>

    <h3>Q2</h3>
    <Fragment>
      {
        periodTwoData.getPlaysInNFLGameInPeriod.map(play => (
          <p>{play.description}</p>
        ))
      }
    </Fragment>

    <h3>Q1</h3>
    <Fragment>
      {
        periodOneData.getPlaysInNFLGameInPeriod.map(play => (
          <p>{play.description}</p>
        ))
      }
    </Fragment>
    </div>
  )
}

const FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD = gql`
  query($myGameId: String!, $myPeriod: Int!) {
    getPlaysInNFLGameInPeriod(gameId: $myGameId, period: $myPeriod) {
      description
      specificData {
        homeScore
        awayScore
        time
        quarter
        down
        distance
        yardLine
      }
    }
  }
`;

export default NFLGameDetails;
