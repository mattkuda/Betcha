import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';


function ScoreboardNav() {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);


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
  )
}

export default ScoreboardNav;
