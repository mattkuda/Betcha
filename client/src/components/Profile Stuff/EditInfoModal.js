import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../../util/hooks";

import { FETCH_POSTS_QUERY } from "../../util/graphql";

function EditInfoModal(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    name: "",
    bio: props.testBio,
    location: "",
    website: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      //If successful, close modal
      props.handleClose();
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
      values.betType = "";
      values.betAmount = "";
      values.gameId = "";
    },
    //Added this so the page doesnt break
    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Input
          label="Name"
          placeholder="name"
          name="name"
          type="text"
          value={values.name}
          onChange={onChange}
        />
        <Form.Input
          label="Bio"
          placeholder="bio"
          name="bio"
          type="text"
          value={values.bio}
          onChange={onChange}
        />
        <Form.Input
          label="Location"
          placeholder="location"
          name="location"
          type="text"
          value={values.location}
          onChange={onChange}
        />
        <Form.Input
          label="Website"
          placeholder="website"
          name="website"
          type="text"
          value={values.website}
          onChange={onChange}
        />
        <Button type="Submit" primary>
          {" "}
          Save
        </Button>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $body: String!
    $betType: String!
    $betAmount: String!
    $gameId: String!
  ) {
    createPost(
      body: $body
      betType: $betType
      betAmount: $betAmount
      gameId: $gameId
    ) {
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

export default EditInfoModal;
