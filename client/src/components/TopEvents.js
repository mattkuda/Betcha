import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Game from "../components/GameTypes/Game";
import { Grid, Loader, Header, Segment } from "semantic-ui-react";
import { FETCH_TOP_PREGAME_EVENTS, FETCH_TOP_LIVEGAME_EVENTS } from "../util/graphql";

function TopEvents() {

  const { loading: liveGameLoading, error: liveGameError, data: liveGameData } = useQuery(FETCH_TOP_LIVEGAME_EVENTS, {
    pollInterval: 30000
  });

  const { loading: preGameLoading, error: preGameError, data: preGameData } = useQuery(FETCH_TOP_PREGAME_EVENTS, {
    pollInterval: 30000
  });

  if (liveGameLoading || preGameLoading) return (
    <>
    <Loader active inline='centered' size='large'>Loading</Loader>
    </>
  )
  if (liveGameError || preGameError) return `Error occured!`;

  const currentDate = new Date();

  return (
    <div style = {{
        marginTop: '40px',
      }}>

      {liveGameData.getTopLivegameEvents.length > 0 ? (
        <>
        <Header as='h3'>
          <Header.Content>Live Games</Header.Content>
        </Header>

        <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
              {
                liveGameData.getTopLivegameEvents.filter(event => event.game).map((event) => (
                    <Grid.Column>
                      <Link
                        to={`/scoreboard/${event.game.league}/${event.game.gameId}`}
                      >
                        <span className="card" style={{ display: "block" }}>
                          <Game key={event.game.gameId} {...event.game} />
                        </span>
                      </Link>
                    </Grid.Column>
                  ))
                }
              </Fragment>
            </Grid.Row>
          </Grid>
        </Segment>
        </>
      ) : (<></>)}


      {preGameData.getTopPregameEvents.filter(event => event.game).length > 0 ? (
        <>
        <Header as='h3'>
          <Header.Content>Upcoming Games</Header.Content>
        </Header>

        <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
              {
                preGameData.getTopPregameEvents.filter(event => event.game)
                .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                .map((event) => (
                    <Grid.Column>
                      <Link
                        to={`/scoreboard/${event.game.league}/${event.game.gameId}`}
                      >
                        <span className="card" style={{ display: "block" }}>
                          <Game key={event.game.gameId} {...event.game} />
                        </span>
                      </Link>
                    </Grid.Column>
                  ))
                }
              </Fragment>
            </Grid.Row>
          </Grid>
        </Segment>
        </>
      ) : (<></>)}
    </div>
  )
}

export default TopEvents;
