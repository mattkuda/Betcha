import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
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
import { Link } from "react-router-dom";

import LikeButton from "../components/Buttons/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/Buttons/DeleteButton";
import MyPopup from "../util/MyPopup";
import { betDescFormat } from "../util/Extensions/betDescFormat";
import { betTimeFormat } from "../util/Extensions/betTimeFormat";
import { reactionGameDescFormat } from "../util/Extensions/liveGameDescFormat";
import { contextualizeBet } from "../util/Extensions/liveGameDescFormat";

import './SingleReactionPage.css';

function SingleReaction(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  function findIcon(input) {
    switch (input) {
      case "basketball":
        return "basketball ball";
      case "football":
        return "football ball";
      case "hockey":
        return "hockey puck";
      case "soccer":
        return "soccer";
      default:
        return "talk";
    }
  }

  const { values } = useForm(createNotifCallback, {
    receiverId: "",
  });

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  ///YOU ARE BUILDING NOTIFS FOR COMMENTS

  const [createNotification] = useMutation(CREATE_NOTIFICATION_MUTATION, {
    variables: {
      objectType: "comment",
      objectId: postId,
      receiver: values.receiverId,
    },
  });

  const [comment, setComment] = useState("");

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    refetchQueries: [`getPost(postId: $postId)`],

    update() {
      commentInputRef.current.blur();
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function createNotifCallback() {
    createNotification();
  }

  const handleButtonClick = async () => {
    await submitComment();
    try {
      await createNotification();
    } catch (error) {
      console.log(error);
    }
  };

  function deletePostCallback() {
    props.history.push("/");
  }

  //Depends on whether we have data from query yet
  let postMarkup;

  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      user,
      playId,
      createdAt,
      post,
      comments,
      commentCount,
      likeCount,
      likes,
      username,
    } = getPost;

    values.receiverId = getPost.user.id;

    console.log("The post is: " + JSON.stringify(post));
    const betData =
      post != null
        ? post.gameArray.find((o) => o.gameId.gameId === playId.game.gameId)
        : null;

    const gameData = playId.game;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src={`${user.profilePicture}`} size="small" float="right" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>

                {post ? (
                  <>
                    <div className="rc-header">
                      
                      <div className="rc-betBody">{body}</div>
                      <div className="rc-reactionScore">
                        has the bet {contextualizeBet(betData)}
                      </div>
                      <div
                        style={{
                          border: "solid #e3e3e3 2px",
                          padding: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <div className="rc-betBody">
                          <Icon name={findIcon(gameData.sport)} />
                          <i>{playId.description}</i>
                        </div>
                        <div className="rc-reactionScore">
                          <i>
                            {reactionGameDescFormat(
                              playId.game.awayAbbreviation,
                              playId.game.homeAbbreviation,
                              playId.specificData
                            )}
                          </i>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rc-header">
                      
                      <div className="rc-betBody">{body}</div>
                      <div
                        style={{
                          border: "solid #e3e3e3 2px",
                          padding: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <div className="rc-betBody">
                          <Icon name={findIcon(gameData.sport)} />
                          <i>{playId.description}</i>
                        </div>
                        <div className="rc-reactionScore">
                          <i>
                            {reactionGameDescFormat(
                              playId.game.awayAbbreviation,
                              playId.game.homeAbbreviation,
                              playId.specificData
                            )}
                          </i>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("The user is: " + user)}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>

                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disable={comment.trim() === ""}
                        onClick={handleButtonClick}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      postType
      body
      betOdds
      post {
        id
        body
        username
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
          gameId
          sport
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
        specificData {
          homeScore
          awayScore
          time
          half
          quarter
          possession
        }
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

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification(
    $objectType: String = "comment"
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

export default SingleReaction;
