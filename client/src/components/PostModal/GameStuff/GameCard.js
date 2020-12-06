import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { betTimeFormat } from "../../../util/betTimeFormat";

//onClick={props.pickLeague(props.name)}

function GameCard(props) {
  var spreadNumber = props.gameData.spread.replace("-", "").split(" ")[1];
  var homeSpread = "";
  var awaySpread = "";

  //if the home team is the favorite ... (espn spread is always negative / the value of the favorite)
  if (props.gameData.spread.split(" ")[0] === props.gameData.homeAbbreviation) {
    homeSpread = "-" + spreadNumber;
    awaySpread = "+" + spreadNumber;
  } else {
    homeSpread = "+" + spreadNumber;
    awaySpread = "-" + spreadNumber;
  }

  function handleClick(gameId, bet) {
    props.pickGame(gameId);
    props.pickBet(bet);
    console.log(gameId);
    console.log(bet);
  }

  return (
    <Card fluid>
      <Card.Content>
        <div style={{ display: "inline-block" }}>
          <Image floated="left" size="mini" src={props.gameData.awayLogo} />
          {props.gameData.awayAbbreviation}
          <Button floated="right" 
            onClick={() => handleClick(props.gameData._id, props.gameData.awayAbbreviation + " " + awaySpread)}
            style={{ display: "inline-block" }}>
            {awaySpread}
          </Button>
        </div>
      </Card.Content>

      <Card.Content>
        <div style={{ display: "inline-block" }}>
          <Image floated="left" size="mini" src={props.gameData.homeLogo} />
          {props.gameData.homeAbbreviation}
          <Button
            floated="right"
            onClick={() => handleClick(props.gameData._id, props.gameData.homeAbbreviation + " " + homeSpread)}
            style={{ display: "inline-block" }}
          >
            {homeSpread}
          </Button>
        </div>
      </Card.Content>
      {betTimeFormat(props.gameData.startTime)}
      <Card.Content></Card.Content>
    </Card>
  );
}

export default GameCard;
