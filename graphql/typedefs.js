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


  type NFLPregameMixedData {
    weatherDescription: String
  }
  type NCAAFPregameMixedData {
    weatherDescription: String,
    homeRank: Int,
    awayRank: Int
  }
  type NCAABMensPregameMixedData {
    homeRank: Int,
    awayRank: Int
  }


  type NFLLivegameMixedData {
    down: Int!,
    distance: Int!,
    yardLine: Int!,
    isRedZone: Boolean!,
    possession: String!,
    awayTimeouts: Int!,
    homeTimeouts: Int!
  }
  type NCAAFLivegameMixedData {
    homeRank: Int!,
    awayRank: Int!,
    down: Int!,
    distance: Int!,
    yardLine: Int!,
    isRedZone: Boolean!,
    possession: String!,
    awayTimeouts: Int!,
    homeTimeouts: Int!
  }
  type NCAABMensLivegameMixedData {
    homeRank: Int!,
    awayRank: Int!,
    possession: String!,
    awayTimeouts: Int!,
    homeTimeouts: Int!
  }


  type NCAAFPostgameMixedData {
    homeRank: Int!,
    awayRank: Int!
  }
  type NCAABMensPostgameMixedData {
    homeRank: Int!,
    awayRank: Int!
  }


  type NFLPregame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    spread: String!,
    overUnder: String!,
    specificData: NFLPregameMixedData
  }
  type NCAAFPregame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    spread: String!,
    overUnder: String!,
    specificData: NCAAFPregameMixedData
  }
  type NCAABMensPregame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    spread: String!,
    overUnder: String!,
    specificData: NCAABMensPregameMixedData
  }


  type NFLLivegame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    time: String!,
    period: Int!,
    spread: String!,
    overUnder: String!,
    lastPlay: String!,
    specificData: NFLLivegameMixedData
  }
  type NCAAFLivegame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    time: String!,
    period: Int!,
    spread: String!,
    overUnder: String!,
    lastPlay: String!,
    specificData: NCAAFLivegameMixedData
  }
  type NCAABMensLivegame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    startTime: String!,
    broadcasts: [String],
    time: String!,
    period: Int!,
    spread: String!,
    overUnder: String!,
    lastPlay: String!,
    specificData: NCAABMensLivegameMixedData
  }


  type NFLPostgame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    homeLines: [Int],
    awayLines: [Int],
    spread: String!,
    overUnder: String!
  }
  type NCAAFPostgame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    homeLines: [Int],
    awayLines: [Int],
    spread: String!,
    overUnder: String!,
    specificData: NCAAFPostgameMixedData
  }
  type NCAABMensPostgame {
    id: ID!,
    state: String!,
    stateDetails: String!,
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
    homeRecord: String!,
    awayRecord: String!,
    homeLines: [Int],
    awayLines: [Int],
    spread: String!,
    overUnder: String!,
    specificData: NCAABMensPostgameMixedData
  }


  type FootballPlayData {
    homeScore: Int!,
    awayScore: Int!
    time: String!
    quarter: Int!
    down: Int!
    distance: Int!
    yardLine: Int!
    possession: String!
  }

  type NCAABMensPlayData {
    homeScore: Int!,
    awayScore: Int!
    time: String!
    half: Int!
    possession: String!
  }


  type FootballPlay {
    id: ID!,
    description: String!,
    eventId: ID!,
    specificData: FootballPlayData
  }

  type NCAABMensPlay {
    id: ID!,
    description: String!,
    eventId: ID!,
    specificData: NCAABMensPlayData
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
    getNCAAFPregames: [NCAAFPregame]
    getNCAAFLivegames: [NCAAFLivegame]
    getNCAAFPostgames: [NCAAFPostgame]
    getNCAABMensPregames: [NCAABMensPregame]
    getNCAABMensLivegames: [NCAABMensLivegame]
    getNCAABMensPostgames: [NCAABMensPostgame]
    getPlaysInNFLGame(gameId: ID!): [FootballPlay],
    getPlaysInNCAAFGame(gameId: ID!): [FootballPlay],
    getPlaysInNCAABMensGame(gameId: ID!): [NCAABMensPlay]
    getPlaysInNFLGameInPeriod(gameId: ID!, period: Int!): [FootballPlay],
    getPlaysInNCAAFGameInPeriod(gameId: ID!, period: Int!): [FootballPlay],
    getPlaysInNCAABMensGameInPeriod(gameId: ID!, period: Int!): [NCAABMensPlay]
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
