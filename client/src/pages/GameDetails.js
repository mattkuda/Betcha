import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button, Image, Loader, List, Container, Header, Icon } from 'semantic-ui-react';
import { AuthContext } from "../context/auth";
import ReactionModal from "../components/ReactionModal/ReactionModal";
import GameDetailsHeader from "../components/GameDetailsHeader";
import { FETCH_PLAYS_IN_NFL_GAME, FETCH_PLAYS_IN_NCAAF_GAME,
         FETCH_PLAYS_IN_NCAABMENS_GAME, FETCH_PLAYS_IN_NBA_GAME,
         FETCH_PLAYS_IN_NHL_GAME, FETCH_PLAYS_IN_PREMIER_LEAGUE_GAME } from "../util/graphql";
import "./GameDetails.css";
import NBAPlaysAccordion from "../components/NBAPlaysAccordion";
import NCAABPlaysAccordion from "../components/NCAABPlaysAccordion";
import NHLPlaysAccordion from "../components/NHLPlaysAccordion";
import FriendLinker from "../components/FriendLinker";


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

  const { loading: NHLloading, error: NHLerror, data: NHLdata } = useQuery(FETCH_PLAYS_IN_NHL_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "nhl")
  });

  const { loading: PremierLeagueloading, error: PremierLeagueerror, data: PremierLeaguedata } = useQuery(FETCH_PLAYS_IN_PREMIER_LEAGUE_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
    skip: (myLeague !== "eng.1")
  });


  if (NFLloading || NCAAFloading || NCAABMENSloading ||
      NBAloading || NHLloading || PremierLeagueloading) return (
    <>
    <Loader active inline='centered' size='large'>Loading</Loader>
    </>
  )

  if (NFLerror || NCAAFerror || NCAABMENSerror ||
      NBAerror || NHLerror || PremierLeagueerror) return "Error occurred!";


  if (myLeague === "nfl") {
    return (

      <div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
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

      <GameDetailsHeader gameId={myGameId} league={myLeague} />


      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId}/>

      {NCAABMENSdata.getPlaysInGame.length > 0 ? (
        <>
        <h1>Play-By-Play</h1>
        <NCAABPlaysAccordion plays={NCAABMENSdata.getPlaysInGame} />
        </>
        ):(<></>)
      }

      </div>
    )

  }

  if (myLeague === "nba") {

    return (

      <div className = "page-wrapper">

      <GameDetailsHeader gameId={myGameId} league={myLeague} />

      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId} />

      {NBAdata.getPlaysInGame.length > 0 ? (
        <>
        <Header as='h2'>
          <Header.Content>Play-By-Play</Header.Content>
        </Header>
        <NBAPlaysAccordion plays={NBAdata.getPlaysInGame} />
        </>
      ):(<></>)
      }

      </div>
    )

  }

  if (myLeague === "nhl") {

    return (

      <div className = "page-wrapper">

      <GameDetailsHeader gameId={myGameId} league={myLeague} />

      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId}/>

      {NHLdata.getPlaysInGame.length > 0 ? (
        <>
        <h1>Play-By-Play</h1>
        <NHLPlaysAccordion plays={NHLdata.getPlaysInGame} />
        </>
      ):(<></>)
      }

      </div>
    )

  }

  //PREMIER LEAGUE
  if (myLeague === "eng.1") {

    return (

      <div>

      <GameDetailsHeader gameId={myGameId} league={myLeague} />

      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId}/>

      <h1>Play-By-Play</h1>

        <h3>Plays not yet available for Premier League!</h3>

      </div>
    )

  }

  //MLS
  if (myLeague === "usa.1") {

    return (

      <div>

      <GameDetailsHeader gameId={myGameId} league={myLeague} />

      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId}/>

      <h1>Play-By-Play</h1>

        <h3>Plays not yet available for MLS!</h3>

      </div>
    )

  }

  //UEFA CHAMPIONS LEAGUE
  if (myLeague === "uefa.champions") {

    return (

      <div>

      <GameDetailsHeader gameId={myGameId} league={myLeague} />

      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>User Bets</Header.Content>
      </Header>

      <FriendLinker gameId={myGameId}/>

      <h1>Play-By-Play</h1>

        <h3>Plays not yet available for UEFA Champions League!</h3>

      </div>
    )

  }

}

export default GameDetails;
