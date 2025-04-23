import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App'; // ✅ Must match the file name exactly (capital A)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
