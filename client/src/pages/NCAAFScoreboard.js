import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NCAAFGame from "../components/GameTypes/NCAAFGame";


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

function NCAAFScoreboard() {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const { loading: pregameLoading, error: pregameError, data: pregameData } = useQuery(FETCH_NCAAF_PREGAMES, {
    pollInterval: 30000,
  });
  const { loading: livegameLoading, error: livegameError, data: livegameData } = useQuery(FETCH_NCAAF_LIVEGAMES, {
    pollInterval: 30000,
  });
  const { loading: postgameLoading, error: postgameError, data: postgameData } = useQuery(FETCH_NCAAF_POSTGAMES, {
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
        pregameData.getNCAAFPregames.map(game => (
          <NCAAFGame key={game.id} {...game} />
        ))
      }
    </Fragment>

    <h1>Live Games</h1>
    <Fragment>
      {
        livegameData.getNCAAFLivegames.map(game => (
          <NCAAFGame key={game.id} {...game} />
        ))
      }
    </Fragment>

    <h1>Completed Games</h1>
    <Fragment>
      {
        postgameData.getNCAAFPostgames.map(game => (
          <NCAAFGame key={game.id} {...game} />
        ))
      }
    </Fragment>
    </div>
  )
}

const FETCH_NCAAF_PREGAMES = gql`
{
    getNCAAFPregames {
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
        weatherDescription
        homeRank
        awayRank
      }
    }
}
`;

const FETCH_NCAAF_LIVEGAMES = gql`
{
   getNCAAFLivegames {
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
      down
      distance
      yardLine
      homeTimeouts
      awayTimeouts
      homeRank
      awayRank
    }
  }
}
`;

const FETCH_NCAAF_POSTGAMES = gql`
{
   getNCAAFPostgames {
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
  }
}
`;

export default NCAAFScoreboard;
