import React, { useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { FETCH_TOP_LIVEGAME_EVENTS } from "../util/graphql";
import { Grid } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import Game from "./GameTypes/Game";

function LiveGamesSidebar() {
  const { user } = useContext(AuthContext);

  const { loading, error, data } = useQuery(
    FETCH_TOP_LIVEGAME_EVENTS
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (

    <div>
      <Grid columns="one">
        <Grid.Row>
          <Fragment>
          {
            data.getTopLivegameEvents.filter(event => event.game).map((event) => (
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

  );
}

export default LiveGamesSidebar;
