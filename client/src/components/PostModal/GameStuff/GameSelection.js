import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button } from "semantic-ui-react";

import { FETCH_NCCABMENS_GAMEPRES_QUERY } from "../../../util/graphql";

import GameCard from "./GameCard";

function GameSelection(props) {
  //TODO: Get the Games and their images via a Query instead of hardset data (as seen down below)
  // const { loading, data: { getGames: Games } = {} } = useQuery(
  //   FETCH_GameS_QUERY
  // );

  var loading = false;

  const { loading2, data: { getNCAABMensPregames: games } = {} } = useQuery(
    FETCH_NCCABMENS_GAMEPRES_QUERY
  );

  // var games = [
  //   {
  //     _id: "1",
  //     homeLogo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png",
  //     awayLogo: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png",
  //     homeAbbreviation: "KSU",
  //     awayAbbreviation: "TEX",
  //     homeColor: "633194",
  //     awayColor: "633194",
  //     startTime: "2020-12-05T17:00:00.000+00:00",
  //     spread: "TEX -10.0",
  //     overUnder: "51.5",
  //   },
  //   {
  //     _id: "2",
  //     homeLogo: "https://a.espncdn.com/i/teamlogos/ncaa/500/324.png",
  //     awayLogo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2335.png",
  //     homeAbbreviation: "CCU",
  //     awayAbbreviation: "LIB",
  //     homeColor: "007073",
  //     awayColor: "071740",
  //     startTime: "2020-12-05T19:00:00.000+00:00",
  //     spread: "LIB -7.5",
  //     overUnder: "53.0",
  //   },
  // ];

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
                games.map((game) => (
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
