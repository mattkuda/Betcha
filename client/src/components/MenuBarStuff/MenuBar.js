import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
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
        name={user.username}
        active={activeItem === user.username}
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
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;