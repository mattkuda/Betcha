import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider, AuthContext } from "./context/auth";
import AuthRoute from './util/AuthRoute';

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import ScoreboardNav from "./components/ScoreboardNav";
import ScoreboardHome from "./pages/ScoreboardHome";
import LeagueScoreboard from "./pages/LeagueScoreboard";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
          <Route exact path="/user/:usernameId" component={Profile} />
          <Route path="/scoreboard">
            <ScoreboardNav />
          </Route>
          <Route exact path="/scoreboard" component={ScoreboardHome} />
          <Route exact path="/scoreboard/nfl">
            <LeagueScoreboard league="nfl" />
          </Route>
          <Route exact path="/scoreboard/college-football">
            <LeagueScoreboard league="college-football" />
          </Route>
          <Route exact path="/scoreboard/mens-college-basketball">
            <LeagueScoreboard league="mens-college-basketball" />
          </Route>
          <Route exact path="/scoreboard/nba">
            <LeagueScoreboard league="nba" />
          </Route>
          <Route exact path="/scoreboard/:league/:gameId" component={GameDetails} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
