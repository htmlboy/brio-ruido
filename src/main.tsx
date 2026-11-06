import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App';
import './style.css';

const container=document.getElementById('root')!;
const application=<React.StrictMode><App/></React.StrictMode>;
if(container.hasChildNodes())hydrateRoot(container,application);
else createRoot(container).render(application);
