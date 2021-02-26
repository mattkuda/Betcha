import React, { useState } from "react";
import { Button, Form, Transition, Modal } from "semantic-ui-react";
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
    betOdds: "",
    xdefBetOdds: "",
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
      values.betOdds = "";
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

  //const [inputValue, setInputValue] = React.useState(""); //EX.
  const [betType, setbetType] = React.useState("");
  const [betAmount, setBetAmount] = React.useState("");
  const [gameId, setGameId] = React.useState("");
  const [gameArray, setGameArray] = React.useState([]);
  const [betOdds, setBetOdds] = React.useState("");
  const [xdefBetOdds, setxdefBetOdds] = React.useState("");
  const [xdefBetAmount, setxdefBetAmount] = React.useState("");
  const [xleagueId, setxleagueId] = React.useState("");
  const [modalState, setModalState] = React.useState("Leagues");
 
  function selectLeague(event) {
    console.log("param pass in: " + event);
    setxleagueId(event);
    setModalState("Games");
    console.log("the league id is: " + xleagueId)
    console.log("modalState: " + modalState)

  }

  function selectGameId(pickedGameId) {
    //values.gameId = pickedGameId;
    values.gameId = pickedGameId;
    setGameId(pickedGameId);
    setModalState("BetAdjust");
    console.log("modalState: " + modalState)
  }

  function selectBetType(pickedBetType) {
    // values.betType = pickedBetType;
    values.betType = pickedBetType;
    setbetType(pickedBetType)
    
  }

  function selectBetOdds(pickedBetOdds) {
    // values.betOdds = pickedBetOdds;
    values.betOdds = pickedBetOdds.toString();
    setBetOdds(pickedBetOdds.toString())
  }

  function selectxdefBetOdds(pickedxdefBetOdds) {
    // values.xdefBetOdds = pickedxdefBetOdds;
    // values.betOdds = pickedxdefBetOdds.toString();

    values.betOdds = pickedxdefBetOdds.toString();
    values.xdefBetOdds = pickedxdefBetOdds;
    setBetOdds(pickedxdefBetOdds.toString());
    setxdefBetOdds(pickedxdefBetOdds);
  }

  function selectBetAmount(pickedBetAmount) {
    // values.betAmount = pickedBetAmount.toString();
    values.betAmount = pickedBetAmount.toString();
    
    setBetAmount(pickedBetAmount);
  }

  function selectxdefBetAmount(pickedxdefBetAmount) {
    // values.xdefBetAmount = pickedxdefBetAmount;
    // values.betAmount = pickedxdefBetAmount.toString();

    values.betAmount = pickedxdefBetAmount.toString();
    values.xdefBetAmount = pickedxdefBetAmount;
    setxdefBetAmount(pickedxdefBetAmount);
    setBetAmount(pickedxdefBetAmount.toString());
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
    console.log("SUBMITTING: "+JSON.stringify(values));
    createPostCallback();
  }

  function handleAddGameClick() {
    console.log("1");
    addBetToArray();
    selectGameId("");
    values.xdefBetAmount = "";
    values.xdefBetOdds = "";
    selectBetType("");
    selectBetAmount("");
    setxleagueId("");
    setModalState("Leagues");
    console.log(JSON.stringify(values));

    console.log("2");
  }

  return (
    <>
      <p>xlid: {xleagueId}</p>
      <Form onSubmit={onSubmit}>
        <p>The gameArray is: {JSON.stringify(values.gameArray)}</p>
        {/* sdfsdf */}
        <Form.Field>
          {modalState === "Leagues" && (
            <LeagueSelection chooseLeague={selectLeague} />
          ) }

          {modalState === "Games"  && (
            <div><p>in game sleec</p>
            <GameSelection
              league={xleagueId}
              chooseGameId={selectGameId}
              chooseBetType={selectBetType}
              chooseBetOdds={selectxdefBetOdds}
              chooseBetAmount={selectxdefBetAmount}
            />
            </div>
          ) }

          {modalState === "BetAdjust" && (
            <>
              Change the spread o/u:
              <BetSelection
                defValue={xdefBetAmount}
                chooseBetAmount={selectBetAmount}
                betValue={betAmount}
              />
              Change the odds:
              <BetSelection
                defValue={xdefBetOdds}
                chooseBetAmount={selectBetOdds}
                betValue={betOdds}
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
                disabled={values.gameArray.length > 9}
              >
                Add another game
              </Button>
            </>
          )}
        </Form.Field>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!,$betOdds: String!, $gameArray: [gameBetInput]) {
    createPost(body: $body,betOdds: $betOdds, gameArray: $gameArray) {
      id
      body
      betOdds
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
