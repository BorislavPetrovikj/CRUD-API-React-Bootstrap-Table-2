import "./App.css";
import Table from "./Components/Table";
import { Container } from "react-bootstrap";
import React from "react";

function App() {
  return (
    <div className="App">
      <Container className="pt-5">
        <Table />
      </Container>
    </div>
  );
}

export default App;
