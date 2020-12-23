import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import MyPopup from "../../util/MyPopup";

function FollowButton({ user, followeeUser: {id, followers} }) {
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (user && followers.find((follower) => follower.followerId === user.id)) {
      setFollowed(true);
    } else setFollowed(false);
  }, [user, followers]);

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: { followeeId: id },
  });

  //If already followed, then fill in the like button
  //If not logged in, onClick takes to login page

  const FollowButton = user ? (
    followed ? (
      <Button as="div"  onClick={followUser} color="teal">
        Following <Icon fitted name="checkmark" />
      </Button>
    ) : (
      <Button as="div" onClick={console.log("the id of followee: " + id)}  onClick={followUser} color="teal" basic>
        Follow <Icon fitted name="plus" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      Follow <Icon fitted name="plus" />
    </Button>
  );

  return (
      user.id !== id ? <MyPopup content={followed ? "Following" : "Follow"}>{FollowButton}</MyPopup> : <></>
      
  
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

export default FollowButton;