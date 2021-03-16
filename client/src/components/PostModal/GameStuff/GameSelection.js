import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Loader } from "semantic-ui-react";
import "./GameSelection.css";

import { FETCH_NCCABMENS_GAMEPRES_QUERY } from "../../../util/graphql";
import { FETCH_NCAAF_PREGAMES } from "../../../util/graphql";
import { FETCH_ALL_PREGAMES } from "../../../util/graphql";

import GameCard from "./GameCard";

function GameSelection(props) {
  //TODO: Get the Games and their images via a Query instead of hardset data (as seen down below)
  // const { loading, data: { getGames: Games } = {} } = useQuery(
  //   FETCH_GameS_QUERY
  // );

  // var loading = false;
 var timeNow = new Date();
 timeNow.setHours(timeNow.getHours()-1);
 timeNow =timeNow.toISOString();
 console.log("the timeNow is: " +timeNow);
  if(props.league == "NFL"){
    // const { loading2, data: { getNCAABMensPregames: games } = {} } = useQuery(
    //   FETCH_NCCABMENS_GAMEPRES_QUERY
    // );
  }
  else if(props.league == "NCAAF"){
    // const { loading2, data: { getNCAABMensPregames: games } = {} } = useQuery(
    //   FETCH_NCCABMENS_GAMEPRES_QUERY
    // );
  }
  else if(props.league == "NCAAM"){
    // const { loading2, data: { getNCAABMensPregames: games } = {} } = useQuery(
    //   FETCH_NCCABMENS_GAMEPRES_QUERY
    // );
  }

  const { loading: gamesLoading, data: { getAllPregames: games } = {} } = useQuery(
    FETCH_ALL_PREGAMES
    );

  if (gamesLoading) {
    return (
      <div>
      <br/>
        <Loader active className='workaround' size='large' inline='centered'  size='large'>Loading Games...</Loader>
        <p style={{textAlign: "center"}}>Loading games...</p>
      </div>
    )
  }

  console.log("THE GAMES: " + JSON.stringify(games));


  return (
    <div style={{padding: "0px"}}>
      <Grid columns="two" style={{width: "100%",padding: "0px", margin: "0px"}}>
        <Grid.Row>
          {gamesLoading ? (
            {/* <Loader>Loading Games...</Loader> */}
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>
              {games &&
                games.filter(o => o.league === props.league && o.spread !== -1 && o.overUnder > 0 && o.startTime >= timeNow).map((game) => (
                  
                  <Grid.Column
                    key={game.id}
                    style={{ marginBottom: 20, marginTop: 20 }}
                  >
                    <GameCard
                      gameData={game}
                      pickGameId={props.chooseGameId}
                      pickBetType={props.chooseBetType}
                      pickBetOdds={props.chooseBetOdds}
                      pickBetAmount={props.chooseBetAmount}
                      pickGameData={props.chooseGameData}
                    />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default GameSelection;
