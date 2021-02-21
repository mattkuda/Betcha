import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import "./GameCard.css";

import { betTimeFormat } from "../../../util/Extensions/betTimeFormat";

function GameCard(props) {
  var spreadNumber = props.gameData.spread;
  var homeSpread = "";
  var awaySpread = "";

  //if the home team is the favorite ... (espn spread is always negative / the value of the favorite)
  if (props.gameData.favoredTeam === props.gameData.homeAbbreviation) {
    homeSpread = "-" + spreadNumber;
    awaySpread = "+" + spreadNumber;
  } else {
    homeSpread = "+" + spreadNumber;
    awaySpread = "-" + spreadNumber;
  }

  function handleClick(gameId, betType, betAmount, betOdds) {
    props.pickGameId(gameId);
    props.pickBetType(betType);
    props.pickBetAmount(betAmount);
    props.pickBetOdds(betOdds);

    console.log(gameId);
    console.log(betType);
    console.log(betAmount);
  }

  return (
    <Card fluid>
      <Card.Content>
        <div style={{ display: "inline-block" }}>
          <Image floated="left" size="mini" src={props.gameData.awayLogo} />
          {props.gameData.awayAbbreviation}
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "AWAY",
                parseFloat(awaySpread.replace("+", "")),
                props.gameData.awaySpreadOdds
              )
            }
            style={{ display: "inline-block" }}
          >
            <div>{awaySpread}</div><div className="odds">{props.gameData.awaySpreadOdds}</div> 
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "AWAY",
                0,
                props.gameData.awaySpreadOdds
              )
            }
            style={{ display: "inline-block" }}
          >
            <div>ML</div><div className="odds">{props.gameData.awayML}</div> 
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "OVER",
                parseFloat(props.gameData.overUnder),
                props.gameData.underOdds
              )
            }
            style={{ display: "inline-block" }}
          >
           <div>O {props.gameData.overUnder}</div><div className="odds">{props.gameData.overOdds}</div> 
          </Button>
        </div>
      </Card.Content>

      <Card.Content>
        <div style={{ display: "inline-block" }}>
          <Image floated="left" size="mini" src={props.gameData.homeLogo} />
          {props.gameData.homeAbbreviation}
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "HOME",
                parseFloat(homeSpread.replace("+", ""),
                props.gameData.homeSpreadOdds)
              )
            }
            style={{ display: "inline-block" }}
          >
            <div>{homeSpread}</div><div className="odds">{props.gameData.homeSpreadOdds}</div> 
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "HOME",
                0,
                props.gameData.homeSpreadOdds
              )
            }
            style={{ display: "inline-block" }}
          >
            <div>ML</div><div className="odds">{props.gameData.homeML}</div> 
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "UNDER",
                parseFloat(props.gameData.overUnder),
                props.gameData.overOdds
              )
            }
            style={{ display: "inline-block" }}
          >
           <div>U {props.gameData.overUnder}</div><div className="odds">{props.gameData.underOdds}</div> 
          </Button>
        </div>
      </Card.Content>
      {betTimeFormat(props.gameData.startTime)}

    </Card>
  );
}

export default GameCard;
