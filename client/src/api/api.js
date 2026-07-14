import axios from "axios";

const API = axios.create({
    baseURL: "https://ai-code-review-api-yku3.onrender.com/api",
});

export default API;