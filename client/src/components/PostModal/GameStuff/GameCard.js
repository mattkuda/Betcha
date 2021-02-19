import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

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

  function handleClick(gameId, betType, betAmount) {
    props.pickGameId(gameId);
    props.pickBetType(betType);
    props.pickBetAmount(betAmount);

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
                parseFloat(awaySpread.replace("+", ""))
              )
            }
            style={{ display: "inline-block" }}
          >
            {awaySpread}
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "OVER",
                parseFloat(props.gameData.overUnder)
              )
            }
            style={{ display: "inline-block" }}
          >
           O {props.gameData.overUnder}
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
                parseFloat(homeSpread.replace("+", ""))
              )
            }
            style={{ display: "inline-block" }}
          >
            {homeSpread}
          </Button>
          <Button
            onClick={() =>
              handleClick(
                props.gameData.gameId,
                "UNDER",
                parseFloat(props.gameData.overUnder)
              )
            }
            style={{ display: "inline-block" }}
          >
           U {props.gameData.overUnder}
          </Button>
        </div>
      </Card.Content>
      {betTimeFormat(props.gameData.startTime)}

    </Card>
  );
}

export default GameCard;
