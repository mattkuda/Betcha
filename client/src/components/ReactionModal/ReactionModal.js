import React, { useState } from "react";
import { Button, Form, Transition, Input } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../../util/hooks";

function ReactionModal(props) {
  const { values, onChange, onSubmit } = useForm(createPostReactionCallback, {
    body: "",
    playId: props.play.playId,
  });

  const [createPostReaction, { error }] = useMutation(
    CREATE_POST_REACTION_MUTATION,
    {
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
    }
  );

  function createPostReactionCallback() {
    createPostReaction();
    props.handleClose();
  }

  return (
    <div
      style={{ padding: "0px", margin: "0px", width: "100%", height: "100%" }}
    >
      <div
        centered
        style={{
          textAlign: "center",
          backgroundColor: "#f2f2f2",
          width: "100%",
          display: "block",
          borderBottom: "3px solid #545454",
        }}
      >
        <div
          style={{ display: "inline-block", padding: "15px", width: "100%" }}
        >
          <h2
            style={{
              color: "#545454",
              display: "inline-block",
              margin: "auto",
              textAlign: "center",
            }}
          >
            Share Reaction!
          </h2>
        </div>
      </div>

      <>
        <div className="betHeader">{props.play.description}</div>
        <div className="betTextBox">
          <Input
            placeholder="What you have to say about this play?"
            noValidate
            fluid
            size="big"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
            style={{ width: "80%", margin: "auto" }}
          />
        </div>
        <div className="betTextBox">
                
                <Button
                  type="button"
                  color="teal"
                  onClick={() => createPostReactionCallback()}
                >
                  Submit
                </Button>
              </div>
      </>
    </div>
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
