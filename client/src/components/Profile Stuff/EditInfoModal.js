import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../../util/hooks";

import { FETCH_POSTS_QUERY } from "../../util/graphql";

function EditInfoModal(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(updateInfoCallback, {
    name: props.name,
    bio: props.bio,
    location: props.location,
    website: props.website,
  });

  const [updateInfo, { error }] = useMutation(UPDATE_INFO_MUTATION, {
    variables: values,
    update(proxy, result) {
      //If successful, close modal
      props.handleClose();
      
      
    },
    //Added this so the page doesnt break
    onError(err) {
      return err;
    },
  });

  function updateInfoCallback() {
    updateInfo();
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

const UPDATE_INFO_MUTATION = gql`
  mutation updateInfo(
    $name: String!
    $bio: String!
    $location: String!
    $website: String!
  ) {
    updateInfo(
      name: $name
      bio: $bio
      location: $location
      website: $website
    ) {
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

export default EditInfoModal;
