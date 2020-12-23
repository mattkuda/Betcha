import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button } from 'semantic-ui-react';
//import { HashLink as Link } from 'react-router-hash-link';
import NFLGame from "../components/GameTypes/NFLGame";
import { AuthContext } from "../context/auth";
import ReactionModal from "./ReactionModal/ReactionModal";


/*

For alpha release, the Scoreboard home page should include:

 - a user's list of games (games that they are betting on)
 - a list of other top events
 - links to the pages for each specific league

Other possible additions:

 - list of games that friends are betting on
 - games with the most bets on them (most popular games to bet)


TODO:

 - Get a scoreboard working for all types of NFL Games

*/

function NFLGameDetails(props) {

  const pathname = window.location.pathname;
  // e.g. /NFL
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlay, setCurrentPlay] = useState(null);

  const { user } = useContext(AuthContext);

  let myGameId = props.match.params.eventId;
  let myPeriod = 1;

  const { loading: periodOneLoading, error: periodOneError, data: periodOneData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodTwoLoading, error: periodTwoError, data: periodTwoData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodThreeLoading, error: periodThreeError, data: periodThreeData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  myPeriod+=1;

  const { loading: periodFourLoading, error: periodFourError, data: periodFourData } = useQuery(FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD, {
    variables: { myGameId, myPeriod },
    pollInterval: 30000,
  });

  if (periodOneLoading) return 'Loading...';
  if (periodOneError) return `Error! ${periodOneError.message}`;

  if (periodTwoLoading) return 'Loading...';
  if (periodTwoError) return `Error! ${periodTwoError.message}`;

  if (periodThreeLoading) return 'Loading...';
  if (periodThreeError) return `Error! ${periodThreeError.message}`;

  if (periodFourLoading) return 'Loading...';
  if (periodFourError) return `Error! ${periodFourError.message}`;

  return (
    <div>

    <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
      <Modal.Header>Play Reaction</Modal.Header>
      <Modal.Content image scrolling>
        <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
      </Modal.Content>
    </Modal>

    <h1>Plays In Game</h1>

    <h3>Q4</h3>
    <Fragment>
      {
        periodFourData.getPlaysInNFLGameInPeriod.map(play => (
          <Grid celled>
            <Grid.Row>
            <Grid.Column width={14}>
              <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
            </Grid.Column>
            <Grid.Column width={2}>
              {user ? <Button onClick={() => {
                setModalOpen(true);
                setCurrentPlay(play);
              }}>React</Button>: <Button as={Link} to="/login">React</Button>}
            </Grid.Column>
            </Grid.Row>
          </Grid>
        ))
      }
    </Fragment>

    <h3>Q3</h3>
      <Fragment>
        {
          periodThreeData.getPlaysInNFLGameInPeriod.map(play => (
            <Grid celled>
              <Grid.Row>
              <Grid.Column width={14}>
                <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? <Button onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}>React</Button>: <Button as={Link} to="/login">React</Button>}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
      </Fragment>

    <h3>Q2</h3>
      <Fragment>
        {
          periodTwoData.getPlaysInNFLGameInPeriod.map(play => (
            <Grid celled>
              <Grid.Row>
              <Grid.Column width={14}>
                <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? <Button onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}>React</Button>: <Button as={Link} to="/login">React</Button>}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
      </Fragment>

    <h3>Q1</h3>
      <Fragment>
        {
          periodOneData.getPlaysInNFLGameInPeriod.map(play => (
            <Grid celled>
              <Grid.Row>
              <Grid.Column width={14}>
                <p>{play.specificData.time}: {play.description} ({play.specificData.awayScore} - {play.specificData.homeScore})</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? <Button onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}>React</Button>: <Button as={Link} to="/login">React</Button>}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
      </Fragment>
    </div>
  )
}

const FETCH_PLAYS_IN_NFL_GAME_IN_PERIOD = gql`
  query($myGameId: String!, $myPeriod: Int!) {
    getPlaysInNFLGameInPeriod(gameId: $myGameId, period: $myPeriod) {
      playId
      description
      specificData {
        homeScore
        awayScore
        time
        quarter
        down
        distance
        yardLine
      }
    }
  }
`;

export default NFLGameDetails;
