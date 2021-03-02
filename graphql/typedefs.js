const { gql } = require("apollo-server");
const mongoose = require("mongoose");

module.exports = gql`

  #
  #Post related items
  #

  type Post {
    id: ID!
    body: String!
    # tease: Boolean
    gameArray: [gameBet]!
    betOdds: String!
    user: User!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
  }

  type gameBet{
    gameId: Mastergame!
    betType: String!
    betAmount: String!
  }

  input gameBetInput{
    gameId: String!
    betType: String!
    betAmount: String!
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

  #
  #User related items
  #

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    bio: String
    profilePicture: String
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

  #
  #Reaction related items
  #

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
    homeId: Int!
    awayId: Int!
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
    spread: Float!
    homeSpreadOdds: Float!
    awaySpreadOdds: Float!
    favoredTeamId: Int!
    favoredTeam: String!
    overUnder: Float!
    overOdds: Float!
    underOdds: Float!
    homeML: Int!
    awayML: Int!
    playByPlayAvailable: Boolean!
    location: String!
    specificData: MixedPregameData
  }

  type Livegame {
    id: ID!
    gameId: String!
    state: String!
    stateDetails: String!
    sport: String!
    league: String!
    homeId: Int!
    awayId: Int!
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
    spread: Float!
    homeSpreadOdds: Float!
    awaySpreadOdds: Float!
    favoredTeamId: Int!
    favoredTeam: String!
    overUnder: Float!
    overOdds: Float!
    underOdds: Float!
    homeML: Int!
    awayML: Int!
    playByPlayAvailable: Boolean!
    location: String!
    time: String!
    period: Int!
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
    homeId: Int!
    awayId: Int!
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
    spread: Float!
    homeSpreadOdds: Float!
    awaySpreadOdds: Float!
    favoredTeamId: Int!
    favoredTeam: String!
    overUnder: Float!
    overOdds: Float!
    underOdds: Float!
    homeML: Int!
    awayML: Int!
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
    homeId: Int
    awayId: Int
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
    startTime: String
    broadcasts: [String]
    time: String
    period: Int
    spread: Float
    homeSpreadOdds: Int
    awaySpreadOdds: Int
    favoredTeamId: Int
    favoredTeam: String
    overUnder: Float
    overOdds: Int
    underOdds: Int
    homeML: Int
    awayML: Int
    lastPlay: String
    playByPlayAvailable: Boolean
    location: String
    spreadWinner: String
    ouResult: String
  }

  input MastergameInput {
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
    game: Mastergame
    reactions: [Reaction]
    description: String!
    scoreValue: Int!
    createdAt: String!
    specificData: MixedPlayData!
  }

  type MixedPlayData {
    homeScore: Int
    awayScore: Int
    time: String
    quarter: Int
    half: Int
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
    getTopPregameEvents: [TopEvent]
    getTopLivegameEvents: [TopEvent]
    getTopPostgameEvents: [TopEvent]
    getGameByID(gameId: String!): Mastergame
    getPlay(playId: String!): Play
    getPlaysInGame(gameId: String!): [Play]
    getPlaysInNBAGameInPeriod(gameId: String!, currentPeriod: Int!): [Play]
    getAllReactions: [Reaction]
    getReactionsForPlay(playId: String!): [Reaction]
    getReactionsForUser(userId: String!): [Reaction]
  }

  type Mutation {
    uploadFile(file: Upload!): Boolean
    uploadFile2(file: String!): Boolean
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(
      body: String!
      gameArray: [gameBetInput]
      betOdds: String
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
