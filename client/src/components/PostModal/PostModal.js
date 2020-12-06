import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";

import { useForm } from "../../util/hooks";

import LeagueSelection from "./LeagueStuff/LeagueSelection";
import GameSelection from "./GameStuff/GameSelection";
import BetSelection from "./BetStuff/BetSelection";

import { FETCH_POSTS_QUERY } from "../../util/graphql";
import { FETCH_GAMEPRES_QUERY } from "../../util/graphql";

function PostModal(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
    leagueId: "",
    gameId: "",
    //defBetId: "",
    bet: "",
  });

  const { gamesLoading, data: { getGamePres: gamepres } = {} } = useQuery(
    FETCH_GAMEPRES_QUERY
  );

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      //If successful, close modal
      props.handleClose();
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
      values.bet = "";
    },
    //Added this so the page doesnt break
    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  //use league, game, and bet to determine what to show in the post modal
  // const [leagueState, setLeague] = useState(null);
  // const [gameIdState, setGameId] = useState(null);
  // const [betState, setBet] = useState(null);

  function selectLeague(pickedLeague) {
    values.leagueId = pickedLeague;
  }

  function selectGameId(pickedGameId) {
    values.gameId = pickedGameId;
  }

  function selectBet(pickedBet) {
    values.bet = pickedBet;
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          
          {values.leagueId === "" ? (
            <LeagueSelection chooseLeague={selectLeague} />
          ) : (
            <p>The league state is {values.leagueId}</p>
          )}

          {values.leagueId !== "" && values.gameId === "" ? (
            <GameSelection chooseGame={selectGameId} chooseBet={selectBet} />
          ) : (
            <div>
              <p>The game state is {values.gameId}</p>
              <p>The bet state is {values.bet}</p>
            </div>
          )}

          {values.leagueId !== "" && values.gameId !== "" ? (
            <BetSelection defValue={values.bet} chooseBet={selectBet} />
          ) : (
            <></>
          )}
          <Form.Input
            placeholder="Why are you taking this bet?"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!,$bet: String! ) {
    createPost(body: $body, bet: $bet) {
      id
      body
      bet
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostModal;
