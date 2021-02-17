import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../../util/MyPopup";

import "./PostCard.css";

import { AuthContext } from "../../context/auth";
import LikeButton from "../Buttons/LikeButton";
import DeleteButton from "../Buttons/DeleteButton";

import { FETCH_POSTS_QUERY } from "../../util/graphql";
import { betDescFormat } from "../../util/Extensions/betDescFormat";
import { betTimeFormat } from "../../util/Extensions/betTimeFormat";
import { liveGameDescFormat } from "../../util/Extensions/liveGameDescFormat";
import { postGameDescFormat } from "../../util/Extensions/postGameDescFormal";
import { determineBetResult } from "../../util/Extensions/betCalculations";

function PostCard({
  post: {
    body,
    gameArray,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
    user,
  } = {},
}) {
  const { userME } = useContext(AuthContext);

  let PreGameMarkup = (
    <>
      <Card
        fluid
        floated="right"
        rasied="false"
        style={{ width: "100%" }}
        as={Link}
        to={`/posts/${id}`}
      >
        <Card.Content>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${username}`}>
              {user.name} @{username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            {gameArray[0].gameId == null ? (
              <div className="pc-bet">Failed to load game data :-(</div>
            ) : (
              <div className="pc-bet">
                {betDescFormat(gameArray[0].betType, gameArray[0].betAmount, gameArray[0].gameId)} ·{" "}
                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "normal",
                    fontStyle: "italic",
                  }}
                >
                  {gameArray[0].gameId.awayAbbreviation} @ {gameArray[0].gameId.homeAbbreviation},{" "}
                  {betTimeFormat(gameArray[0].gameId.startTime)}
                </div>
              </div>
            )}

            <div className="pc-betBody">{body}</div>
            <div className="pc-buttons">
              <Button onClick={(e) => console.log(userME)}>userME</Button>
              <LikeButton user={userME} receiver= {user.id} post={{ id, likes, likeCount }} />
              <MyPopup content="Commment on post" inverted>
                <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                  <Button color="blue" basic>
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {userME && userME.username === username && (
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

  let LiveGameMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${username}`}>
              {user.name} @{username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            {gameArray[0].gameId == null ? (
              <div className="pc-bet">Failed to load game data :-(</div>
            ) : (
              <div className="pc-bet">
                {betDescFormat(gameArray[0].betType, gameArray[0].betAmount, gameArray[0].gameId)} ·{" "}
                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "normal",
                    fontStyle: "italic",
                  }}
                >
                  LIVE: {liveGameDescFormat(gameArray[0].gameId)}
                </div>
              </div>
            )}

            <div className="pc-betBody">{body}</div>
            <div className="pc-buttons">
              <LikeButton user={userME} receiver= {user.id} post={{ id, likes, likeCount }} />
              <MyPopup content="Commment on post" inverted>
                <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                  <Button color="blue" basic>
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {userME && userME.username === username && (
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

  let PostGameMarkup = (
    <>
      <Card fluid floated="right" style={{ width: "100%" }}>
        <Card.Content>
          <div
            style={{ display: "inline-block", width: "auto", height: "100%" }}
          >
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              ></img>
            </div>
          </div>
          <div className="pc-header">
            <Link to={`/user/${username}`}>
              {user.name} @{username}
            </Link>
            <div
              style={{ display: "inline-block", color: "gray", float: "right" }}
            >
              {moment(createdAt).fromNow(true)} ago
            </div>

            {gameArray[0].gameId == null ? (
              <div className="pc-bet">Failed to load game data :-(</div>
            ) : (
              <div className="pc-bet">
                <div
                  className={determineBetResult(
                    gameArray[0].gameId.homeScore,
                    gameArray[0].gameId.awayScore,
                    gameArray[0].betType,
                    gameArray[0].betAmount
                  )}
                >
                  {betDescFormat(gameArray[0].betType, gameArray[0].betAmount, gameArray[0].gameId)}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "normal",
                    fontStyle: "italic",
                  }}
                >
                  · {postGameDescFormat(gameArray[0].gameId)}
                </div>
              </div>
            )}

            <div className="pc-betBody">{body}</div>
            <div className="pc-buttons">
              <LikeButton user={userME} receiver= {user.id} post={{ id, likes, likeCount }} />
              <MyPopup content="Commment on post" inverted>
                <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                  <Button color="blue" basic>
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {userME && userME.username === username && (
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

  if (gameArray[0].gameId.stateDetails === "STATUS_SCHEDULED") {
    return PreGameMarkup;
  } else if (gameArray[0].gameId.stateDetails === "STATUS_IN_PROGRESS") {
    return LiveGameMarkup;
  } else if (gameArray[0].gameId.stateDetails === "STATUS_FINAL") {
    return PostGameMarkup;
  } else;
}

export default PostCard;
