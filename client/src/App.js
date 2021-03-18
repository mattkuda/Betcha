import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Segment, Sidebar } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider, AuthContext } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import MenuBar from "./components/MenuBarStuff/MenuBar";
import MenuBarMobile from "./components/MenuBarStuff/MenuBarMobile";
import Home from "./pages/Home";
import MyBets from "./pages/MyBets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TestPage from "./pages/TestPage";
import NotificationsPage from "./pages/NotificationsPage";
import SinglePost from "./pages/SinglePost";
import SingleReaction from "./pages/SingleReaction";
import ScoreboardNav from "./components/ScoreboardNav";
import ScoreboardHome from "./pages/ScoreboardHome";
import LeagueScoreboard from "./pages/LeagueScoreboard";
import GameDetails from "./pages/GameDetails";
import NBADetails from "./pages/GamePages/NBADetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* add fluid = true to contatiner to make it full screen */}
        <Container>

          <div className="mobile hidden">
            <MenuBar />
          </div>
          <div className="mobile only">
            <MenuBarMobile />
          </div>
            <Route exact path="/" component={Home} />
            <Route exact path="/mybets" component={MyBets} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/posts/:postId" component={SinglePost} />
            <Route exact path="/reacts/:postId" component={SingleReaction} />
            <Route exact path="/user/:usernameId" component={Profile} />
            <Route exact path="/test" component={TestPage} />
            <Route exact path="/notifications" component={NotificationsPage} />
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
            <Route exact path="/scoreboard/nhl">
              <LeagueScoreboard league="nhl" />
            </Route>
            <Route exact path="/scoreboard/eng.1">
              <LeagueScoreboard league="eng.1" />
            </Route>
            <Route exact path="/scoreboard/usa.1">
              <LeagueScoreboard league="usa.1" />
            </Route>
            <Route exact path="/scoreboard/uefa.champions">
              <LeagueScoreboard league="uefa.champions" />
            </Route>
            <Route
              exact
              path="/scoreboard/:league/:gameId"
              component={GameDetails}
            />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
