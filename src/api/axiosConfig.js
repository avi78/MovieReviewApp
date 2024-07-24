import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080", // Update this to your local server URL
  headers: {
    // If you need specific headers, include them here. Otherwise, you can remove this section.
    "Content-Type": "application/json",
  },
});
