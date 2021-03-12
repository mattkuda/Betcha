import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import "./GameCard.css";

import { betTimeFormat } from "../../../util/Extensions/betTimeFormat";

function GameCard(props) {
  var spreadNumber = props.gameData.spread;
  var homeSpread = "";
  var awaySpread = "";

  console.log("The favored is: " + props.gameData.favoredTeam);
  //if the home team is the favorite ... (espn spread is always negative / the value of the favorite)
  if (props.gameData.favoredTeam === props.gameData.homeAbbreviation) {
    homeSpread = "-" + spreadNumber;
    awaySpread = "+" + spreadNumber;
  } else {
    homeSpread = "+" + spreadNumber;
    awaySpread = "-" + spreadNumber;
  }

  function handleClick(gameId, betType, betAmount, betOdds, betGameData) {
    props.pickGameId(gameId);
    props.pickBetType(betType);
    props.pickBetAmount(betAmount);
    props.pickBetOdds(betOdds);
    props.pickGameData(betGameData)
  }

  return (
    <Card fluid>
      <Card.Content style={{ padding: "5px" }}>
        <table style={{ width: "100%",  }}>
          <tr>
            <td></td>

            <td></td>

            <td style={{ textAlign: "center" }}>Spread</td>

            <td style={{ textAlign: "center" }}>Moneyline</td>

            <td style={{ textAlign: "center" }}>O/U</td>
          </tr>
          <tr>
            <td style={{textAlign: "center"}}>
              <Image floated="left" size="mini" src={props.gameData.awayLogo} />
            </td>
            <td style={{minWidth: "55%", textAlign: "center"}}>{props.gameData.awayAbbreviation}</td>
            <td style={{textAlign: "center"}}>
              <Button
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "AWAY",
                    parseFloat(awaySpread.replace("+", "")),
                    props.gameData.awaySpreadOdds, 
                    props.gameData
                  )
                }
                style={{ display: "inline-block", backgroundColor: "#ededed"  }}
              >
                <div>{awaySpread}</div>
                <div className="odds">{props.gameData.awaySpreadOdds}</div>
              </Button>
            </td>
            <td style={{textAlign: "center"}}>
              <Button
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "AWAY",
                    0,
                    props.gameData.awaySpreadOdds, 
                    props.gameData
                  )
                }
                style={{ display: "inline-block", backgroundColor: "#ededed" }}
              >
                <div>ML</div>
                <div className="odds">{props.gameData.awayML}</div>
              </Button>
            </td>
            <td style={{textAlign: "center"}}>
              <Button
              
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "OVER",
                    parseFloat(props.gameData.overUnder),
                    props.gameData.underOdds, 
                    props.gameData
                  )
                }
              >
                <div >O {props.gameData.overUnder}</div>
                <div className="odds">{props.gameData.overOdds}</div>
              </Button>
            </td>
          </tr>
          {/* //sdfsadfsdfsd */}
          <tr>
            <td style={{textAlign: "center"}}>
              <Image floated="left" size="mini" src={props.gameData.homeLogo} />
            </td>
            <td style={{textAlign: "center"}}>{props.gameData.homeAbbreviation}</td>
            <td style={{textAlign: "center"}}>
              <Button
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "HOME",
                    parseFloat(homeSpread.replace("+", "")),
                    props.gameData.homeSpreadOdds, 
                    props.gameData
                  )
                }
                style={{ display: "inline-block", backgroundColor: "#ededed"  }}
              >
                <div>{homeSpread}</div>
                <div className="odds">{props.gameData.homeSpreadOdds}</div>
              </Button>
            </td>
            <td style={{textAlign: "center"}}>
              <Button
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "HOME",
                    0,
                    props.gameData.homeSpreadOdds, 
                    props.gameData
                  )
                }
                style={{ display: "inline-block", backgroundColor: "#ededed"  }}
              >
                <div>ML</div>
                <div className="odds">{props.gameData.homeML}</div>
              </Button>
            </td>
            <td style={{textAlign: "center"}}>
              <Button
                onClick={() =>
                  handleClick(
                    props.gameData.gameId,
                    "UNDER",
                    parseFloat(props.gameData.overUnder),
                    props.gameData.underOdds, 
                    props.gameData
                  )
                }
                style={{ display: "inline-block", backgroundColor: "#ededed"  }}
              >
                <div>U {props.gameData.overUnder}</div>
                <div className="odds">{props.gameData.overOdds}</div>
              </Button>
            </td>
          </tr>
        </table>
      {betTimeFormat(props.gameData.startTime)}
      </Card.Content>
    </Card>
  );
}

export default GameCard;
