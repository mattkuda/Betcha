import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import MyPopup from "../../util/MyPopup";

function LikeButton({ user, receiver, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION_MUTATION, {
    variables: { objectType: "post", objectId: id, receiver: receiver },
  });

  const handleButtonClick = async () => {
    await likePost();
    console.log("ABOUT TO");
    console.log("receiver: " + receiver);
    console.log("id: " + id);
    try {
      if (true) { //TODO: User cant create notif for themself
        await createNotification();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //If already liked, then fill in the like button
  //If not logged in, onClick takes to login page

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={handleButtonClick}>
      <MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification(
    $objectType: String = "post"
    $objectId: ID!
    $receiver: ID!
  ) {
    createNotification(
      objectType: $objectType
      objectId: $objectId
      receiver: $receiver
    ) {
      id
    }
  }
`;

export default LikeButton;
