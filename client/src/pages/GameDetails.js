import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button, Image } from 'semantic-ui-react';
import { AuthContext } from "../context/auth";
import ReactionModal from "../components/ReactionModal/ReactionModal";
import GameDetailsHeader from "../components/GameDetailsHeader";
import { FETCH_PLAYS_IN_NFL_GAME, FETCH_PLAYS_IN_NCAAF_GAME,
         FETCH_PLAYS_IN_NCAABMENS_GAME, FETCH_PLAYS_IN_NBA_GAME } from "../util/graphql";
import "./GameDetails.css";


function GameDetails(props) {

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlay, setCurrentPlay] = useState(null);

  const { user } = useContext(AuthContext);
  let myGameId = props.match.params.gameId;
  let myLeague = props.match.params.league;

  const { loading: NFLloading, error: NFLerror, data: NFLdata } = useQuery(FETCH_PLAYS_IN_NFL_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "nfl")
  });

  const { loading: NCAAFloading, error: NCAAFerror, data: NCAAFdata } = useQuery(FETCH_PLAYS_IN_NCAAF_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "college-football")
  });

  const { loading: NCAABMENSloading, error: NCAABMENSerror, data: NCAABMENSdata } = useQuery(FETCH_PLAYS_IN_NCAABMENS_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "mens-college-basketball")
  });

  const { loading: NBAloading, error: NBAerror, data: NBAdata } = useQuery(FETCH_PLAYS_IN_NBA_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "nba")
  });

  if (NFLloading) return 'Loading...';
  if (NFLerror) return `Error! ${NFLerror.message}`;

  if (NCAAFloading) return 'Loading...';
  if (NCAAFerror) return `Error! ${NCAAFerror.message}`;

  if (NCAABMENSloading) return 'Loading...';
  if (NCAABMENSerror) return `Error! ${NCAABMENSerror.message}`;

  if (NBAloading) return 'Loading...';
  if (NBAerror) return `Error! ${NBAerror.message}`;


  if (myLeague === "nfl") {
    return (

      <div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
        <Modal.Header>Play Reaction</Modal.Header>
        <Modal.Content image scrolling>
          <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
        </Modal.Content>
      </Modal>


      <h1>Plays In Game</h1>
      <Fragment>
        {
          NFLdata.getPlaysInGame.map(play => (
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

  if (myLeague === "college-football") {

    return (

      <div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
        <Modal.Header>Play Reaction</Modal.Header>
        <Modal.Content image scrolling>
          <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
        </Modal.Content>
      </Modal>


      <h1>Plays In Game</h1>
      <Fragment>
        {
          NCAAFdata.getPlaysInGame.map(play => (
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

  if (myLeague === "mens-college-basketball") {

    return (

      <div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
        <Modal.Header>Play Reaction</Modal.Header>
        <Modal.Content image scrolling>
          <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
        </Modal.Content>
      </Modal>


      <h1>Plays In Game</h1>
      <Fragment>
        {
          NCAABMENSdata.getPlaysInGame.map(play => (
            <Grid>
              <Grid.Row>
              <Grid.Column width={1} className="timeColumn">
                {play.specificData.time}
              </Grid.Column>
              <Grid.Column width={1} className="timeColumn">
                {play.scoreValue > 0 ? (
                  <p className="scoreVal">+{play.scoreValue}</p>
                  ):(
                  <p></p>
                  )
                }
              </Grid.Column>
              <Grid.Column width={2}>
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={6}>
                <p>{play.description}</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
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

  if (myLeague === "nba") {

    return (

      <div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
        <Modal.Header>Play Reaction</Modal.Header>
        <Modal.Content image scrolling>
          <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
        </Modal.Content>
      </Modal>


      <h1>Plays In Game</h1>
      <Fragment>
        {
          NBAdata.getPlaysInGame.map(play => (
            <Grid>
              <Grid.Row>
              <Grid.Column width={1} className="timeColumn">
                {play.specificData.time}
              </Grid.Column>
              <Grid.Column width={1} className="timeColumn">
                {play.scoreValue > 0 ? (
                  <p className="scoreVal">+{play.scoreValue}</p>
                  ):(
                  <p></p>
                  )
                }
              </Grid.Column>
              <Grid.Column width={2}>
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={6}>
                <p>{play.description}</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
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

}

export default GameDetails;
