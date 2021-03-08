import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../../util/hooks";

function ReactionModal(props) {

  const { values, onChange, onSubmit } = useForm(createPostReactionCallback, {
    body: "",
    playId: props.play.playId
  });


  const [createPostReaction, { error }] = useMutation(CREATE_POST_REACTION_MUTATION, {
    variables: values,
    update(proxy, result) {
      // //update the cache
      // const data = proxy.readQuery({
      //   query: FETCH_REACTIONS_QUERY,
      // });
      // proxy.writeQuery({
      //   query: FETCH_REACTIONS_QUERY,
      //   data: {
      //     getAllReactions: [result.data.createPostReaction, ...data.getAllReactions],
      //   },
      // });
      values.body = "";
      values.playId = "";
    },
    //Added this so the page doesnt break
    onError(err) {
      return err;
    },
  });


  function createPostReactionCallback() {
    createPostReaction();
    props.handleClose();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Field>

          <h2>Play Reaction</h2>

          <div>
            <p>Description: {props.play.description}</p>
          </div>

          <Form.Input
            placeholder="Share your reaction..."
            noValidate
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />

          <Button
            type="submit"
            color="teal"
            onClick={() => console.log(values)}
          >
            Submit
          </Button>
        </Form.Field>
      </Form>
    </>
  );
}

const FETCH_REACTIONS_QUERY = gql`
{
  getAllReactions {
    id
    user {
      username
    }
    play {
      description
    }
    body
    createdAt
  }
}
`;


const CREATE_POST_REACTION_MUTATION = gql`
  mutation createPostReaction($body: String!, $playId: String!) {
    createPostReaction(body: $body, playId: $playId) {
      id
      
    }
  }
`;

export default ReactionModal;
