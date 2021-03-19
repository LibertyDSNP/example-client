import React from "react";
import "./App.scss";
import "antd/dist/antd.less";
import Counter from "./components/Counter";
import Feed from "./components/Feed";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App__header">
        <Counter />
        <Feed />
      </header>
    </div>
  );
};

export default App;
