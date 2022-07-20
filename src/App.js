import { Component } from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import SignIn from "./Components/SignIn/SignIn";
import Exams from "./Components/Exams/Exams"


class App extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      navbar: true
    }
  }

  setToken = (token) => {
    this.setState({token});
    localStorage.setItem("token", token)
  }

  removeToken = () => {
    this.setState({token: ""})
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    this.setState({token});
    token && this.setState({navbar: false})
  }

  render() {
    return (
      <Router>
        {this.state.token ? "" : <NavBar />}
        <Routes>
            <Route path="/" element={this.state.token ? <Exams token={this.state.token} removeToken={this.removeToken} /> : <Navigate to="/SignIn" />} />
            <Route path="/register" element={this.state.token ? <Navigate to="/" /> : <Register setToken={this.setToken} />} />
            <Route path="/signin" element={this.state.token ? <Navigate to="/" /> : <SignIn setToken={this.setToken} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
