import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Browse from "./Routes/Browse";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
function App() {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      {/* <Router> */}
      <Header></Header>
      <Routes>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/browse" element={<Browse />}>
          <Route path="items/movie/:paramId"></Route>
          <Route path="items/tv/:paramId"></Route>
        </Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
