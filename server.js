import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paragraphs = [
  "Typing speed is not about fast fingers but accurate thinking executed consistently.",
  "Programming requires patience logical thinking and the ability to debug your own mistakes.",
  "The quick brown fox jumps over the lazy dog and tests every letter on the keyboard.",
  "A good developer focuses on clarity correctness and maintainability over clever tricks.",
  "Practice does not make perfect practice makes permanent so practice carefully."
];

app.use(express.static(path.join(__dirname, "public")));
//console.log(__dirname);
//console.log(__filename);

app.get("/api/paragraph", (req, res) => {
  const random = Math.floor(Math.random() * paragraphs.length);
  res.json({ text: paragraphs[random] });
});

app.listen(3000,()=>{
  console.log("Server running on http://localhost:3000");
})

