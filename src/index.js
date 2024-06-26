const {render} = wp.element;
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
/*
if (document.getElementById('react-settings-page')) {
  render(<App/>, document.getElementById('react-settings-page'));
}
*/

/*ReactDOM.render(<App />, document.getElementById('react-settings-page'));*/
if (document.getElementById('store-banner-settings')) {
  const container = document.getElementById('store-banner-settings');
  const root = createRoot(container);
  root.render(<App />);
}