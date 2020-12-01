import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import PostModal from "../components/PostModal";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { FETCH_GAMEPRES_QUERY } from "../util/graphql";
import LeagueCard from "./LeagueCard";

function LeagueSelection() {
  //TODO: Get the leagues and their images via a Query instead of hardset data (as seen down below)
  // const { loading, data: { getLeagues: leagues } = {} } = useQuery(
  //   FETCH_LEAGUES_QUERY
  // );

  var loading = false;

  var leagues = [
    {
      id: 1,
      name: "NFL",
      image: "http://loodibee.com/wp-content/uploads/nfl-league-logo.png",
    },
    {
      id: 2,
      name: "NCAAF",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg",
    },
    {
      id: 3,
      name: "NCAAM",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg",
    },
  ];

  return (
    <>
      <Grid columns="three">
        <Grid.Row>
          {loading ? (
            <h1>Loading leagues...</h1>
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>
              {leagues &&
                leagues.map((league) => (
                  <Grid.Column key={league.id} style={{ marginBottom: 20, marginTop: 20}}>
                    <LeagueCard league={league} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default LeagueSelection;
