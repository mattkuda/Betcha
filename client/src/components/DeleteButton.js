import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Button, Icon, Confirm, Dropdown } from "semantic-ui-react";
import MyPopup from "../util/MyPopup";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    //Once we reach here, post has been deleted, so need to close the modal

    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        // const data = proxy.readQuery({
        //   query: FETCH_POSTS_QUERY
        // });
        // //Filter out all posts that aren't the one we just deleted
        // data.getPosts = data.getPosts.filter(p => p.id !== postId);
        // proxy.writeQuery({query: FETCH_POSTS_QUERY, data});
        //We may not have a callback (like in PostCard)
      }

      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        {/* <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button> */}
        <Dropdown as="div" floated="right" item text="More">
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setConfirmOpen(true)}>Delete</Dropdown.Item>
            <Dropdown.Item onClick={() => console.log("Link copied!")}>Copy Link (todo)</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
