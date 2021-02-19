import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button } from "semantic-ui-react";

import { FETCH_NCCABMENS_GAMEPRES_QUERY } from "../../../util/graphql";
import { FETCH_NCAAF_PREGAMES } from "../../../util/graphql";
import { FETCH_ALL_PREGAMES } from "../../../util/graphql";

import GameCard from "./GameCard";

function GameSelection(props) {
  //TODO: Get the Games and their images via a Query instead of hardset data (as seen down below)
  // const { loading, data: { getGames: Games } = {} } = useQuery(
  //   FETCH_GameS_QUERY
  // );

  var loading = false;

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

  const { loading2, data: { getAllPregames: games } = {} } = useQuery(
    FETCH_ALL_PREGAMES
    );



  return (
    <>
      <Grid columns="two">
        <Grid.Row>
          {loading2 ? (
            <h1>Loading Games...</h1>
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>
              {games &&
                games.filter(o => o.league === props.league && o.spread !== -1 && o.overUnder > 0).map((game) => (
                  <Grid.Column
                    key={game.id}
                    style={{ marginBottom: 20, marginTop: 20 }}
                  >
                    <GameCard
                      gameData={game}
                      pickGameId={props.chooseGameId}
                      pickBetType={props.chooseBetType}
                      pickBetAmount={props.chooseBetAmount}
                    />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default GameSelection;
