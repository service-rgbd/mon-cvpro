import { createRoot } from "react-dom/client";
import { configureApiBaseUrl } from "@/lib/api-base";
import App from "./App";
import "./index.css";

configureApiBaseUrl();

createRoot(document.getElementById("root")!).render(<App />);
