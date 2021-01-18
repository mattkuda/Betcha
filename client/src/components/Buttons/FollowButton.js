import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import MyPopup from "../../util/MyPopup";

function FollowButton({ user, followeeUser: { id, followers } }) {
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (user && followers.find((follower) => follower.followerId === user.id)) {
      setFollowed(true);
    } else setFollowed(false);
  }, [user, followers]);

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: { followeeId: id },
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION_MUTATION, {
    variables: { objectType: "follow", objectId: id, receiver: id },
  });

  const handleButtonClick = async () => {
    await followUser();

    try {
      await createNotification();
    } catch (error) {
      console.log(error);
    }
  };

  //If already followed, then fill in the like button
  //If not logged in, onClick takes to login page

  const FollowButton = user ? (
    followed ? (
      <Button as="div" onClick={handleButtonClick} color="teal">
        Following <Icon fitted name="checkmark" />
      </Button>
    ) : (
      <Button as="div" onClick={handleButtonClick} color="teal" basic>
        Follow <Icon fitted name="plus" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      Follow <Icon fitted name="plus" />
    </Button>
  );

  return user && user.id !== id ? (
    <MyPopup content={followed ? "Following" : "Follow"}>
      {FollowButton}
    </MyPopup>
  ) : (
    <></>
  );
}

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($followeeId: ID!) {
    followUser(followeeId: $followeeId) {
      id
      followers {
        id
        followerId
      }
      followersCount
    }
  }
`;

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification(
    $objectType: String = "follow"
    $objectId: ID = ""
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

export default FollowButton;
