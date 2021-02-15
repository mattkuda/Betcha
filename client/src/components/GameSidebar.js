import React, { useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { FETCH_TOP_PREGAME_EVENTS } from "../util/graphql";
import { Grid, Tab } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import Game from "./GameTypes/Game";
import UpcomingGamesSidebar from "./UpcomingGamesSidebar";
import LiveGamesSidebar from "./LiveGamesSidebar";

function GameSidebar() {
  const { user } = useContext(AuthContext);

  const { loading, error, data } = useQuery(
    FETCH_TOP_PREGAME_EVENTS
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const panes = [
    {
      menuItem: 'Upcoming',
      render: () => <Tab.Pane> <UpcomingGamesSidebar /> </Tab.Pane>
    },
    {
      menuItem: 'Live',
      render: () => <Tab.Pane> <LiveGamesSidebar /> </Tab.Pane>,
    },
  ];

  return (

    <div>
      <Tab panes={panes} />
    </div>

  );
}

export default GameSidebar;
