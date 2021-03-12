import React from "react";
import { Input, Menu, Stackable, Grid, Container, Image, Popup } from 'semantic-ui-react';
import './game.css';
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";
import { determineBetResult } from "../../util/Extensions/betCalculations";

function Game(props) {

  let gameState = props.gameId.state;

  let myBetResult = "";
  if (props.gameId.homeScore > 0 || props.gameId.awayScore > 0) {
    myBetResult = determineBetResult(
    props.gameId.homeScore,
    props.gameId.awayScore,
    props.betType,
    props.betAmount,
    );
  }

  const myBetAmountString = () => {
    if (props.betAmount.substring(0,1) === "-") {
      return props.betAmount;
    }
    return "+" + props.betAmount;
  }

  if (gameState === 'pre') {
      return (
        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Popup content={props.gameId.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{betTimeFormat(props.gameId.startTime)}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.gameId.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.gameId.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <div textAlign='center' style = {{
                      height: '50px',
                      width: '50px',
                      margin: 'auto',
                      borderRadius: '5px',
                      backgroundColor: '#4BB543',
                      color: 'white',
                      textAlign: 'auto',
                      }}>
                      {props.betType === "AWAY" ?
                        (props.gameId.awayAbbreviation) : (
                        props.gameId.homeAbbreviation
                      )}
                      <br></br>
                      {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      myBetAmountString()
                    )} {props.betOdds}</div>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.homeAbbreviation}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <p>{props.gameId.awayRecord}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.spread}</p>
                    <p>{props.gameId.overUnder}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.homeRecord}</p>
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
                    <Popup content={props.gameId.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.period}</p>
                    <p>{props.gameId.time}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.gameId.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.gameId.awayAbbreviation}</p>
                  <p>{props.gameId.awayScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <div textAlign='center' style = {{
                      height: '50px',
                      width: '50px',
                      margin: 'auto',
                      borderRadius: '5px',
                      backgroundColor: myBetResult === "win" ? (
                        '#4BB543'
                      ):(
                        myBetResult === "loss" ? (
                          '#ff3d3d'
                        ):(
                          '#ffae42'
                        )
                      ),
                      color: 'white',
                      textAlign: 'auto',
                      }}>
                      {props.betType} {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      props.betAmount
                    )} {props.betOdds}</div>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.homeAbbreviation}</p>
                    <p>{props.gameId.homeScore}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={1}>
                  <Grid.Column>
                    <p>{props.gameId.lastPlay}</p>
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
                    <Popup content={props.gameId.awayFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.awayLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.awayScore} - {props.gameId.homeScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <Popup content={props.gameId.homeFullName} position='bottom center' size='tiny' trigger={
                      <Image centered verticalAlign='middle' src={props.gameId.homeLogo} size='tiny'/>
                    } />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{props.gameId.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <div textAlign='center' style = {{
                      height: '50px',
                      width: '50px',
                      margin: 'auto',
                      borderRadius: '5px',
                      backgroundColor: myBetResult === "win" ? (
                        '#4BB543'
                      ):(
                        myBetResult === "loss" ? (
                          '#ff3d3d'
                        ):(
                          '#ffae42'
                        )
                      ),
                      color: 'white',
                      textAlign: 'auto',
                      }}>
                      {props.betType} {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      props.betAmount
                    )} {props.betOdds}</div>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.homeAbbreviation}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <p>{props.gameId.awayRecord}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>Cover: {props.gameId.spreadWinner}</p>
                    <p>OU Result: {props.gameId.ouResult}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{props.gameId.homeRecord}</p>
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
