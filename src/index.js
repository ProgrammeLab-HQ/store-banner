const {render} = wp.element;
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
/*
if (document.getElementById('store-banner-settings')) {
  render(<App/>, document.getElementById('store-banner-settings'));
}
*/

/*ReactDOM.render(<App />, document.getElementById('store-banner-settings'));*/
if (document.getElementById('store-banner-settings')) {
  const container = document.getElementById('store-banner-settings');
  const root = createRoot(container);
  root.render(<App />);
}