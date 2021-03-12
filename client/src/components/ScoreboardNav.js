import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { FETCH_ACTIVE_LEAGUES_QUERY } from "../util/graphql";

function ScoreboardNav() {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const { loading, data: { getActiveLeagues: leagues } = {} } = useQuery(
    FETCH_ACTIVE_LEAGUES_QUERY
  );

  function isLeagueInactive(leagueName) {
    if (leagues) {
      for (const league of leagues) {
        if (league.leagueName === leagueName) {
          return false;
        }
      }
    }
    return true;
  }


  return (

      <Menu tabular secondary color="teal">
        <Menu.Item
          name="home"
          content="Home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/scoreboard"
        />
        {isLeagueInactive("nfl") ? (<></>):
          (
          <Menu.Item
            name="nfl"
            content="NFL"
            active={activeItem === "nfl"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/nfl"
          />
          )
        }
        {isLeagueInactive("college-football") ? (<></>):
          (
          <Menu.Item
            name="ncaaf"
            content="NCAAF"
            active={activeItem === "ncaaf"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/college-football"
            disabled={isLeagueInactive("college-football")}
          />
          )
        }
        {isLeagueInactive("mens-college-basketball") ? (<></>):
          (
          <Menu.Item
            name="ncaabmens"
            content="NCAAB (Mens)"
            active={activeItem === "ncaabmens"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/mens-college-basketball"
          />
          )
        }
        {isLeagueInactive("nba") ? (<></>):
          (
          <Menu.Item
            name="nba"
            content="NBA"
            active={activeItem === "nba"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/nba"
          />
          )
        }
        {isLeagueInactive("nhl") ? (<></>):
          (
          <Menu.Item
            name="nhl"
            content="NHL"
            active={activeItem === "nhl"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/nhl"
          />
          )
        }
        {isLeagueInactive("eng.1") ? (<></>):
          (
          <Menu.Item
            name="eng.1"
            content="Premier League"
            active={activeItem === "eng.1"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/eng.1"
          />
          )
        }
        {isLeagueInactive("usa.1") ? (<></>):
          (
          <Menu.Item
            name="usa.1"
            content="MLS"
            active={activeItem === "usa.1"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/usa.1"
          />
          )
        }
        {isLeagueInactive("uefa.champions") ? (<></>):
          (
          <Menu.Item
            name="uefa.champions"
            content="UEFA Champions League"
            active={activeItem === "uefa.champions"}
            onClick={handleItemClick}
            as={Link}
            to="/scoreboard/uefa.champions"
          />
          )
        }
      </Menu>
  )
}

export default ScoreboardNav;
