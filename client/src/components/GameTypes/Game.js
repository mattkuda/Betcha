import React from "react";
import { Input, Menu, Stackable, Grid, Container, Image, Popup } from 'semantic-ui-react';
import './game.css';
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";

function Game(props) {

  let gameState = props.state;

  if (gameState === 'pre') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Popup content={props.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{betTimeFormat(props.startTime)}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <Popup content={props.awayFullName} position='bottom center' size='tiny' trigger={
                    <p>{props.awayAbbreviation} ({props.awayRecord})</p>
                  }/>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.broadcasts[0]}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.homeFullName} position='bottom center' size='tiny' trigger={
                        <p>{props.homeAbbreviation} ({props.homeRecord})</p>
                    }/>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <div>
                      {props.awayML !== 0 ? (

                        <>
                        {
                          props.awayML > 0 ? (
                            <p>+{props.awayML}</p>
                          ): (
                            <p>{props.awayML}</p>
                          )
                        }
                        </>
                    ) : (<></>)
                      }
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.spread > 0 ? (
                        <>
                        {
                          props.homeId === props.favoredTeamId ? (
                            <p>{props.homeAbbreviation} -{props.spread}</p>
                          ) : (
                            <p>{props.awayAbbreviation} -{props.spread}</p>
                          )
                        }
                        </>
                      ):(
                        <>
                        {
                          props.spread === 0 ? (
                            <p>PK</p>
                          ):(
                            <></>
                          )
                        }
                        </>
                      )}</p>
                      <div>
                        {props.overUnder !== -1 ? (
                          <p>O/U: {props.overUnder}</p>
                      ):(<></>)}
                      </div>
                  </Grid.Column>
                  <Grid.Column>
                    <div>
                      {props.homeML !== 0 ? (

                        <>
                        {
                          props.homeML > 0 ? (
                            <p>+{props.homeML}</p>
                          ): (
                            <p>{props.homeML}</p>
                          )
                        }
                        </>
                    ) : (<></>)
                      }
                    </div>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      )
  }

  if (gameState === 'in') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Popup content={props.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.period}</p>
                    <p>{props.time}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.awayAbbreviation}</p>
                  <p>{props.awayScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p></p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.homeAbbreviation}</p>
                    <p>{props.homeScore}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={1}>
                  <Grid.Column>
                    <p>{props.lastPlay}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>

        </div>
      )
  }

  if (gameState === 'post') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Popup content={props.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.awayScore} - {props.homeScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>Final</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.homeAbbreviation}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <p>{props.awayRecord}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>Cover: {props.spreadWinner}</p>
                    <p>OU Result: {props.ouResult}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.homeRecord}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>

        </div>

      )
  }
}

export default Game;
