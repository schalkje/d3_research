import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import store from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';

import App from './layout/App';
import Overview from './routes/Overview'
import Networks from './routes/Networks';
import Network from './routes/Network';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<Overview />} />
          <Route path="network" >
            <Route index element={<Networks />} />
            <Route path=":networkId" element={<Network />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>      
      
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
