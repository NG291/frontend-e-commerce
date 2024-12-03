import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {GoogleOAuthProvider} from "@react-oauth/google";
// import './global.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={'484298514245-nis2i9g21e6ke3r9p0vgk3p2f2d4hpi5.apps.googleusercontent.com'}>
            <App/>
        </GoogleOAuthProvider>
    </React.StrictMode>
);

