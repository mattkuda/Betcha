import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../util/MyPopup";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import { betDescFormat } from "../util/Extensions/betDescFormat";
import { betTimeFormat } from "../util/Extensions/betTimeFormat";

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
    <Card fluid  floated="right" style={{width: "100%"}}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
        />
        <Card.Header as={Link} to={`/user/${username}`}>
          @{username} ·{" "}
          <div style={{ display: "inline-block", color: "gray" }}>
            {moment(createdAt).fromNow(true)} ago
          </div>
        </Card.Header>
        {/* Condtional Game formatting based on fields */}
        <Card.Description style={{ fontStyle: "italic" }}>
          {betDescFormat(betType, betAmount, gameId)}
        </Card.Description>

        <Card.Description style={{ fontStyle: "italic" }}>
        {gameId.awayAbbreviation} @ {gameId.homeAbbreviation}, {betTimeFormat(gameId.startTime)}
        </Card.Description>
        <Card.Description>This is the body: {body}</Card.Description>
        <Card.Description as={Link} to={`/posts/${id}`}>View More ...</Card.Description>
      </Card.Content>
      <Card.Content extra>
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

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
