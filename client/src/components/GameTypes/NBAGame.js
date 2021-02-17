import React, { Component } from "react";
import { Input, Menu, Stackable, Grid, Container, Image, Icon } from 'semantic-ui-react';
import './game.css';
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";


/*

TODO:

 - Use the HTML / CSS code from old repo to create a "card" for a single NFL game

 - Copy over the HTML first, then re-work using semantic UI

 - Add small animations for changes in data

*/


class NBAGame extends Component {

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
                    <p>{betTimeFormat(this.props.startTime)}</p>
                  </Grid.Column>
                  <Grid.Column>
                  <Image centered verticalAlign='middle' src={this.props.homeLogo} size='tiny'/>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                  <p>{this.props.awayAbbreviation} ({this.props.awayRecord})</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.broadcasts}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeAbbreviation} ({this.props.homeRecord})</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={3}>
                  <Grid.Column>
                    <div>
                      {this.props.awayML > 0 ? (
                        <p>+{this.props.awayML}</p>
                      ): (
                        <p>{this.props.awayML}</p>
                        )
                      }
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.spread}</p>
                    <p>O/U: {this.props.overUnder}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <div>
                      {this.props.homeML > 0 ? (
                        <p>+{this.props.homeML}</p>
                      ): (
                        <p>{this.props.homeML}</p>
                        )
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

    if (this.gameState === 'in') {

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
                  <Grid columns={3}>
                    <Grid.Column>
                      <div></div>
                    </Grid.Column>
                    <Grid.Column>
                      <p>Q{this.props.period}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <div></div>
                    </Grid.Column>
                  </Grid>
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
                  <p>{this.props.awayScore}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.time}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <p>{this.props.homeAbbreviation}</p>
                    <p>{this.props.homeScore}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={1}>
                  <Grid.Column>
                    <p>{this.props.lastPlay}</p>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Container>

        </div>
      )

    }

    if (this.gameState === 'post') {

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
                    <p>Cover: {this.props.spreadWinner}</p>
                    <p>OU Result: {this.props.ouResult}</p>
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

  }
}

export default NBAGame;
