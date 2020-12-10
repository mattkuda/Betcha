import React, { Component } from "react";
import { Input, Menu, Stackable, Grid, Container, Image } from 'semantic-ui-react';
import './game.css';


/*

TODO:

 - Use the HTML / CSS code from old repo to create a "card" for a single NFL game

 - Copy over the HTML first, then re-work using semantic UI

 - Add small animations for changes in data

*/


class NFLGame extends Component {

  gameState = this.props.state;

  render() {

    if (this.gameState === 'pre') {

      return (

        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={3}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Image centered verticalAlign='middle' src={this.props.awayLogo} size='tiny'/>
                  </Grid.Column>
                  <Grid.Column>
                    <p> @ </p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={this.props.homeLogo} size='tiny'/>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{this.props.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.broadcasts}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeAbbreviation}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <p>{this.props.awayRecord}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.spread}</p>
                    <p>O/U: {this.props.overUnder}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeRecord}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>

        </div>

      )

    }

    if (this.gameState === 'in') {

      return (
        <div>
        <p>{this.props.homeFullName}</p>
        <p>{this.props.homeAbbreviation}</p>
        <p>{this.props.homeScore}</p>
        <p>{this.props.awayFullName}</p>
        <p>{this.props.awayAbbreviation}</p>
        <p>{this.props.awayScore}</p>
        <p>Time: {this.props.time}</p>
        <p>Half: {this.props.period}</p>
        <p>Last Play: {this.props.lastPlay}</p>
        </div>
      )

    }

    if (this.gameState === 'post') {

      const gameLineLength = this.props.awayLines.length + 1;

      return (

        <div>
          <Container textAlign='center' className='scoreboard'>
            <Grid rows={5}>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <Image centered verticalAlign='middle' src={this.props.awayLogo} size='tiny'/>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.awayScore} - {this.props.homeScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={this.props.homeLogo} size='tiny'/>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{this.props.awayAbbreviation}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>Final</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeAbbreviation}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <p>{this.props.awayRecord}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>Betting results will go here!</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeRecord}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={gameLineLength}>
                  <Grid.Column>{this.props.awayAbbreviation}</Grid.Column>
                  {this.props.awayLines.map((q) => (
                    <Grid.Column>{q}</Grid.Column>
                  ))}
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={gameLineLength}>
                  <Grid.Column>{this.props.homeAbbreviation}</Grid.Column>
                  {this.props.homeLines.map((q) => (
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
}

export default NFLGame;
