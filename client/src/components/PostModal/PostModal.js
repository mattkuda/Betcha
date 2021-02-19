import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../../util/hooks";

import LeagueSelection from "./LeagueStuff/LeagueSelection";
import GameSelection from "./GameStuff/GameSelection";
import BetSelection from "./BetStuff/BetSelection";

import { FETCH_POSTS_QUERY } from "../../util/graphql";

function PostModal(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
    betType: "",
    betAmount: "",
    gameId: "",
    gameArray: [],
    xdefBetAmount: "",
    xleagueId: "",
  });

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
      values.betType = "";
      values.betAmount = "";
      values.gameId = "";
      values.gameArray = [];
    },
    //Added this so the page doesnt break
    onError(err) {
      console.log(err);
      return err;
    },
  });

  function createPostCallback() {
    try {
      createPost();
    } catch (err) {
      console.log(err);
    }
  }

  function selectLeague(pickedLeague) {
    values.xleagueId = pickedLeague;
  }

  function selectGameId(pickedGameId) {
    values.gameId = pickedGameId;
  }

  function selectBetType(pickedBetType) {
    values.betType = pickedBetType;
  }

  function selectBetAmount(pickedBetAmount) {
    values.betAmount = pickedBetAmount.toString();
  }

  function selectxdefBetAmount(pickedxdefBetAmount) {
    values.xdefBetAmount = pickedxdefBetAmount;
    values.betAmount = pickedxdefBetAmount.toString();
  }

  function addBetToArray() {
    var gameBetTemp = {
      betType: values.betType,
      betAmount: values.betAmount,
      gameId: values.gameId,
    };

    values.gameArray.push(gameBetTemp);

    

    console.log("3");
  }

  function handleSingleBetSubmitClick() {
    addBetToArray();
    console.log(JSON.stringify(values));
    createPostCallback();
  }

  function handleAddGameClick() {
    console.log("1");
    addBetToArray();
    values.gameId = "";
    values.xdefBetAmount = "";
    values.betType = "";
    values.betAmount = "";
    selectLeague("");
    console.log(JSON.stringify(values));

    console.log("2");
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <p>The gameArray is: {JSON.stringify(values.gameArray)}</p>
        <Form.Field>
          {values.xleagueId === "" ? (
            <LeagueSelection chooseLeague={selectLeague} />
          ) : (
            <p>The league state is {values.xleagueId}</p>
          )}

          {values.xleagueId !== "" && values.gameId === "" ? (
            <GameSelection
              league={values.xleagueId}
              chooseGameId={selectGameId}
              chooseBetType={selectBetType}
              chooseBetAmount={selectxdefBetAmount}
            />
          ) : (
            <div>
              <p>The gameId is {values.gameId}</p>
              <p>The betType state is {values.betType}</p>
              <p>The betAmount state is {values.betAmount}</p>
            </div>
          )}

          {values.xleagueId !== "" && values.gameId !== "" ? (
            <>
              <BetSelection
                defValue={values.xdefBetAmount}
                chooseBetAmount={selectBetAmount}
                betValue={values.betAmount}
              />
              <Form.Input
                placeholder="Why are you taking this bet?"
                noValidate
                name="body"
                onChange={onChange}
                value={values.body}
                error={error ? true : false}
              />
              <Button
                type="submit"
                color="teal"
                onClick={() => handleSingleBetSubmitClick()}
              >
                Submit
              </Button>
              <Button
                type="button"
                color="purple"
                onClick={() => handleAddGameClick()}
              >
                Add another game
              </Button>
            </>
          ) : (
            <></>
          )}
        </Form.Field>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!, $gameArray: [gameBetInput]) {
    createPost(body: $body, gameArray: $gameArray) {
      id
      body
      gameArray {
        betType
        betAmount
        gameId {
          homeFullName
          awayFullName
          stateDetails
          homeRecord
          awayRecord
          homeScore
          awayScore
          period
          time
          awayLogo
          homeLogo
          awayAbbreviation
          homeAbbreviation
          startTime
          broadcasts
          spread
          overUnder
        }
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default PostModal;
