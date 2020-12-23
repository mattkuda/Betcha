import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Image,
  Form,
  Card,
  Button,
  Icon,
  Label,
} from "semantic-ui-react";
import moment from "moment";

import PostCard from "../components/PostCard/PostCard";
import FollowButton from "../components/Buttons/FollowButton";
import { AuthContext } from "../context/auth";
import MyPopup from "../util/MyPopup";
import { betDescFormat } from "../util/Extensions/betDescFormat";
import { betTimeFormat } from "../util/Extensions/betTimeFormat";

function Profile(props) {
  const profileUsername = props.match.params.usernameId;
  const { user } = useContext(AuthContext);

  const { data: { getUser } = {} } = useQuery(FETCH_PROFILE_QUERY, {
    variables: {
      profileUsername,
    },
  });

  const { data: { getUserPosts } = {} } = useQuery(FETCH_USER_POSTS_QUERY, {
    variables: {
      profileUsername,
    },
  });

  //Depends on whether we have data from query yet
  let userMarkup;

  if (!getUser || !getUserPosts) {
    userMarkup = <p>Loading user...</p>;
  } else {
    const {
      id,
      username,
      createdAt,
      followingCount,
      followersCount,
      followers,
    } = getUser;
    const posts = getUserPosts;

    userMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>@{username}</Card.Header>
                <Card.Meta>
                  <FollowButton user={user} followeeUser={{ id, followers }} />
                </Card.Meta>
                <Card.Meta>
                  <Icon fitted name="calendar alternate outline" /> Joined{" "}
                  {moment(createdAt).format("MMMM Do, YYYY")}
                </Card.Meta>
                <Card.Meta>
                  Following: {followingCount} Followers: {followersCount}
                </Card.Meta>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {posts &&
            posts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
        </Grid.Row>
      </Grid>
    );
  }

  return userMarkup;
}

const FETCH_PROFILE_QUERY = gql`
  query($profileUsername: String!) {
    getUser(username: $profileUsername) {
      id
      username
      createdAt
      followers {
        followerId
      }
      following {
        followeeId
      }
      followingCount
      followersCount
    }
  }
`;

export const FETCH_USER_POSTS_QUERY = gql`
  query($profileUsername: String!) {
    getUserPosts(username: $profileUsername) {
      id
      body
      betType
      betAmount
      gameId {
        homeFullName
        awayFullName
        homeRecord
        awayRecord
        awayLogo
        homeLogo
        awayAbbreviation
        homeAbbreviation
        startTime
        broadcasts
        spread
        overUnder
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Profile;
