import React, { useState, Fragment } from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { Waypoint } from "react-waypoint";
import gql from "graphql-tag";
import NFLGame from "../components/GameTypes/NFLGame";
import NCAAFGame from "../components/GameTypes/NCAAFGame";
import NCAABMensGame from "../components/GameTypes/NCAABMensGame";
import NBAGame from "../components/GameTypes/NBAGame";
import Game from "../components/GameTypes/Game";
import { Grid, Loader, Menu, Header, Icon, Segment, Divider } from "semantic-ui-react";
import { FETCH_NFL_PREGAMES, FETCH_NFL_LIVEGAMES, FETCH_NFL_POSTGAMES,
         FETCH_NCAAF_PREGAMES, FETCH_NCAAF_LIVEGAMES, FETCH_NCAAF_POSTGAMES,
         FETCH_NCAABMENS_PREGAMES, FETCH_NCAABMENS_LIVEGAMES, FETCH_NCAABMENS_POSTGAMES,
         FETCH_NBA_PREGAMES, FETCH_NBA_LIVEGAMES, FETCH_NBA_POSTGAMES, FETCH_ACTIVE_LEAGUES_QUERY,
         FETCH_NHL_PREGAMES, FETCH_NHL_LIVEGAMES, FETCH_NHL_POSTGAMES, FETCH_PREMIER_LEAGUE_PREGAMES,
         FETCH_PREMIER_LEAGUE_LIVEGAMES, FETCH_PREMIER_LEAGUE_POSTGAMES, FETCH_CHAMPIONS_LEAGUE_PREGAMES,
         FETCH_CHAMPIONS_LEAGUE_LIVEGAMES, FETCH_CHAMPIONS_LEAGUE_POSTGAMES } from "../util/graphql";
import './scoreboard.css';


function assembleDates(start, end) {
  for ( var arr=[], dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)) {
    arr.push(new Date(dt));
  }
  return arr;
}


