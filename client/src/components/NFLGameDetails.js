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

  const { loading, error, data } = useQuery(FETCH_PLAYS_IN_NFL_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

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
    <Fragment>
      {
        data.getPlaysInNFLGame.map(play => (
          <p>{play.description}</p>
        ))
      }
    </Fragment>
    </div>
  )
}

const FETCH_PLAYS_IN_NFL_GAME = gql`
  query($myGameId: String!) {
    getPlaysInNFLGame(gameId: $myGameId) {
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
