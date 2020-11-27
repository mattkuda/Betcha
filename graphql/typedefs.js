const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type NFLPregame {
    id: ID!,
    state: String!,
    sport: String!
    league: String!,
    homeLogo: String!,
    awayLogo: String!,
    homeAbbreviation: String!,
    awayAbbreviation: String!,
    homeFullName: String!,
    awayFullName: String!,
    homeColor: String!,
    awayColor: String!,
    startTime: String!,
    broadcasts: [String],
    homeRecord: String!,
    awayRecord: String!,
    spread: String!,
    overUnder: String!
  }

  type NFLLivegame {
    id: ID!,
    state: String!,
    sport: String!
    league: String!,
    homeLogo: String!,
    awayLogo: String!,
    homeScore: String!,
    awayScore: String!,
    homeAbbreviation: String!,
    awayAbbreviation: String!,
    homeFullName: String!,
    awayFullName: String!,
    homeColor: String!,
    awayColor: String!,
    startTime: String!,
    broadcasts: [String],
    homeRecord: String!,
    awayRecord: String!,
    time: String!,
    period: Int!,
    spread: String!,
    overUnder: String!,
    lastPlay: String!,
    downAndDistance: String!,
    homeTimeouts: Int!,
    awayTimeouts: Int!
  }

  type NFLPostgame {
    id: ID!,
    state: String!,
    sport: String!
    league: String!,
    homeLogo: String!,
    awayLogo: String!,
    homeScore: String!,
    awayScore: String!,
    homeAbbreviation: String!,
    awayAbbreviation: String!,
    homeFullName: String!,
    awayFullName: String!,
    homeColor: String!,
    awayColor: String!,
    startTime: String!,
    broadcasts: [String],
    homeRecord: String!,
    awayRecord: String!,
    spread: String!,
    overUnder: String!,
    homeLines: [Int],
    awayLines: [Int]
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getNFLPregames: [NFLPregame]
    getNFLLivegames: [NFLLivegame]
    getNFLPostgames: [NFLPostgame]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription{
    newPost: Post!
  }
`;
