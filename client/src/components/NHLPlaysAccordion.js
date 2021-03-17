import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { Accordion, Icon, Grid, Image, Button, Modal } from 'semantic-ui-react';
import { AuthContext } from "../context/auth";
import ReactionModal from "../components/ReactionModal/ReactionModal";


function NHLPlaysAccordion(props) {

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlay, setCurrentPlay] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const handleClick = (e, { index }) => activeIndex !== index ? (setActiveIndex(index)) : setActiveIndex(-1);

  const { user } = useContext(AuthContext);

  const myPlays = props.plays;
  const currentPeriod = myPlays[0].specificData.period;

  useEffect(() => {
    setActiveIndex( currentPeriod < 4 ? currentPeriod-1 : 3);
  }, []);

  return (

    <>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon dimmer='blurring' style={{height: '90%'}}>
        <Modal.Header>Play Reaction</Modal.Header>
        <Modal.Content image scrolling>
          <ReactionModal handleClose={(e) => setModalOpen(false)} play={currentPlay} />
        </Modal.Content>
      </Modal>
      <Accordion styled fluid>
        { currentPeriod >= 4 ? (
          <>
          <Accordion.Title
            active={activeIndex === 3}
            index={3}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            OT
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 3}>
            {myPlays.filter((play) => play.specificData.period === 4).map(play => (
              <Grid>
                <Grid.Row>
                <Grid.Column width={2} className="timeColumn">
                  <p style={{fontSize: '12px'}}>{play.specificData.time}</p>
                </Grid.Column>
                <Grid.Column width={1} className="timeColumn">
                  {play.scoreValue > 0 ? (
                    <p className="scoreVal" style={{fontSize: '14px'}}>+{play.scoreValue}</p>
                    ):(
                    <p></p>
                    )
                  }
                </Grid.Column>
                <Grid.Column width={2} className="mobile hidden">
                  {play.specificData.possession !== "" ? (
                    (parseInt(play.specificData.possession) === play.game.homeId ?
                      (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                      (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                    )
                  ):(<div></div>)}
                </Grid.Column>
                <Grid.Column width={2} className="mobile only">
                  {play.specificData.possession !== "" ? (
                    (parseInt(play.specificData.possession) === play.game.homeId ?
                      (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="play-image-mobile"/>):
                      (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="play-image-mobile"/>)
                    )
                  ):(<div></div>)}
                </Grid.Column>
                <Grid.Column width={5}>
                  <p style={{fontSize: '12px'}}>{play.description}</p>
                </Grid.Column>
                <Grid.Column width={3}>
                  <p style={{fontSize: '12px'}}>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
                </Grid.Column>
                <Grid.Column width={2}>
                  {user ? (<Icon style={{cursor: 'pointer'}} name='comment' onClick={() => {
                    setModalOpen(true);
                    setCurrentPlay(play);
                  }}></Icon>) : (
                    <Icon name='comment'></Icon>
                  )}
                </Grid.Column>
                </Grid.Row>
              </Grid>
            ))
          }
          </Accordion.Content>
          </>
          ):(<></>)
        }
        { currentPeriod >= 3 ? (
        <>
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          3rd Period
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          {myPlays.filter((play) => play.specificData.period === 3).map(play => (
            <Grid>
              <Grid.Row>
              <Grid.Column width={2} className="timeColumn">
                <p style={{fontSize: '12px'}}>{play.specificData.time}</p>
              </Grid.Column>
              <Grid.Column width={1} className="timeColumn">
                {play.scoreValue > 0 ? (
                  <p className="scoreVal" style={{fontSize: '14px'}}>+{play.scoreValue}</p>
                  ):(
                  <p></p>
                  )
                }
              </Grid.Column>
              <Grid.Column width={2} className="mobile hidden">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={2} className="mobile only">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="play-image-mobile"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="play-image-mobile"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={5}>
                <p style={{fontSize: '12px'}}>{play.description}</p>
              </Grid.Column>
              <Grid.Column width={3}>
                <p style={{fontSize: '12px'}}>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? (<Icon style={{cursor: 'pointer'}} name='comment' onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}></Icon>) : (
                  <Icon name='comment'></Icon>
                )}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
        </Accordion.Content>
        </>
        ):(<></>)
        }
        { currentPeriod >= 2 ? (
        <>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          2nd Period
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {myPlays.filter((play) => play.specificData.period === 2).map(play => (
            <Grid>
              <Grid.Row>
              <Grid.Column width={2} className="timeColumn">
                <p style={{fontSize: '12px'}}>{play.specificData.time}</p>
              </Grid.Column>
              <Grid.Column width={1} className="timeColumn">
                {play.scoreValue > 0 ? (
                  <p className="scoreVal" style={{fontSize: '14px'}}>+{play.scoreValue}</p>
                  ):(
                  <p></p>
                  )
                }
              </Grid.Column>
              <Grid.Column width={2} className="mobile hidden">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={2} className="mobile only">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="play-image-mobile"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="play-image-mobile"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={5}>
                <p style={{fontSize: '12px'}}>{play.description}</p>
              </Grid.Column>
              <Grid.Column width={3}>
                <p style={{fontSize: '12px'}}>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? (<Icon style={{cursor: 'pointer'}} name='comment' onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}></Icon>) : (
                  <Icon name='comment'></Icon>
                )}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
        </Accordion.Content>
        </>
        ):(<></>)
        }
        { currentPeriod >= 1 ? (
        <>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          1st Period
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {myPlays.filter((play) => play.specificData.period === 1).map(play => (
            <Grid>
              <Grid.Row>
              <Grid.Column width={2} className="timeColumn">
                <p style={{fontSize: '12px'}}>{play.specificData.time}</p>
              </Grid.Column>
              <Grid.Column width={1} className="timeColumn">
                {play.scoreValue > 0 ? (
                  <p className="scoreVal" style={{fontSize: '14px'}}>+{play.scoreValue}</p>
                  ):(
                  <p></p>
                  )
                }
              </Grid.Column>
              <Grid.Column width={2} className="mobile hidden">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="playImage"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="playImage"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={2} className="mobile only">
                {play.specificData.possession !== "" ? (
                  (parseInt(play.specificData.possession) === play.game.homeId ?
                    (<Image centered verticalAlign='middle' src={play.game.homeLogo} className="play-image-mobile"/>):
                    (<Image centered verticalAlign='middle' src={play.game.awayLogo} className="play-image-mobile"/>)
                  )
                ):(<div></div>)}
              </Grid.Column>
              <Grid.Column width={5}>
                <p style={{fontSize: '12px'}}>{play.description}</p>
              </Grid.Column>
              <Grid.Column width={3}>
                <p style={{fontSize: '12px'}}>{play.specificData.awayScore} - {play.specificData.homeScore}</p>
              </Grid.Column>
              <Grid.Column width={2}>
                {user ? (<Icon style={{cursor: 'pointer'}} name='comment' onClick={() => {
                  setModalOpen(true);
                  setCurrentPlay(play);
                }}></Icon>) : (
                  <Icon name='comment'></Icon>
                )}
              </Grid.Column>
              </Grid.Row>
            </Grid>
          ))
        }
        </Accordion.Content>
        </>
        ):(<></>)
        }
      </Accordion>

    </>
    )
}

export default NHLPlaysAccordion;
