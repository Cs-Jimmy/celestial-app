// Entry point for the React app
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Global styles and Tailwind CSS

// Start the React app and attach it to the HTML element with id="root"
createRoot(document.getElementById("root")!).render(<App />);
