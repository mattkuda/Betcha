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

function PostCard({
  post: {
    body,
    betType,
    betAmount,
    gameId,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = {},
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid floated="right" style={{ width: "100%" }}>
      <Card.Content>
        <div style={{ display: "inline-block", width: "auto", height: "100%" }}>
          <div>
            <img
              className="pc-img"
              alt="profile-pic"
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
            ></img>
          </div>
        </div>
        <div className="pc-header">
          <Link to={`/user/${username}`}>@{username}</Link>
          <div
            style={{ display: "inline-block", color: "gray", float: "right" }}
          >
            {moment(createdAt).fromNow(true)} ago
          </div>

          {gameId == null ? (
            <div className="pc-bet">Failed to load game data :-(</div>
          ) : (
            <div className="pc-bet">
              {betDescFormat(betType, betAmount, gameId)} ·{" "}
              <div
                style={{
                  display: "inline-block",
                  fontWeight: "normal",
                  fontStyle: "italic",
                }}
              >
                {gameId.awayAbbreviation} @ {gameId.homeAbbreviation},{" "}
                {betTimeFormat(gameId.startTime)}
              </div>
            </div>
          )}

          <div className="pc-betBody">{body}</div>
          <div className="pc-buttons">
            <LikeButton user={user} post={{ id, likes, likeCount }} />
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
            {user && user.username === username && (
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
  );
}

export default PostCard;
