import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paragraphs = [
  "The street was quiet in the afternoon broken only by the sound of a distant horn and the uneven rhythm of footsteps dust rose slowly as the sun leaned west turning ordinary moments into something that felt strangely important",
  "Learning to type faster is less about speed and more about discipline repetition and resisting the urge to look at the keyboard every error slows progress but every corrected mistake builds long term muscle memory",
  "Technology keeps evolving at a pace that feels impressive until you realize most people still struggle with basic tools elegant systems mean nothing when users ignore logic and mash keys while hoping for correct results",
  "Rain tapped the window in an unplanned pattern unpredictable yet calming inside the room unfinished tasks waited patiently reminding him that time passes whether decisions are made or avoided entirely",
  "Consistency always beats motivation even though motivation sounds cooler small daily practice sessions compound over time quietly outperforming dramatic bursts of effort followed by long stretches of excuses"
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
});
