import React, { useState, useContext } from "react";
import { Menu, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth";
import SearchBar from "./SearchBar";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  // e.g. /about
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      />

      <Menu.Item style={{ margin: "0 0 3px 0", padding: "0 0 0 0" }}>
        <SearchBar />
      </Menu.Item>

      <Menu.Menu position="right">

      <Menu.Item >
        <Icon name="bell outline"/>
        <Label color='red' floating style={{padding: "2px 3px", top: "10px", left: "47px"}}>
        22
      </Label>
      </Menu.Item>

        <Menu.Item
          active={activeItem === user.username}
          name={user.username}
          onClick={handleItemClick}
          as={Link}
          to={"/user/" + user.username}
        />
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="join"
          active={activeItem === "join"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
