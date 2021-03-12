import React from "react";
import { Input, Menu, Stackable, Grid, Container, Image, Popup } from 'semantic-ui-react';
import './game.css';
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";
import { determineBetResult } from "../../util/Extensions/betCalculations";
import "./MyBetGame.css";

function Game(props) {

  let gameState = props.gameId.state;

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
                  <Container textAlign='center'>
                    {props.betType} {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      props.betAmount
                    )} {props.betOdds}
                  </Container>
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
                  <Container textAlign='center'>
                    {props.betType} {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      props.betAmount
                    )} {props.betOdds}
                  </Container>
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
                    <Container textAlign='center' className={determineBetResult(
                      props.gameId.homeScore,
                      props.gameId.awayScore,
                      props.betType,
                      props.betAmount,
                    )}>{props.betType} {props.betAmount === "0" ? (
                      "ML"
                    ) : (
                      props.betAmount
                    )} {props.betOdds}</Container>
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
