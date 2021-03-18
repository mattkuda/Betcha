import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Menu, Icon, Label, Dropdown, Modal } from "semantic-ui-react";
import { Link } from "react-router-dom";
import PostModal from "../PostModal/PostModal";
import "./MenuBarMobile.css";

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
  const [search, setSearch] = useState("");

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const handleSearchChange = (val) => setSearch(val.target.value);

  const [modalOpen, setModalOpen] = useState(false);

  const { loading, error, data: { getAllUsers: users } = {} } = useQuery(
    FETCH_USERS_FOR_USER_SEARCH_QUERY
  );

  let myOptions = [];
  if (users) {
    myOptions = fillOptionsArray(users);
  }

  const menuBar = user ? (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon
        // dimmer="blurring" TODO
        style={{ height: "90%" }}
      >
        <Modal.Content
          long
          image
          scrolling
          style={{ padding: "1px", width: "100%", height: "210%" }}
        >
          <PostModal
            handleClose={(e) => setModalOpen(false)}
            style={{ height: "100%" }}
          />
        </Modal.Content>
      </Modal>

      <Menu pointing fluid secondary size="medium" color="teal">
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          <Icon name="home" size="large" style={{ margin: "0px 3px" }} />
        </Menu.Item>
        <Menu.Item
          name="scores"
          active={activeItem === "scores"}
          onClick={handleItemClick}
          as={Link}
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
          to="/scoreboard"
        >
          <Icon
            name="calendar  alternate outline"
            size="large"
            style={{ margin: "0px 3px" }}
          />
        </Menu.Item>
        <Menu.Item
          name="my bets"
          active={activeItem === "my bets"}
          onClick={handleItemClick}
          as={Link}
          to="/mybets"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          <Icon name="dollar sign" size="large" style={{ margin: "0px 3px" }} />
        </Menu.Item>

        <Menu.Menu
          position="center"
          style={{ padding: "0", marginLeft: "auto", marginRight: "auto" }}
        >
          {user ? (
            <Menu.Item
              onClick={(e) => setModalOpen(true)}
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
            >
              <Icon
                name="plus square"
                size="large"
                style={{ margin: "0px 3px" }}
              />
            </Menu.Item>
          ) : (
            <Menu.Item
              as={Link}
              to="/login"
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
            >
              <Icon
                name="plus square"
                size="large"
                style={{ margin: "0px 3px" }}
              />
            </Menu.Item>
          )}
        </Menu.Menu>

        <Menu.Menu
          position="right"
          style={{ marginLeft: "0" }}
          className="uniqueThing"
        >
          <Menu.Item
            onClick={handleItemClick}
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
          >
            <NotificationsIcon user={user} style={{ margin: "0px 3px" }} />
          </Menu.Item>
          <Menu.Item
            active={activeItem === user.username}
            name={user.username}
            onClick={handleItemClick}
            as={Link}
            to={"/user/" + user.username}
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
          >
            <Icon name="user" size="large" style={{ margin: "0px 3px" }} />
          </Menu.Item>
          <Menu.Item
            name="logout"
            onClick={logout}
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
          >
            <Icon name="log out" size="large" style={{ margin: "0px 3px" }} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  ) : (
    <Menu pointing secondary size="medium" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
        to="/"
      >
        <Icon name="home" size="large" style={{ margin: "0px 3px" }} />
      </Menu.Item>
      <Menu.Item
        name="scores"
        active={activeItem === "scores"}
        onClick={handleItemClick}
        as={Link}
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
        to="/scoreboard"
      >
        <Icon
          name="calendar alternate outline"
          size="large"
          style={{ margin: "0px 3px" }}
        />
      </Menu.Item>
      <Menu.Menu position="right" className="uniqueThing">
        <Menu.Item
          name="join"
          active={activeItem === "join"}
          onClick={handleItemClick}
          as={Link}
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
          to="/register"
        />
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  );

  return (
    <>
      <div>{menuBar}</div>

      <SearchBoxSemantic fluid options={myOptions} />
    </>
  );
}

export default MenuBarMobile;
