import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import NFLGame from "../components/GameTypes/NFLGame";
import NCAAFGame from "../components/GameTypes/NCAAFGame";
import NCAABMensGame from "../components/GameTypes/NCAABMensGame";
import NBAGame from "../components/GameTypes/NBAGame";
import { Grid } from "semantic-ui-react";
import { FETCH_NFL_PREGAMES, FETCH_NFL_LIVEGAMES, FETCH_NFL_POSTGAMES,
         FETCH_NCAAF_PREGAMES, FETCH_NCAAF_LIVEGAMES, FETCH_NCAAF_POSTGAMES,
         FETCH_NCAABMENS_PREGAMES, FETCH_NCAABMENS_LIVEGAMES, FETCH_NCAABMENS_POSTGAMES,
         FETCH_NBA_PREGAMES, FETCH_NBA_LIVEGAMES, FETCH_NBA_POSTGAMES } from "../util/graphql";
import './scoreboard.css';



function LeagueScoreboard(props) {

  let myLeague = props.league;


  const { loading: NFLpregameLoading, error: NFLpregameError, data: NFLpregameData } = useQuery(FETCH_NFL_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nfl")
  });
  const { loading: NFLlivegameLoading, error: NFLlivegameError, data: NFLlivegameData } = useQuery(FETCH_NFL_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nfl")
  });
  const { loading: NFLpostgameLoading, error: NFLpostgameError, data: NFLpostgameData } = useQuery(FETCH_NFL_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nfl")
  });



  const { loading: NCAAFpregameLoading, error: NCAAFpregameError, data: NCAAFpregameData } = useQuery(FETCH_NCAAF_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "college-football")
  });
  const { loading: NCAAFlivegameLoading, error: NCAAFlivegameError, data: NCAAFlivegameData } = useQuery(FETCH_NCAAF_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "college-football")
  });
  const { loading: NCAAFpostgameLoading, error: NCAAFpostgameError, data: NCAAFpostgameData } = useQuery(FETCH_NCAAF_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "college-football")
  });




  const { loading: NCAABMENSpregameLoading, error: NCAABMENSpregameError, data: NCAABMENSpregameData } = useQuery(FETCH_NCAABMENS_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "mens-college-basketball")
  });
  const { loading: NCAABMENSlivegameLoading, error: NCAABMENSlivegameError, data: NCAABMENSlivegameData } = useQuery(FETCH_NCAABMENS_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "mens-college-basketball")
  });
  const { loading: NCAABMENSpostgameLoading, error: NCAABMENSpostgameError, data: NCAABMENSpostgameData } = useQuery(FETCH_NCAABMENS_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "mens-college-basketball")
  });




  const { loading: NBApregameLoading, error: NBApregameError, data: NBApregameData } = useQuery(FETCH_NBA_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nba")
  });
  const { loading: NBAlivegameLoading, error: NBAlivegameError, data: NBAlivegameData } = useQuery(FETCH_NBA_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nba")
  });
  const { loading: NBApostgameLoading, error: NBApostgameError, data: NBApostgameData } = useQuery(FETCH_NBA_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nba")
  });




  if (NFLpregameLoading) return 'Loading pregames...';
  if (NFLpregameError) return `Error! ${NFLpregameError.message}`;

  if (NFLlivegameLoading) return 'Loading livegames...';
  if (NFLlivegameError) return `Error! ${NFLlivegameError.message}`;

  if (NFLpostgameLoading) return 'Loading postgames...';
  if (NFLpostgameError) return `Error! ${NFLpostgameError.message}`;

  if (NCAAFpregameLoading) return 'Loading pregames...';
  if (NCAAFpregameError) return `Error! ${NCAAFpregameError.message}`;

  if (NCAAFlivegameLoading) return 'Loading livegames...';
  if (NCAAFlivegameError) return `Error! ${NCAAFlivegameError.message}`;

  if (NCAAFpostgameLoading) return 'Loading postgames...';
  if (NCAAFpostgameError) return `Error! ${NCAAFpostgameError.message}`;

  if (NCAABMENSpregameLoading) return 'Loading pregames...';
  if (NCAABMENSpregameError) return `Error! ${NCAABMENSpregameError.message}`;

  if (NCAABMENSlivegameLoading) return 'Loading livegames...';
  if (NCAABMENSlivegameError) return `Error! ${NCAABMENSlivegameError.message}`;

  if (NCAABMENSpostgameLoading) return 'Loading postgames...';
  if (NCAABMENSpostgameError) return `Error! ${NCAABMENSpostgameError.message}`;

  if (NBApregameLoading) return 'Loading pregames...';
  if (NBApregameError) return `Error! ${NBApregameError.message}`;

  if (NBAlivegameLoading) return 'Loading livegames...';
  if (NBAlivegameError) return `Error! ${NBAlivegameError.message}`;

  if (NBApostgameLoading) return 'Loading postgames...';
  if (NBApostgameError) return `Error! ${NBApostgameError.message}`;


  //NFL
  if (myLeague === "nfl") {
    return (
      <div>

      <h1>Upcoming Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NFLpregameData.getPregamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>


      <h1>Live Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NFLlivegameData.getLivegamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>

      <h1>Completed Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NFLpostgameData.getPostgamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NFLGame key={game.gameId} {...game} />
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

  //NCAAF
  if (myLeague === "college-football") {
    return (
      <div>

      <h1>Upcoming Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAAFpregameData.getPregamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAAFGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>


      <h1>Live Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAAFlivegameData.getLivegamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAAFGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>

      <h1>Completed Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAAFpostgameData.getPostgamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAAFGame key={game.gameId} {...game} />
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

  //NFL
  if (myLeague === "mens-college-basketball") {
    return (
      <div>

      <h1>Upcoming Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAABMENSpregameData.getPregamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAABMensGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>


      <h1>Live Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAABMENSlivegameData.getLivegamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAABMensGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>

      <h1>Completed Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NCAABMENSpostgameData.getPostgamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NCAABMensGame key={game.gameId} {...game} />
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

  //NFL
  if (myLeague === "nba") {
    return (
      <div>

      <h1>Upcoming Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NBApregameData.getPregamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NBAGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>


      <h1>Live Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NBAlivegameData.getLivegamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NBAGame key={game.gameId} {...game} />
                    </span>
                  </Link>
                </Grid.Column>
              ))
            }
          </Fragment>
        </Grid.Row>
      </Grid>

      <h1>Completed Games</h1>
      <Grid columns="two">
        <Grid.Row>
          <Fragment>
            {
              NBApostgameData.getPostgamesByLeague.map(game => (
                <Grid.Column>
                  <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                    <span className="card" style={{"display": "block"}}>
                      <NBAGame key={game.gameId} {...game} />
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

  return null;


}

export default LeagueScoreboard;
