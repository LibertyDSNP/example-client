import React from "react";
import "./App.scss";
import "antd/dist/antd.less";
import Header from "./components/Header";
import Feed from "./components/Feed";
import Profile from "./components/Profile";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main className="Content__block">
        <Feed />
        <Profile />
      </main>
    </div>
  );
};

export default App;
