import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

const Root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

Root.render(<App />)