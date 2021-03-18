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
import { reactionGameDescFormat } from "../../util/Extensions/liveGameDescFormat";
import { contextualizeBet } from "../../util/Extensions/liveGameDescFormat";
import { postGameDescFormat } from "../../util/Extensions/postGameDescFormal";
import { determineBetResult } from "../../util/Extensions/betCalculations";

function ReactionCard({
  reaction: {
    id,
    body,
    user,
    playId,
    createdAt,
    post,
    commentCount,
    likeCount,
    likes,
  } = {},
}) {
  const { userME } = useContext(AuthContext);

  function findIcon(input) {
    switch (input) {
      case "basketball":
        return "basketball ball";
      case "football":
        return "football ball";
      case "hockey":
        return "hockey puck";
      case "soccer":
        return "soccer";
      default:
        return "talk";
    }
  }

  const betData =
    post != null
      ? post.gameArray.find((o) => o.gameId.gameId === playId.game.gameId)
      : null;

  const gameData = playId.game;

  let PostGameMarkup =
    //If the user ahs posted about the game
    post ? (
      <>
        <Card fluid floated="right" style={{ width: "100%" }}>
          <Card.Content>
            <div
              style={{
                display: "inline-block",
                width: "auto",
                verticalAlign: "top",
              }}
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
                style={{
                  display: "inline-block",
                  color: "gray",
                  float: "right",
                }}
              >
                {moment(createdAt).fromNow(true)} ago
              </div>
              <div className="pc-betBody">{body}</div>
              <div className="pc-reactionScore">
                has the bet {contextualizeBet(betData)}
              </div>
              <div
                style={{
                  border: "solid #e3e3e3 2px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <div className="pc-betBody">
                  <Icon name={findIcon(gameData.sport)} />
                  <i>{playId.description}</i>
                </div>
                <div className="pc-reactionScore">
                  <i>
                    {reactionGameDescFormat(
                      playId.game.awayAbbreviation,
                      playId.game.homeAbbreviation,
                      playId.specificData
                    )}
                  </i>
                </div>
              </div>

              <div className="pc-buttons">
                <LikeButton
                  user={userME}
                  receiver={user.id}
                  post={{ id, likes, likeCount }}
                />
                <MyPopup content="Commment on post" inverted>
                  <Button labelPosition="right" as={Link} to={`/reacts/${id}`}>
                    <Button color="blue" basic>
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {userME && userME.username === post.username && (
                  <div
                    style={{
                      display: "inline-block",
                      color: "gray",
                      float: "right",
                    }}
                  >
                    <DeleteButton postId={id} />
                  </div>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      </>
    ) : (
      //If the user hasn't posted about the game
      <>
        <Card fluid floated="right" style={{ width: "100%" }}>
          <Card.Content style={{ verticalAlign: "top" }}>
            <div
              style={{
                display: "inline-block",
                width: "auto",
                verticalAlign: "top",
              }}
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
                style={{
                  display: "inline-block",
                  color: "gray",
                  float: "right",
                }}
              >
                {moment(createdAt).fromNow(true)} ago
              </div>
              <div className="pc-betBody">{body}</div>
              <div
                style={{
                  border: "solid #e3e3e3 2px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <div className="pc-betBody">
                  <Icon name={findIcon(gameData.sport)} />
                  <i>{playId.description}</i>
                </div>
                <div className="pc-reactionScore">
                  <i>
                    {reactionGameDescFormat(
                      playId.game.awayAbbreviation,
                      playId.game.homeAbbreviation,
                      playId.specificData
                    )}
                  </i>
                </div>
              </div>

              <div className="pc-buttons">
                <LikeButton
                  user={userME}
                  receiver={user.id}
                  post={{ id, likes, likeCount }}
                />
                <MyPopup content="Commment on post" inverted>
                  <Button labelPosition="right" as={Link} to={`/reacts/${id}`}>
                    <Button color="blue" basic>
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {userME && userME.username === post.username && (
                  <div
                    style={{
                      display: "inline-block",
                      color: "gray",
                      float: "right",
                    }}
                  >
                    <DeleteButton postId={id} />
                  </div>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      </>
    );

  if (post != null) {
    console.log("111111");
    return PostGameMarkup;
  } else {
    console.log("222222");
    return PostGameMarkup;
  }
}

export default ReactionCard;
