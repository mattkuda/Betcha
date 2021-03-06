import React, { useState } from "react";
import {
  Button,
  Form,
  Transition,
  Modal,
  Input,
  Grid,
  Icon,
} from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import "./PostModal.css";
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";
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

  var plusSign = "+";
  function createPostCallback() {
    try {
      createPost();
    } catch (err) {
      console.log(err);
    }
  }

  const [betType, setbetType] = React.useState("");
  const [betAmount, setBetAmount] = React.useState("");
  const [gameId, setGameId] = React.useState("");
  const [gameArray, setGameArray] = React.useState([]);
  const [betOdds, setBetOdds] = React.useState("");
  const [xdefBetOdds, setxdefBetOdds] = React.useState("");
  const [xdefBetAmount, setxdefBetAmount] = React.useState("");
  const [xleagueId, setxleagueId] = React.useState("");
  const [modalState, setModalState] = React.useState("Leagues");
  const [gameData, setGameData] = React.useState({});
  const [editAmount, setEditAmount] = React.useState(false);
  const [editOdds, setEditOdds] = React.useState(false);

  function selectLeague(event) {
    console.log("param pass in: " + event);
    setxleagueId(event);
    setModalState("Games");
    console.log("the league id is: " + xleagueId);
    console.log("modalState: " + modalState);
  }

  function selectGameId(pickedGameId) {
    //values.gameId = pickedGameId;
    values.gameId = pickedGameId;
    setGameId(pickedGameId);
    setModalState("BetAdjust");
    console.log("modalState: " + modalState);
  }

  function selectBetType(pickedBetType) {
    // values.betType = pickedBetType;
    values.betType = pickedBetType;
    setbetType(pickedBetType);
  }

  function selectBetOdds(pickedBetOdds) {
    // values.betOdds = pickedBetOdds;
    values.betOdds = pickedBetOdds.toString();
    setBetOdds(pickedBetOdds.toString());
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
    console.log("SUBMITTING: " + JSON.stringify(values));
    createPostCallback();
  }

  function goBackLeagues() {
    setModalState("Leagues");
  }

  function goBackGames() {
    setModalState("Games");
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
    <div
      style={{ padding: "0px", margin: "0px", width: "100%", height: "100%" }}
    >
      <div
        centered
        style={{
          textAlign: "center",
          backgroundColor: "#f2f2f2",
          width: "100%",
          display: "block",
          borderBottom: "3px solid #545454",
        }}
      >
        {modalState === "Leagues" && (
          <div
            style={{ display: "inline-block", padding: "15px", width: "100%" }}
          >
            <Icon
              size="big"
              fitted
              name="arrow left"
              className="hardLeft"
              style={{
                left: "0px",
                display: "inline-block",
                color: "#f2f2f2",
                padding: "0px 0px",
                marginTop: "90px",
              }}
            />

            <h2
              style={{
                color: "#545454",
                display: "inline-block",
                margin: "auto",
                textAlign: "center",
              }}
            >
              Select your league...
            </h2>
          </div>
        )}

        {modalState === "Games" && (
          <div
            style={{ display: "inline-block", padding: "15px", width: "100%" }}
          >
            <Icon
              onClick={goBackLeagues}
              size="big"
              fitted
              name="arrow left"
              className="hardLeft"
              style={{
                left: "0px",
                display: "inline-block",
                cursor: "pointer",
                color: "#545454",
                padding: "0px 0px",
                marginTop: "90px",
              }}
            />

            <h2
              style={{
                color: "#545454",
                display: "inline-block",
                margin: "auto",
                textAlign: "center",
              }}
            >
              Select your game...
            </h2>
          </div>
        )}

        {modalState === "BetAdjust" && (
          <div
            style={{ display: "inline-block", padding: "15px", width: "100%" }}
          >
            <Icon
              onClick={goBackGames}
              size="big"
              fitted
              name="arrow left"
              className="hardLeft"
              style={{
                left: "0px",
                display: "inline-block",
                cursor: "pointer",
                color: "#545454",
                padding: "0px 0px",
                marginTop: "90px",
              }}
            />

            <h2
              style={{
                color: "#545454",
                display: "inline-block",
                margin: "auto",
                textAlign: "center",
              }}
            >
              Adjust your bet...
            </h2>
          </div>
        )}
      </div>

      <div style={{ display: "block" }}>
        <div>
          {modalState === "Leagues" && (
            <LeagueSelection chooseLeague={selectLeague} />
          )}

          {modalState === "Games" && (
            <div>
              <GameSelection
                league={xleagueId}
                chooseGameId={selectGameId}
                chooseBetType={selectBetType}
                chooseBetOdds={selectxdefBetOdds}
                chooseBetAmount={selectxdefBetAmount}
                chooseGameData={setGameData}
              />
            </div>
          )}

          {modalState === "BetAdjust" && (
            <>
              <div className="betHeader">
                {gameData.awayFullName} @ {gameData.homeFullName}{" "}
              </div>
              <div className="betTime">{betTimeFormat(gameData.startTime)}</div>
              <div className="betSpreadLine">
                {betType === "OVER" && (
                  <div style={{ display: "inline-block" }}>Over: </div>
                )}
                {betType === "UNDER" && (
                  <div style={{ display: "inline-block" }}>Under: </div>
                )}
                {betType === "HOME" && (
                  <div style={{ display: "inline-block" }}>
                    {gameData.homeAbbreviation}:{" "}
                  </div>
                )}
                {betType === "AWAY" && (
                  <div style={{ display: "inline-block" }}>
                    {gameData.awayAbbreviation}:{" "}
                  </div>
                )}{" "}
                {(betAmount > 0 && (betType === "AWAY" || betType === "HOME")) && plusSign}
                {!editAmount && betAmount}
                {editAmount && (
                  <BetSelection
                    defValue={xdefBetAmount}
                    chooseBetAmount={selectBetAmount}
                    betValue={betAmount}
                    chooseEditAmount={setEditAmount}
                    chooseEditOdds={setEditOdds}
                    style={{ display: "inline-block" }}
                  />
                )}{" "}
                <div style={{ display: "inline-block" }}>
                  <Icon
                    onClick={() => setEditAmount(!editAmount)}
                    size="tiny"
                    fitted
                    float="top"
                    name="pencil"
                    style={{
                      display: "inline-block",
                      cursor: "pointer",
                      color: "teal",
                      padding: "0px 0px",
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="betSpreadLine">
                Odds:
                {!editOdds && betOdds > 0 && plusSign}
                {!editOdds && betOdds}
                {editOdds && (
                  <BetSelection
                    defValue={xdefBetOdds}
                    chooseBetAmount={selectBetOdds}
                    betValue={betOdds}
                    chooseEditAmount={setEditAmount}
                    chooseEditOdds={setEditOdds}
                  />
                )}
                <Icon
                  onClick={() => setEditOdds(!editOdds)}
                  size="tiny"
                  fitted
                  name="pencil"
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                    color: "teal",
                    padding: "0px 0px",
                  }}
                />
              </div>
              <br />
              
              
              <div className="betTextBox">
                <Input
                  placeholder="Why are you taking this bet?"
                  noValidate
                  fluid
                  size="big"
                  name="body"
                  onChange={onChange}
                  value={values.body}
                  error={error ? true : false}
                  style={{ width: "80%", margin: "auto" }}
                />
              </div>
              {values.gameArray.length > 0 &&(
                <div className="otherGames">
                    Total number of games in this parlay: {values.gameArray.length + 1}
                </div>
              )}
              <div className="betTextBox">
                <Button
                  type="button"
                  color="#a8fffb"
                  onClick={() => handleAddGameClick()}
                  disabled={values.gameArray.length > 9}
                >
                  Add another game
                </Button>
                <Button
                  type="button"
                  color="teal"
                  onClick={() => handleSingleBetSubmitClick()}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $body: String!
    $betOdds: String!
    $gameArray: [gameBetInput]
  ) {
    createPost(body: $body, betOdds: $betOdds, gameArray: $gameArray) {
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
