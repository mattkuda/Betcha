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
  Modal,
} from "semantic-ui-react";
import moment from "moment";

import PostCard from "../components/PostCard/PostCard";
import FollowButton from "../components/Buttons/FollowButton";
import { AuthContext } from "../context/auth";
import MyPopup from "../util/MyPopup";
import { betDescFormat } from "../util/Extensions/betDescFormat";
import { betTimeFormat } from "../util/Extensions/betTimeFormat";
import { Link } from "react-router-dom";
import EditInfoModal from "../components/Profile Stuff/EditInfoModal";

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

  const [modalOpen, setModalOpen] = useState(false);

  //Depends on whether we have data from query yet
  let userMarkup;

  // if (!getUser || !getUserPosts) {
  if (!getUser || !getUserPosts) {
    //todo fix
    userMarkup = <p>Loading user...</p>;
  } else {
    const {
      id,
      username,
      location,
      name,
      bio,
      website,
      createdAt,
      followingCount,
      followersCount,
      followers,
    } = getUser;
    const posts = getUserPosts;

    userMarkup = (
      <>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          closeIcon
          dimmer="blurring"
          style={{ height: "90%" }}
        >
          <Modal.Header>Edit Profile</Modal.Header>
          <Modal.Content image scrolling>
            <EditInfoModal
              handleClose={(e) => setModalOpen(false)}
              name={name}
              bio={bio}
              location={location}
              website={website}
            />
          </Modal.Content>
        </Modal>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                size="small"
                float="right"
              />
            </Grid.Column>
            <Grid.Column width={14}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>
                    {name} @{username}
                    {user && user.username === profileUsername && (
                      <Button onClick={(e) => setModalOpen(true)}>
                        Edit profile
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Meta>
                    <FollowButton
                      user={user}
                      followeeUser={{ id, followers }}
                    />
                  </Card.Meta>
                  {bio && <Card.Meta>{bio}</Card.Meta>}
                  <Card.Meta>
                    <Icon fitted name="calendar alternate outline" /> Joined{" "}
                    {moment(createdAt).format("MMMM Do, YYYY")}
                  </Card.Meta>
                  {location && (
                    <Card.Meta>
                      <Icon fitted name="map pin" /> {location}
                    </Card.Meta>
                  )}
                  {website && (
                    <Card.Meta>
                      <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
                        <Icon fitted name="linkify" /> {website}
                      </a>
                    </Card.Meta>
                  )}

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
                <Grid.Column
                  key={post.id}
                  style={{ marginBottom: 20 }}
                  width={16}
                >
                  <Link
                    to={`/posts/${post.id}`}
                    style={{ textDecoration: "normal" }}
                  >
                    <span className="card" style={{ display: "block" }}>
                      <PostCard post={post} />
                    </span>
                  </Link>
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>{" "}
      </>
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
      name
      location
      bio
      website
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
        stateDetails
        homeRecord
        awayRecord
        homeScore
        awayScore
        period
        time
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
      user{
        name
      }
    }
  }
`;

export default Profile;
