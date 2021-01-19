const { gql } = require("apollo-server");
const mongoose = require("mongoose");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    betType: String!
    betAmount: String!
    gameId: Mastergame!

    user: User!
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
    bio: String
    website: String
    location: String
    name: String
    followers: [Follower]!
    following: [Following]!
    followersCount: Int!
    followingCount: Int!
    notificationCount: Int
  }
  type Follower {
    id: ID!
    followerId: ID!
    createdAt: String!
  }
  type Following {
    id: ID!
    followeeId: ID!
    createdAt: String!
  }

  type Notification {
    id: ID!
    objectType: String!
    objectId: String!
    createdAt: String!
    readAt: String
    sender: User!
    receiver: User!
  }

  type Reaction {
    id: ID!
    user: User!
    play: Play!
    body: String!
    createdAt: String!
  }

  type MixedPregameData {
    weatherDescription: String
    homeRank: Int
    awayRank: Int
  }

  type MixedLivegameData {
    homeRank: Int
    awayRank: Int
    down: Int
    distance: Int
    yardLine: Int
    isRedZone: Boolean
    possession: String
  }

  type MixedPostgameData {
    homeRank: Int
    awayRank: Int
  }

  type TopEvent {
    id: ID!
    game: Mastergame
    rank: Int!
    gameState: String!
  }

  type Pregame {
    id: ID!
    gameId: String!
    state: String!
    stateDetails: String!
    sport: String!
    league: String!
    homeLogo: String!
    awayLogo: String!
    homeAbbreviation: String!
    awayAbbreviation: String!
    homeFullName: String!
    awayFullName: String!
    homeColor: String!
    awayColor: String!
    homeRecord: String!
    awayRecord: String!
    startTime: String
    broadcasts: [String]
    spread: String!
    overUnder: Float!
    specificData: MixedPregameData
  }

  type Livegame {
    id: ID!
    gameId: String!
    state: String!
    stateDetails: String!
    sport: String!
    league: String!
    homeLogo: String!
    awayLogo: String!
    homeScore: Int!
    awayScore: Int!
    homeAbbreviation: String!
    awayAbbreviation: String!
    homeFullName: String!
    awayFullName: String!
    homeColor: String!
    awayColor: String!
    homeRecord: String!
    awayRecord: String!
    startTime: String!
    broadcasts: [String]
    time: String!
    period: Int!
    spread: String!
    overUnder: Float!
    lastPlay: String!
    specificData: MixedLivegameData
  }

  type Postgame {
    id: ID!
    gameId: String!
    state: String!
    stateDetails: String!
    sport: String!
    league: String!
    homeLogo: String!
    awayLogo: String!
    homeScore: Int!
    awayScore: Int!
    homeAbbreviation: String!
    awayAbbreviation: String!
    homeFullName: String!
    awayFullName: String!
    homeColor: String!
    awayColor: String!
    homeRecord: String!
    awayRecord: String!
    homeLines: [Int]!
    awayLines: [Int]!
    spread: String!
    overUnder: Float!
    spreadWinner: String!
    ouResult: String!
    specificData: MixedPostgameData
  }

  type Mastergame {
    id: ID
    gameId: String
    state: String
    stateDetails: String
    sport: String
    league: String
    homeLogo: String
    awayLogo: String
    homeScore: Int
    awayScore: Int
    homeAbbreviation: String
    awayAbbreviation: String
    homeFullName: String
    awayFullName: String
    homeColor: String
    awayColor: String
    homeRecord: String
    awayRecord: String
    homeLines: [Int]
    awayLines: [Int]
    startTime: String
    broadcasts: [String]
    time: String
    period: Int
    spread: String
    overUnder: Float
    lastPlay: String
    spreadWinner: String
    ouResult: String
  }

  type StaticGameInfo {
    id: ID!
    gameId: String!
    sport: String!
    league: String!
    homeLogo: String!
    awayLogo: String!
    homeAbbreviation: String!
    awayAbbreviation: String!
    homeFullName: String!
    awayFullName: String!
    homeColor: String!
    awayColor: String!
    homeRecord: String!
    awayRecord: String!
    spread: String!
    overUnder: Float!
    specificData: MixedPregameData!
  }

  type Play {
    id: ID!
    playId: String!
    game: StaticGameInfo
    reactions: [Reaction]
    description: String!
    createdAt: String!
    specificData: MixedPlayData!
  }

  type MixedPlayData {
    homeScore: Int
    awayScore: Int
    time: String
    period: Int
    down: Int
    distance: Int
    yardLine: Int
    possession: String
  }

  type League {
    id: ID!
    displayName: String!
    sportName: String!
    leagueName: String!
    image: String!
    isActive: Boolean!
  }

  # TODO
  #type BetInfoLive {

  # }

  # TODO
  #type BetInfoPost {

  # }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
    getUser(username: String!): User
    getUserPosts(username: String!): [Post]
    getUserNotifications: [Notification]
    getAllUsers: [User]
    getLeagues: [League]
    getActiveLeagues: [League]
    getPost(postId: ID!): Post
    getAllPregames: [Pregame]
    getPregamesByLeague(league: String!): [Pregame]
    getLivegamesByLeague(league: String!): [Livegame]
    getPostgamesByLeague(league: String!): [Postgame]
    getTopEvents: [TopEvent]
    getPlay(playId: String!): Play
    getPlaysInGame(gameId: String!): [Play]
    getPlaysInGameInPeriod(gameId: String!, period: Int!): [Play]
    getAllReactions: [Reaction]
    getReactionsForPlay(playId: String!): [Reaction]
    getReactionsForUser(userId: String!): [Reaction]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(
      body: String!
      betType: String!
      betAmount: String!
      gameId: String!
    ): Post!
    createNotification(
      objectType: String!
      objectId: ID!
      receiver: ID!
    ): Notification
    updateInfo(
      name: String!
      bio: String!
      location: String!
      website: String!
    ): User!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    createReaction(body: String!, playId: String!): Reaction!
    followUser(followeeId: ID!): User!
  }

  type Subscription {
    newPost: Post!
  }
`;
