import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Game from "../components/GameTypes/Game";
import { Grid } from "semantic-ui-react";

function TopEvents() {

  const { loading, error, data } = useQuery(FETCH_TOP_EVENTS, {
    pollInterval: 30000
  });

  if (loading) return "Loading top events...";
  if (error) return `Error! ${error.message}`;

  return (
    <div>

      <h1>Top Upcoming Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
          {
            data.getTopEvents.filter(event => event.game).map((event) => (
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
    </div>
  )
}


const FETCH_TOP_EVENTS = gql`
  {
    getTopEvents {
      id
      game {
        id
        gameId
        state
        stateDetails
        sport
        league
        homeFullName
        awayFullName
        homeRecord
        awayRecord
        awayLogo
        homeLogo
        awayAbbreviation
        homeAbbreviation
        startTime
        broadcasts
        spread
        overUnder
      }
      rank
    }
  }
`;

export default TopEvents;
