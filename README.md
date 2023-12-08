## Betcha: Sports Social Media

<img src="https://github.com/mattkuda/Betcha/assets/60164656/8d7c7377-8794-43b7-9a09-2514d5ef55db" width="600">

### Overview
Betcha is a cutting-edge social media platform specifically designed for sports betting enthusiasts. It allows users to share their live sports bets, react to game plays in real-time, and stay connected with friends and the betting community. The app offers an engaging and interactive experience, integrating live sports data and social features to create a dynamic environment for sports fans.

### Features
- Live Bet Sharing: Post and share your sports bets with a community of friends and followers.
- Real-time Reactions: Interact with plays as they happen during the game, showing your support or disappointment.
- Community Engagement: Follow friends and like-minded bettors, comment on their bets, and join the conversation.
- Up-to-date Sports Data: Access the latest betting odds, live game scores, and performance trends.

### Technologies
Betcha is built using a robust stack of modern technologies ensuring fast, reliable, and scalable performance:

- MongoDB: A document-oriented NoSQL database used to store all application data.
- Express.js: A web application framework for Node.js, designed for building web applications and APIs.
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine, ideal for building fast and scalable network applications.
- React: A JavaScript library for building user interfaces, allowing for a dynamic and responsive client-side experience.
- GraphQL: A query language for APIs, providing a complete and understandable description of the data in the API.
- ESPN API: Third-party API integration for fetching the latest sports data, scores, and betting odds.

### Getting Started
#### Prerequisites
Before running Betcha locally, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB
- Nodemon (for development)

#### Running Locally
1. Clone the repository to your local machine.
2. Navigate to the root directory of the project.
3. Copy the config.example.js file to config.js and fill in the required secret keys and database URIs.
4. Install all dependencies by running npm install in both /services and /client directories.
5. To start the server, navigate to /services and execute nodemon index.js. To include the game service, use nodemon index.js g.
6. For the client-side, go to /client and run npm start to launch the React application.

### Demo
<img src="https://github.com/mattkuda/Betcha/assets/60164656/6e90b4be-185f-4122-a1d5-5eae63f8d93c" width="600">

Home Feed: Share and view bets, with real-time updates on friends' activities.

<img src="https://github.com/mattkuda/Betcha/assets/60164656/44e1b206-2e01-4bcb-b6d9-181ac8edaa18" width="600">

Sports Score Board: Live scores from ongoing games, with an intuitive and user-friendly interface.

<img src="https://github.com/mattkuda/Betcha/assets/60164656/833bdd4c-e198-49f1-bb40-6aa5ae30887b" width="600">

Game Play-by-Play: A detailed, play-by-play breakdown of the game as it unfolds, perfect for tracking the action that impacts your bets.

**Betcha brings sports betting into the social realm, letting you experience the thrill of the game with a community that shares your passion. Join us and place your bets on Betcha!**
