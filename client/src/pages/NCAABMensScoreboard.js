import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NCAABMensGame from "../components/GameTypes/NCAABMensGame";


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

function NCAABMensScoreboard() {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const { loading: pregameLoading, error: pregameError, data: pregameData } = useQuery(FETCH_NCAABMENS_PREGAMES, {
    pollInterval: 30000,
  });
  const { loading: livegameLoading, error: livegameError, data: livegameData } = useQuery(FETCH_NCAABMENS_LIVEGAMES, {
    pollInterval: 30000,
  });
  const { loading: postgameLoading, error: postgameError, data: postgameData } = useQuery(FETCH_NCAABMENS_POSTGAMES, {
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

    <h1>Upcoming Games</h1>
    <Fragment>
      {
        pregameData.getNCAABMensPregames.map(game => (
          <NCAABMensGame key={game.id} {...game} />
        ))
      }
    </Fragment>

    <h1>Live Games</h1>
    <Fragment>
      {
        livegameData.getNCAABMensLivegames.map(game => (
          <NCAABMensGame key={game.id} {...game} />
        ))
      }
    </Fragment>

    <h1>Completed Games</h1>
    <Fragment>
      {
        postgameData.getNCAABMensPostgames.map(game => (
          <NCAABMensGame key={game.id} {...game} />
        ))
      }
    </Fragment>
    </div>
  )
}

const FETCH_NCAABMENS_PREGAMES = gql`
{
    getNCAABMensPregames {
      id
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
        homeRank
        awayRank
      }
    }
}
`;

const FETCH_NCAABMENS_LIVEGAMES = gql`
{
   getNCAABMensLivegames {
    id
    state
    stateDetails
    homeFullName
    homeScore
    awayFullName
    awayScore
    time
    period
    lastPlay
    specificData {
      homeRank
      awayRank
    }
  }
}
`;

const FETCH_NCAABMENS_POSTGAMES = gql`
{
   getNCAABMensPostgames {
    id
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
    specificData {
      homeRank
      awayRank
    }
  }
}
`;

export default NCAABMensScoreboard;
