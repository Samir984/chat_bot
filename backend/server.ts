import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
});

app.route("/api/v1/chat").post(async (req, res) => {
  console.log("finnaly hit the server", req.body);
  const { prompt } = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.candidates?.[0]?.content.parts?.[0]?.text);
  res.json({ data: response.candidates?.[0]?.content.parts?.[0]?.text });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on url http://localhost:${process.env.PORT}`);
});
