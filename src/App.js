/*import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const Home = () => <div>Its Home</div>;
const Settings = () => <div>Its Setting</div>;
const About = () => <div>Its About</div>;

const App = () => (
  <Router basename='/wp-admin/admin.php'>
    <LoadSettingsPages />
    <div>
      <nav>
        <ul>
          <li><Link to="?page=store-banner">Home</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="?page=store-banner" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  </Router>
);

export default App;
*/
import React from "react";
import {
  NavLink,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";


import Header from './Organisms/Header';
import Elements from './Pages/Elements';
import Home from './Pages/Home';
import Image from "./Pages/Image";
import NotFound from "./Pages/NotFound";
import Settings from "./Pages/Settings";
// React Router does not have any opinions about
// how you should parse URL query strings.
//
// If you use simple key=value query strings and
// you do not need to support IE 11, you can use
// the browser's built-in URLSearchParams API.
//
// If your query strings contain array or object
// syntax, you'll probably need to bring your own
// query parsing function.

// const Home = () => <div>Its Home</div>;
// const Settings = () => <div>Its Setting</div>;
// const About = () => <div>Its About</div>;
// const NotFound = () => <div>Its 404</div>;

export default function App() {
  return (
    <Router basename='/wp-admin/admin.php'>
        <Header />
        <LoadSettingsPages />
    </Router>
  );
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function LoadSettingsPages() {
  let query = useQuery();
  
  if (query.get("path")){
    if(query.get("path") === 'settings') {return <Settings />;} 
    else if(query.get("path") === 'elements') {return <Elements /> ;}
    else if(query.get("path") === 'image') {return <Image onSelectImage={(image) => console.log(image)} /> ;}
    else {return <NotFound/>;}
  }
  else {return <Home />;} 

  return (
      <>
        <ul>
          <li>
            <NavLink 
            to="?page=store-banner"
            className={({ isActive, isPending, isTransitioning }) =>
              [
                isPending ? "pending" : "",
                isActive ? "current" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" ")
            }
            >Dashboard</NavLink>
          </li>
          <li>
            <NavLink 
            to="?page=store-banner&path=settings"
            className={({ isActive, isPending, isTransitioning }) =>
              [
                isPending ? "pending" : "",
                isActive ? "current" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" ")
            }
            >Setting</NavLink>
          </li>
          <li>
            <NavLink 
            to="?page=store-banner&path=elements"
            className={({ isActive, isPending, isTransitioning }) =>
              [
                isPending ? "pending" : "",
                isActive ? "current" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" ")
            }
            >Elements</NavLink>
          </li>
          <li>
            <NavLink 
            to="?page=store-banner&path=image"
            className={({ isActive, isPending, isTransitioning }) =>
              [
                isPending ? "pending" : "",
                isActive ? "current" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" ")
            }
            >Image</NavLink>
          </li>
        </ul>
      </>
  );
}