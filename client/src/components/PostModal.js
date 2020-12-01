import React from 'react';
import { Button, Form, Transition } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from "@apollo/react-hooks";

import { useForm } from '../util/hooks';

import LeagueSelection from './LeagueSelection';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import { FETCH_GAMEPRES_QUERY } from '../util/graphql';

function PostForm(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const { gamesLoading, data: { getGamePres: gamepres } = {} } = useQuery(
    FETCH_GAMEPRES_QUERY
  );
  

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
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <LeagueSelection/>

          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;