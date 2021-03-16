import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button, Image } from 'semantic-ui-react';
import { AuthContext } from "../../context/auth";
import ReactionModal from "../../components/ReactionModal/ReactionModal";
import GameDetailsHeader from "../../components/GameDetailsHeader";
import { FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD } from "../../util/graphql";
import "../GameDetails.css";


function NBADetails(props) {

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlay, setCurrentPlay] = useState(null);

  const { user } = useContext(AuthContext);
  let myGameId = props.match.params.gameId;

  const { loading: periodOneLoading, error: periodOneError, data: periodOneData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
    variables: { gameId: myGameId, currentPeriod: 1 },
    pollInterval: 30000,
  });

  // const { loading: periodTwoLoading, error: periodTwoError, data: periodTwoData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
  //   variables: { gameId: myGameId, period: 2 },
  //   pollInterval: 30000,
  // });

  // const { loading: periodThreeLoading, error: periodThreeError, data: periodThreeData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
  //   variables: { gameId: myGameId, period: 3 },
  //   pollInterval: 30000,
  // });

  // const { loading: periodFourLoading, error: periodFourError, data: periodFourData } = useQuery(FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD, {
  //   variables: { gameId: myGameId, period: 4 },
  //   pollInterval: 30000,
  // });

  if (periodOneLoading) return "Loading";
  //if (periodOneError) return `Error! ${periodOneError.message}`;
  // if (periodOneLoading || periodTwoLoading || periodThreeLoading || periodFourLoading) return 'Loading...';
  //if (periodOneError) return `Error! ${periodOneError.message}`;
  // if (periodTwoError) return `Error! ${periodTwoError.message}`;
  // if (periodThreeError) return `Error! ${periodThreeError.message}`;
  // if (periodFourError) return `Error! ${periodFourError.message}`;




  return (

    <div>

      // <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
      //   <Modal.Content image scrolling>
      //     <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
      //   </Modal.Content>
      // </Modal>


      //<h1>Plays In Game</h1>


      <h2>Q1</h2>

      <Fragment>
        { (periodOneData) ? (

            periodOneData.getPlaysInNBAGameInPeriod.map(play => (
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
        ):(
          <div></div>
        )
        }
      </Fragment>

    </div>
      //
      //
      // <h2>Q2</h2>
      //
      // <Fragment>
      //   {
      //     periodTwoData.getPlaysInGameInPeriod.map(play => (
      //       <Grid>
      //         <Grid.Row>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.specificData.time}
      //         </Grid.Column>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.scoreValue > 0 ? (
      //             <p className="scoreVal">+{play.scoreValue}</p>
      //             ):(
      //             <p></p>
      //             )
      //           }
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {play.specificData.possession !== "" ? (
      //             (parseInt(play.specificData.possession) === play.game.homeId ?
      //               (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
      //               (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
      //             )
      //           ):(<div></div>)}
      //         </Grid.Column>
      //         <Grid.Column width={6}>
      //           <p>{play.description}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           <p>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {user ? <Button onClick={() => {
      //             setModalOpen(true);
      //             setCurrentPlay(play);
      //           }}>React</Button>: <Button as={Link} to="/login">React</Button>}
      //         </Grid.Column>
      //         </Grid.Row>
      //       </Grid>
      //     ))
      //   }
      // </Fragment>
      //
      //
      //
      // <h2>Q3</h2>
      //
      // <Fragment>
      //   {
      //     periodThreeData.getPlaysInGameInPeriod.map(play => (
      //       <Grid>
      //         <Grid.Row>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.specificData.time}
      //         </Grid.Column>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.scoreValue > 0 ? (
      //             <p className="scoreVal">+{play.scoreValue}</p>
      //             ):(
      //             <p></p>
      //             )
      //           }
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {play.specificData.possession !== "" ? (
      //             (parseInt(play.specificData.possession) === play.game.homeId ?
      //               (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
      //               (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
      //             )
      //           ):(<div></div>)}
      //         </Grid.Column>
      //         <Grid.Column width={6}>
      //           <p>{play.description}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           <p>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {user ? <Button onClick={() => {
      //             setModalOpen(true);
      //             setCurrentPlay(play);
      //           }}>React</Button>: <Button as={Link} to="/login">React</Button>}
      //         </Grid.Column>
      //         </Grid.Row>
      //       </Grid>
      //     ))
      //   }
      // </Fragment>
      //
      //
      //
      // <h2>Q4</h2>
      //
      // <Fragment>
      //   {
      //     periodFourData.getPlaysInGameInPeriod.map(play => (
      //       <Grid>
      //         <Grid.Row>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.specificData.time}
      //         </Grid.Column>
      //         <Grid.Column width={1} className="timeColumn">
      //           {play.scoreValue > 0 ? (
      //             <p className="scoreVal">+{play.scoreValue}</p>
      //             ):(
      //             <p></p>
      //             )
      //           }
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {play.specificData.possession !== "" ? (
      //             (parseInt(play.specificData.possession) === play.game.homeId ?
      //               (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
      //               (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
      //             )
      //           ):(<div></div>)}
      //         </Grid.Column>
      //         <Grid.Column width={6}>
      //           <p>{play.description}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           <p>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
      //         </Grid.Column>
      //         <Grid.Column width={2}>
      //           {user ? <Button onClick={() => {
      //             setModalOpen(true);
      //             setCurrentPlay(play);
      //           }}>React</Button>: <Button as={Link} to="/login">React</Button>}
      //         </Grid.Column>
      //         </Grid.Row>
      //       </Grid>
      //     ))
      //   }
      // </Fragment>


      //</div>
    )

}

export default NBADetails;
