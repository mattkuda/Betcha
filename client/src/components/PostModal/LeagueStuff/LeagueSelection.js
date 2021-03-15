import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button , Loader} from "semantic-ui-react";
import './LeagueSelection.css';
import { AuthContext } from "../../../context/auth";
import PostCard from "../../PostCard/PostCard";
import PostModal from "../PostModal";
import { FETCH_POSTS_QUERY } from "../../../util/graphql";
import { FETCH_ACTIVE_LEAGUES_QUERY } from "../../../util/graphql";
import LeagueCard from "./LeagueCard";

function LeagueSelection(props) {
  //TODO: Get the leagues and their images via a Query instead of hardset data (as seen down below)
  // const { loading, data: { getLeagues: leagues } = {} } = useQuery(
  //   FETCH_LEAGUES_QUERY
  // );

  var loading2 = false;

  const { loading, data: { getActiveLeagues: leagues } = {} } = useQuery(
    FETCH_ACTIVE_LEAGUES_QUERY
  );

  // var leagues = [
  //   {
  //     id: 1,
  //     name: "NFL",
  //     image: "http://loodibee.com/wp-content/uploads/nfl-league-logo.png",
  //   },
  //   {
  //     id: 2,
  //     name: "NCAAF",
  //     image:"https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg",
  //   },
  //   {
  //     id: 3,
  //     name: "NCAAB",
  //     image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg",
  //   },
  // ];
  if (loading) {
    return (
      <div>
      <br/>
        <Loader active className='workaround' size='large' inline='centered' size='large'>Loading Games...</Loader>
        <p style={{textAlign: "center"}}>Loading leagues...</p>
      </div>
    )
  }

  return (
    <div style={{padding: "0px"}}>
      <Grid columns="two" style={{width: "100%",padding: "0px", margin: "0px"}}>
        <Grid.Row>
          {loading2 ? (
            <Loader>Loading leagues...</Loader>
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>

              {leagues &&
                leagues.map((league) => (
                  <Grid.Column key={league.id} style={{  marginTop: 20}}>
                    <LeagueCard  displayName={league.displayName} leagueName={league.leagueName} image={league.image} pickLeague = {props.chooseLeague}/>
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default LeagueSelection;
