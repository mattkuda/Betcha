import React from "react";
import { Input, Menu, Stackable, Grid, Container, Image } from 'semantic-ui-react';
import './game.css';

function Game(props) {

  let gameState = props.state;
  let localStartTime = new Date(Date.parse(props.startTime));

  if (gameState === 'pre') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                  </Grid.Column>
                  <Grid.Column>
                    {!props.specificData ? (<div></div>) : (
                      <p>{props.specificData.weatherDescription}</p>
                    )}
                    <p>{localStartTime.toString()}</p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.broadcasts}</p>
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
                    <p>{props.spread}</p>
                    <p>{props.overUnder}</p>
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

  if (gameState === 'in') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.period}</p>
                    <p>{props.time}</p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
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
                    <p>{props.specificData.down} and {props.specificData.distance} at the {props.specificData.yardLine}</p>
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

      const gameLineLength = props.awayLines.length + 1;

      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={5}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Image centered verticalAlign='middle' src={props.awayLogo} size='tiny'/>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.awayScore} - {props.homeScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={props.homeLogo} size='tiny'/>
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
              <Grid.Row>
                <Grid columns={gameLineLength}>
                  <Grid.Column>{props.awayAbbreviation}</Grid.Column>
                  {props.awayLines.map((q) => (
                    <Grid.Column>{q}</Grid.Column>
                  ))}
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={gameLineLength}>
                  <Grid.Column>{props.homeAbbreviation}</Grid.Column>
                  {props.homeLines.map((q) => (
                    <Grid.Column>{q}</Grid.Column>
                  ))}
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>

        </div>

      )
  }
}

export default Game;
