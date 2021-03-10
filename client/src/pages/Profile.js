import React, { useContext, useState, useRef } from "react";
import { Waypoint } from "react-waypoint";
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
import ReactionCard from "../components/ReactionCard/ReactionCard";
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

  const {loading, data: { getUserPosts: posts } = {}, fetchMore } = useQuery(
    FETCH_USER_POSTS_QUERY,
    {variables: {first: 20, offset: 0, profileUsername }}
  );

  const [modalOpen, setModalOpen] = useState(false);

  //Depends on whether we have data from query yet
  let userMarkup;

  // if (!getUser || !getUserPosts) {
  if (!getUser || loading) {
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
      profilePicture,
      createdAt,
      followingCount,
      followersCount,
      followers,
    } = getUser;
 

    userMarkup = (
      <>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          closeIcon
          // dimmer="blurring"
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
        <Grid >
          <Grid.Row>
            <Grid.Column width={2}>
              <Image src={profilePicture} size="small" float="right" />
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
                      <a
                        href={`https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
              posts.map((item, i) =>
                item.postType === "P" ? (
                  <>
                    <PostCard post={item} key={item.id} />
                    {i === posts.length - 5 && (
                      <Waypoint
                        onEnter={() =>
                          fetchMore({
                            variables: {
                              first: 20,
                              offset: posts.length - 1,
                            },
                            updateQuery: (pv, { fetchMoreResult }) => {
                              if (!fetchMoreResult) {
                                return pv;
                              }
                              //console.log("The posts are: " +posts)
                              console.log("The pv are: " + JSON.stringify(pv));
                              //console.log("The fetchMoreResult are: " + JSON.stringify(fetchMoreResult))
                              return {
                                __typename: "Post",
                                getUserPosts: [
                                  ...pv.getUserPosts,
                                  ...fetchMoreResult.getUserPosts,
                                ],
                                hasNextPage: true,
                              };
                            },
                          })
                        }
                      />
                    )}
                  </>
                ) : (
                  <>
                    <ReactionCard reaction={item} key={item.id} />
                    {i === posts.length - 5 && (
                      <Waypoint
                        onEnter={() =>
                          fetchMore({
                            variables: {
                              first: 20,
                              offset: posts.length - 1,
                            },
                            updateQuery: (pv, { fetchMoreResult }) => {
                              if (!fetchMoreResult) {
                                return pv;
                              }
                              //console.log("The posts are: " +posts)
                              console.log("The pv are: " + JSON.stringify(pv));
                              //console.log("The fetchMoreResult are: " + JSON.stringify(fetchMoreResult))
                              return {
                                __typename: "Post",
                                getUserPosts: [
                                  ...pv.getUserPosts,
                                  ...fetchMoreResult.getUserPosts,
                                ],
                                hasNextPage: true,
                              };
                            },
                          })
                        }
                      />
                    )}
                  </>
                )
              )}
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
      profilePicture
      website
      followers {
        followerId
      }
      following {
        followeeId
      }
      followingCount
      followersCount
      notificationCount
    }
  }
`;

export const FETCH_USER_POSTS_QUERY = gql`
  query($profileUsername: String!, $first: Int!, $offset: Int!) {
    getUserPosts(username: $profileUsername, first: $first, offset: $offset,) {
      id
      postType
      body
      betOdds
      post {
        id
        body
        betOdds
        gameArray {
          gameId {
            gameId
            stateDetails
            homeScore
            awayScore
            period
            time
            awayAbbreviation
            homeAbbreviation
            awayScore
            homeScore
            spread
            overUnder
          }
          betType
          betAmount
        }
      }
      playId {
        game {
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
        description
      }
      gameArray {
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
        betType
        betAmount
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      user {
        id
        name
        profilePicture
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
