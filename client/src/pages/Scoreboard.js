import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Input, Menu } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';


/*

For alpha release, the Scoreboard home page should include:

 - a user's list of games (games that they are betting on)
 - a list of other top events
 - links to the pages for each specific league

Other possible additions:

 - list of games that friends are betting on
 - games with the most bets on them (most popular games to bet)


*/

function Scoreboard() {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  //
  // function handleNFLClick() {
  //   nflGameRef.current.scrollIntoView({behavior: 'smooth'})
  // }
  //
  // function handleNCAAFClick() {
  //   ncaafGameRef.current.scrollIntoView({behavior: 'smooth'})
  // }

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

      <h2>Top events will go here!</h2>

    </div>
  )
}

export default Scoreboard;
