import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import ProfileBlock from "./components/ProfileBlock";
//require("dotenv").config();

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="App__content">
          <Feed />
          <ProfileBlock />
        </main>
      </div>
    </Router>
  );
};

export default App;
