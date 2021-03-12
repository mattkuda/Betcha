import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Accordion, Icon, Grid, Image, Button, Link } from 'semantic-ui-react';


function NHLPlaysAccordion(props) {

  const [activeIndex, setActiveIndex] = useState(0);
  const handleClick = (e, { index }) => activeIndex !== index ? (setActiveIndex(index)) : setActiveIndex(-1);

  const myPlays = props.plays;
  const currentPeriod = myPlays[0].specificData.period;

  useEffect(() => {
    setActiveIndex( currentPeriod < 4 ? currentPeriod-1 : 3);
  }, []);

  return (
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
              </Grid.Row>
            </Grid>
          ))
        }
        </Accordion.Content>
        </>
        ):(<></>)
        }
      </Accordion>
    )
}

export default NHLPlaysAccordion;
