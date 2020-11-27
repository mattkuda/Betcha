import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
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

export const FETCH_GAMEPRES_QUERY = gql`
  {
    getGamePres {
      id
      broadcast
      sport
      league
      homeLogo
      awayLogo
      homeAbbreeviation
      awayAbbreeviation
      homeFullName
      awayFullName
      homeColor
      awayColor
      homeRecord
      awayRecord
      startTime
    }
  }
`;