function LeagueScoreboard(props) {

  let myLeague = props.league;


  const { loading: NFLpregameLoading, error: NFLpregameError, data: NFLpregameData } = useQuery(FETCH_NFL_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nfl")
  });
  const { loading: NFLlivegameLoading, error: NFLlivegameError, data: NFLlivegameData } = useQuery(FETCH_NFL_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 10000,
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


  const { loading: NHLpregameLoading, error: NHLpregameError, data: NHLpregameData } = useQuery(FETCH_NHL_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nhl")
  });
  const { loading: NHLlivegameLoading, error: NHLlivegameError, data: NHLlivegameData } = useQuery(FETCH_NHL_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nhl")
  });
  const { loading: NHLpostgameLoading, error: NHLpostgameError, data: NHLpostgameData } = useQuery(FETCH_NHL_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "nhl")
  });

  const { loading: PremierLeaguepregameLoading, error: PremierLeaguepregameError, data: PremierLeaguepregameData } = useQuery(FETCH_PREMIER_LEAGUE_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "eng.1")
  });
  const { loading: PremierLeaguelivegameLoading, error: PremierLeaguelivegameError, data: PremierLeaguelivegameData } = useQuery(FETCH_PREMIER_LEAGUE_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "eng.1")
  });
  const { loading: PremierLeaguepostgameLoading, error: PremierLeaguepostgameError, data: PremierLeaguepostgameData } = useQuery(FETCH_PREMIER_LEAGUE_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "eng.1")
  });

  const { loading: ChampionsLeaguepregameloading, error: ChampionsLeaguepregameError, data: ChampionsLeaguepregameData } = useQuery(FETCH_CHAMPIONS_LEAGUE_PREGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "uefa.champions")
  });
  const { loading: ChampionsLeaguelivegameloading, error: ChampionsLeaguelivegameError, data: ChampionsLeaguelivegameData } = useQuery(FETCH_CHAMPIONS_LEAGUE_LIVEGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "uefa.champions")
  });
  const { loading: ChampionsLeaguepostgameloading, error: ChampionsLeaguepostgameError, data: ChampionsLeaguepostgameData } = useQuery(FETCH_CHAMPIONS_LEAGUE_POSTGAMES, {
    variables: { myLeague },
    pollInterval: 30000,
    skip: (myLeague !== "uefa.champions")
  });



  const { loading: LeagueLoading, error: LeagueError, data: LeagueData } = useQuery(FETCH_ACTIVE_LEAGUES_QUERY);


  if (NFLpregameLoading || NFLlivegameLoading || NFLpostgameLoading ||
      NCAAFpregameLoading || NCAAFlivegameLoading || NCAAFpostgameLoading ||
      NCAABMENSpregameLoading || NCAABMENSlivegameLoading || NCAABMENSpostgameLoading ||
      NBApregameLoading || NBAlivegameLoading || NBApostgameLoading ||
      NHLpregameLoading || NHLlivegameLoading || NHLpostgameLoading ||
      PremierLeaguepregameLoading || PremierLeaguelivegameLoading || PremierLeaguepostgameLoading ||
      ChampionsLeaguepregameloading || ChampionsLeaguelivegameloading || ChampionsLeaguepostgameloading ||
      LeagueLoading) return (
    <>
    <Loader active inline='centered' size='large'>Loading</Loader>
    </>
  )

  if (NFLpregameError || NFLlivegameError || NFLpostgameError ||
      NCAAFpregameError || NCAAFlivegameError || NCAAFpostgameError ||
      NCAABMENSpregameError || NCAABMENSlivegameError || NCAABMENSpostgameError ||
      NBApregameError || NBAlivegameError || NBApostgameError ||
      NHLpregameError || NHLlivegameError || NHLpostgameError ||
      PremierLeaguepregameError || PremierLeaguelivegameError || PremierLeaguepostgameError ||
      ChampionsLeaguepregameError || ChampionsLeaguelivegameError || ChampionsLeaguepostgameError ||
      LeagueError) return "Error occurred!";


  //NFL
  if (myLeague === "nfl") {

    return (
      <div>

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

    const currentDate = new Date();

    return (
      <>

      <div style = {{
          marginTop: '40px',
        }}>

        {NCAABMENSlivegameData.getLivegamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Live Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
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

          </Segment>
          </>
      ) : (<></>)}


        {NCAABMENSpregameData.getPregamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Upcoming Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
                {
                  NCAABMENSpregameData.getPregamesByLeague.filter(game => game.awayAbbreviation !== "TBD" &&
                  game.homeAbbreviation !== "TBD")
                  .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                  .map(game => (
                    <Grid.Column>
                      <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                        <span className="card" style={{
                            "display": "block"
                          }}>
                          <NCAABMensGame key={game.gameId} {...game} />
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


        {NCAABMENSpostgameData.getPostgamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Completed Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
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

          </Segment>
          </>
        ) : (<></>)}

      </div>

      </>
    )
  }

  //NBA
  if (myLeague === "nba") {

    const currentDate = new Date();

    return (

      <>

        <div style = {{
            marginTop: '40px',
          }}>

          {NBAlivegameData.getLivegamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Live Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
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

          </Segment>
          </>
        ) : (<></>)}

          {NBApregameData.getPregamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Upcoming Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    NBApregameData.getPregamesByLeague.filter((game) => game.awayAbbreviation !== "TBD" &&
                    game.homeAbbreviation !== "TBD")
                    .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                    .map(game => (
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

          </Segment>
          </>
        ) : (<></>)}

        {NBApostgameData.getPostgamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Completed Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
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

        </Segment>
        </>
      ) : (<></>)}
      </div>

    </>
    )
  }

  //NHL
  if (myLeague === "nhl") {

    const currentDate = new Date();

    return (

      <>

        <div style = {{
            marginTop: '40px',
          }}>

          {NHLlivegameData.getLivegamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Live Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    NHLlivegameData.getLivegamesByLeague.map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

          {NHLpregameData.getPregamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Upcoming Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    NHLpregameData.getPregamesByLeague.filter((game) => game.awayAbbreviation !== "TBD" &&
                    game.homeAbbreviation !== "TBD")
                    .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                    .map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

        {NHLpostgameData.getPostgamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Completed Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
                {
                  NHLpostgameData.getPostgamesByLeague.map(game => (
                    <Grid.Column>
                      <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                        <span className="card" style={{"display": "block"}}>
                          <Game key={game.gameId} {...game} />
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

    </>
    )
  }


  //PREMIER LEAGUE
  if (myLeague === "eng.1") {

    const currentDate = new Date();

    return (
      <>

        <div style = {{
            marginTop: '40px',
          }}>

          {PremierLeaguelivegameData.getLivegamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Live Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    PremierLeaguelivegameData.getLivegamesByLeague.map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

          {PremierLeaguepregameData.getPregamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Upcoming Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    PremierLeaguepregameData.getPregamesByLeague.filter((game) => game.awayAbbreviation !== "TBD" &&
                    game.homeAbbreviation !== "TBD")
                    .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                    .map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

        {PremierLeaguepostgameData.getPostgamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Completed Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
                {
                  PremierLeaguepostgameData.getPostgamesByLeague.map(game => (
                    <Grid.Column>
                      <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                        <span className="card" style={{"display": "block"}}>
                          <Game key={game.gameId} {...game} />
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

    </>
    )
  }


  //UEFA CHAMPIONS LEAGUE
  if (myLeague === "uefa.champions") {

    const currentDate = new Date();

    return (
      <>

        <div style = {{
            marginTop: '40px',
          }}>

          {ChampionsLeaguelivegameData.getLivegamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Live Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    ChampionsLeaguelivegameData.getLivegamesByLeague.map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

          {ChampionsLeaguepregameData.getPregamesByLeague.length > 0 ? (
            <>
            <Header as='h3'>
              <Header.Content>Upcoming Games</Header.Content>
            </Header>

            <Segment raised>

            <Grid stackable columns="two">
              <Grid.Row>
                <Fragment>
                  {
                    ChampionsLeaguepregameData.getPregamesByLeague.filter((game) => game.awayAbbreviation !== "TBD" &&
                    game.homeAbbreviation !== "TBD")
                    .filter(game => new Date(game.startTime) >= currentDate.setHours(currentDate.getHours()-1))
                    .map(game => (
                      <Grid.Column>
                        <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                          <span className="card" style={{"display": "block"}}>
                            <Game key={game.gameId} {...game} />
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

        {ChampionsLeaguepostgameData.getPostgamesByLeague.length > 0 ? (
          <>
          <Header as='h3'>
            <Header.Content>Completed Games</Header.Content>
          </Header>

          <Segment raised>

          <Grid stackable columns="two">
            <Grid.Row>
              <Fragment>
                {
                  ChampionsLeaguepostgameData.getPostgamesByLeague.map(game => (
                    <Grid.Column>
                      <Link to={`/scoreboard/${myLeague}/${game.gameId}`}>
                        <span className="card" style={{"display": "block"}}>
                          <Game key={game.gameId} {...game} />
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

    </>
    )
  }

  return null;

}

export default LeagueScoreboard;
