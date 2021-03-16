import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Menu, Icon, Label, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth";
import SearchBoxSemantic from "./SearchBoxSemantic";
import NotificationsIcon from "./NotificationsIcon";
import { FETCH_USERS_FOR_USER_SEARCH_QUERY } from "../../util/graphql";


function fillOptionsArray(users) {
  var options = [];
  for (var i = 0; i < users.length; i++) {
    options.push({
      title: users[i].name,
      description: users[i].username,
      image: users[i].profilePicture,
      as: Link,
      to: "/user/" + users[i].username,
    });
  }
  return options;
}

function MenuBarMobile() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  // e.g. /about
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const [search, setSearch] = useState('');

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const handleSearchChange = ( val ) => setSearch(val.target.value);

  const { loading, error, data: { getAllUsers: users } = {} } = useQuery(FETCH_USERS_FOR_USER_SEARCH_QUERY);

  let myOptions = [];
  if (users) {
    myOptions = fillOptionsArray(users);
  }

  const menuBar = user ? (
    <Menu pointing fluid secondary size="medium" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      >
        <Icon name='home' size='small' />
      </Menu.Item>
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      >
        <Icon name='calendar alternate outline' size='small' />
      </Menu.Item>
      <Menu.Item
        name="my bets"
        active={activeItem === "my bets"}
        onClick={handleItemClick}
        as={Link}
        to="/mybets"
      >My Bets</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={handleItemClick} as={Link} to={"/notifications"}>
          <NotificationsIcon user={user} />
        </Menu.Item>
        <Menu.Item
          active={activeItem === user.username}
          name={user.username}
          onClick={handleItemClick}
          as={Link}
          to={"/user/" + user.username}
        >
          <Icon name='user' size='small' />
        </Menu.Item>
        <Menu.Item
          name="logout"
          onClick={logout}
        >
          <Icon name='log out' size='small' />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="medium" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      >
        <Icon name='home' size='small' />
      </Menu.Item>
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      >
        <Icon name='calendar alternate outline' size='small' />
      </Menu.Item>
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

  return (
    <>
    <div>
    {menuBar}
    </div>

    <SearchBoxSemantic fluid options={myOptions}/>

    </>
  );
}

export default MenuBarMobile;
