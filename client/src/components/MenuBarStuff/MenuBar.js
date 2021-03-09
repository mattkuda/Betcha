import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Menu, Icon, Label, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth";
import SearchBox from "./SearchBox";
import NotificationsIcon from "./NotificationsIcon";
import { FETCH_USERS_FOR_USER_SEARCH_QUERY } from "../../util/graphql";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  // e.g. /about
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const [search, setSearch] = useState('');

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const handleSearchChange = ( val ) => setSearch(val.target.value);

  const { loading, error, data: { getAllUsers: users } = {} } = useQuery(FETCH_USERS_FOR_USER_SEARCH_QUERY);


  function fillOptionsArray(users) {
    var options = [];
    for (var i = 1; i <= users.length; i++) {
      console.log(i);
      options.push({
        key: i,
        text: users[i-1].name,
        value: i
      });
    }
    return options;
  }

  let filteredNames = [];
  let options = [];
  if (users) {
    filteredNames = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    options = fillOptionsArray(filteredNames);
  }

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
        name="my bets"
        active={activeItem === "my bets"}
        onClick={handleItemClick}
        as={Link}
        to="/mybets"
      />
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        to="/scoreboard"
      />

      <Menu.Item style={{ margin: "0 0 3px 0", padding: "0 0 0 0" }}>
        <SearchBox placeholder="Search for a user..." handleChange={handleSearchChange} filtered={filteredNames}/>
        <Dropdown text='Search Results' options={options} simple item />
      </Menu.Item>

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
