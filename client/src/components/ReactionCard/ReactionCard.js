import React, { useContext } from "react";
import { Card, Icon, Label, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../../util/MyPopup";

import "./ReactionCard.css";

import { AuthContext } from "../../context/auth";
import LikeButton from "../Buttons/LikeButton";
import DeleteButton from "../Buttons/DeleteButton";

import { betDescFormat } from "../../util/Extensions/betDescFormat";
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";
import { liveGameDescFormat } from "../../util/Extensions/liveGameDescFormat";
import { postGameDescFormat } from "../../util/Extensions/postGameDescFormal";
import { determineBetResult } from "../../util/Extensions/betCalculations";

function ReactionCard({
  reaction: { id, body, user, playId, createdAt, post } = {},
}) {
  const { userME } = useContext(AuthContext);

  console.log("The Post is: " + post)
  console.log("The body is: " + body)
  console.log("The playId.description is: " + playId.description)
  const betData =
    post != null
      ? post.gameArray.find((o) => o.gameId.gameId === playId.game.gameId)
      : null;


    const gameData = playId.game;

  console.log("gamedata alert" + JSON.stringify(gameData));
  console.log("user alert" + JSON.stringify(user));

  let LiveGamePostedAboutMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <h1>THIS IS A REACTIOn</h1>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={`${user.profilePicture}`}
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${user.username}`}>
              {user.name} @{user.username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            {gameData && gameData.gameId == null ? (
              <div className="pc-bet">Failed to load game data</div>
            ) : (
              <div className="pc-bet">
                {betDescFormat(
                  gameData.betType,
                  gameData.betAmount,
                  gameData.gameId
                )}{" "}
                ·{" "}
                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "normal",
                    fontStyle: "italic",
                  }}
                >
                  LIVE: {liveGameDescFormat(gameData.gameId)}
                </div>
              </div>
            )}

            <div className="pc-betBody">The reaction: {body}</div>
            <div className="pc-betBody">The play: {playId.description}</div>
          </div>
        </Card.Content>
      </Card>
    </>
  );

  let LiveGameNormalMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <h1>THIS IS A REACTIOn</h1>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={`${user.profilePicture}`}
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${user.username}`}>
              {user.name} @{user.username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>
            <div className="pc-bet">Game not posted about</div>}
            <div className="pc-betBody">The reaction: {body}</div>
            <div className="pc-betBody">The play: {playId.description}</div>
          </div>
        </Card.Content>
      </Card>
    </>
  );

  let PostGamePostedAboutMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <h1>THIS IS A REACTIOn</h1>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={`${user.profilePicture}`}
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${user.username}`}>
              {user.name} @{user.username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            {gameData && gameData.gameId == null ? (
              <div className="pc-bet">Failed to load game data</div>
            ) : (
              <div className="pc-bet">
                <div
                  className={determineBetResult(
                    gameData.gameId.homeScore,
                    gameData.gameId.awayScore,
                    gameData.betType,
                    gameData.betAmount
                  )}
                >
                  {betDescFormat(
                    gameData.betType,
                    gameData.betAmount,
                    gameData.gameId
                  )}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "normal",
                    fontStyle: "italic",
                  }}
                >
                  · {postGameDescFormat(gameData.gameId)}
                </div>
              </div>
            )}

            <div className="pc-betBody">The reaction: {body}</div>
            <div className="pc-betBody">The play: {playId.description}</div>
          </div>
        </Card.Content>
      </Card>
    </>
  );

  let PostGameNormalMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <h1>THIS IS A REACTIOn</h1>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={`${user.profilePicture}`}
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${user.username}`}>
              {user.name} @{user.username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            <div className="pc-bet">Game not posted about</div>

            <div className="pc-betBody">The reaction: {body}</div>
            <div className="pc-betBody">The play: {playId.description}</div>
          </div>
        </Card.Content>
      </Card>
    </>
  );

  if (gameData.stateDetails === "STATUS_IN_PROGRESS") {
    if (post != null) return LiveGamePostedAboutMarkup;
    else return LiveGameNormalMarkup;
  } else if (gameData.stateDetails === "STATUS_FINAL") {
    if (post != null){
      console.log("12312312")
      return PostGamePostedAboutMarkup;
    } 
    else{
      console.log("666666")
      return PostGameNormalMarkup;
    } 
  }
}

export default ReactionCard;
