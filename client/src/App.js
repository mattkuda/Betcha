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
import SinglePost from "./pages/SinglePost";
import ScoreboardNav from "./components/ScoreboardNav";
import ScoreboardHome from "./pages/ScoreboardHome";
import NFLScoreboard from "./pages/NFLScoreboard";
import NCAAFScoreboard from "./pages/NCAAFScoreboard";
import NCAABMensScoreboard from "./pages/NCAABMensScoreboard";
import NFLGameDetails from "./components/NFLGameDetails";

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
          <Route path="/scoreboard">
            <ScoreboardNav />
          </Route>
          <Route exact path="/scoreboard" component={ScoreboardHome} />
          <Route exact path="/scoreboard/nfl" component={NFLScoreboard} />
          <Route exact path="/scoreboard/ncaaf" component={NCAAFScoreboard} />
          <Route exact path="/scoreboard/ncaabmens" component={NCAABMensScoreboard} />
          <Route exact path="/scoreboard/nfl/:eventId" component={NFLGameDetails} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
