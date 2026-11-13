
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/sonner.jsx"

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={clientId}>
        <App />
        <Toaster position="top-center"/>
    </GoogleOAuthProvider>
)