import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button, Image, Container } from 'semantic-ui-react';
import { AuthContext } from "../context/auth";
import { FETCH_NBA_GAME } from "../util/graphql";


function GameDetailsHeader(props) {

  let myGameId = props.gameId;

  const { loading: NBAGameLoading, error: NBAGameError, data: NBAGameData } = useQuery(FETCH_NBA_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
  });

  if (NBAGameLoading) return 'Loading...';
  if (NBAGameError) return `Error! ${NBAGameError.message}`;

  if (NBAGameData) {
    return (
      <div>
        <h1>Header</h1>
      </div>
    )


    // return (
    //   <div>
    //     <Container fluid>
    //     <Grid rows={3}>
    //       <Grid.Row>
    //         <Grid columns={3}>
    //           <Grid.Column>
    //             <Image centered verticalAlign='middle' src={NBAGameData.getGameByID.awayLogo} size='tiny'/>
    //           </Grid.Column>
    //           <Grid.Column>
    //             <p>{NBAGameData.getGameByID.awayScore} - {NBAGameData.getGameByID.homeScore}</p>
    //           </Grid.Column>
    //           <Grid.Column>
    //           <Image centered verticalAlign='middle' src={NBAGameData.getGameByID.homeLogo} size='tiny'/>
    //           </Grid.Column>
    //         </Grid>
    //       </Grid.Row>
    //       <Grid.Row>
    //         <Grid columns={3}>
    //           <Grid.Column>
    //           <p>{NBAGameData.getGameByID.awayAbbreviation}</p>
    //           </Grid.Column>
    //           <Grid.Column>
    //             <p>Final</p>
    //           </Grid.Column>
    //           <Grid.Column>
    //             <p>{NBAGameData.getGameByID.homeAbbreviation}</p>
    //           </Grid.Column>
    //         </Grid>
    //       </Grid.Row>
    //       <Grid.Row>
    //         <Grid columns={3}>
    //           <Grid.Column>
    //             <p>{NBAGameData.getGameByID.awayRecord}</p>
    //           </Grid.Column>
    //           <Grid.Column>
    //             <p>Cover: {NBAGameData.getGameByID.spreadWinner}</p>
    //             <p>OU Result: {NBAGameData.getGameByID.ouResult}</p>
    //           </Grid.Column>
    //           <Grid.Column>
    //             <p>{NBAGameData.getGameByID.homeRecord}</p>
    //           </Grid.Column>
    //         </Grid>
    //       </Grid.Row>
    //     </Grid>
    //     </Container>
    //   </div>
    // )
  }

}


export default GameDetailsHeader;
