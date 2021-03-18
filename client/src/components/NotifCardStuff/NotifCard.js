import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../../util/MyPopup";

import "./NotifCard.css";

import { AuthContext } from "../../context/auth";

function NotifCard({
  notification: { createdAt, id, sender, readAt, objectType, objectId } = {},
}) {
  const { userME } = useContext(AuthContext);

  let LikeNotifMarkup = (
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
            style={{
              display: "inline-block",
              width: "auto",
              height: "100%",
              verticalAlign: "top",
              paddingTop: "20px",
            }}
          >
            <Icon name="heart" size="big" />
          </div>
          <div className="pc-header">
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={sender.profilePicture}
              ></img>
              <div
                style={{
                  display: "inline-block",
                  color: "gray",
                  float: "right",
                }}
              >
                {moment(createdAt).fromNow(true)} ago
              </div>
            </div>
            <Link to={`/user/${sender.username}`}>{sender.name}</Link> liked
            your post.
            {objectId == null ? (
              <div className="pc-bet">Failed to load game data :-(</div>
            ) : (
              <div className="pc-bet">{objectId.body}</div>
            )}
          </div>
        </Card.Content>
      </Card>
    </>
  );

  let FollowNotifMarkup = (
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
            style={{
              display: "inline-block",
              width: "auto",
              height: "100%",
              verticalAlign: "top",
              paddingTop: "20px",
            }}
          >
            <Icon name="user plus" size="big" />
          </div>
          <div className="pc-header">
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={sender.profilePicture}
              ></img>
              <div
                style={{
                  display: "inline-block",
                  color: "gray",
                  float: "right",
                }}
              >
                {moment(createdAt).fromNow(true)} ago
              </div>
            </div>
            <Link to={`/user/${sender.username}`}>{sender.name}</Link> followed
            you.
          </div>
        </Card.Content>
      </Card>
    </>
  );

  let CommentNotifMarkup = (
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
            style={{
              display: "inline-block",
              width: "auto",
              height: "100%",
              verticalAlign: "top",
              paddingTop: "20px",
            }}
          >
            <Icon name="comment" size="big" />
          </div>
          <div className="pc-header">
            <div>
              <img
                className="pc-img"
                alt="profile-pic"
                src={sender.profilePicture}
              ></img>
              <div
                style={{
                  display: "inline-block",
                  color: "gray",
                  float: "right",
                }}
              >
                {moment(createdAt).fromNow(true)} ago
              </div>
            </div>
            <Link to={`/user/${sender.username}`}>{sender.name}</Link> commented
            on your post.
            {objectId == null ? (
              <div className="pc-bet">Failed to load game data :-(</div>
            ) : (
              <div className="pc-bet">{objectId.body}</div>
            )}
          </div>
        </Card.Content>
      </Card>
    </>
  );

  if (objectType === "like") {
    return LikeNotifMarkup;
  } else if (objectType === "comment") {
    return CommentNotifMarkup;
  } else if (objectType === "follow") {
    return FollowNotifMarkup;
  } else return <div>Haven't built a notif card for this yet!</div>;
  // } else if (gameId.stateDetails === "STATUS_IN_PROGRESS") {
  //   return LiveGameMarkup;
  // } else if (gameId.stateDetails === "STATUS_FINAL") {
  //   return PostGameMarkup;
  // } else;
}

export default NotifCard;
