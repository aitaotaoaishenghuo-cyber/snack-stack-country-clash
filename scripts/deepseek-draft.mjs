import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const localEnv = loadEnv(path.join(root, ".env"));

const apiKey = localEnv.DEEPSEEK_API_KEY;
const model = localEnv.DEEPSEEK_MODEL || "deepseek-chat";
const promptPath = process.argv[2] || "prompts/deepseek-game-task.md";
const outputPath = process.argv[3] || "deepseek-draft.md";

if (!apiKey || apiKey.includes("put_your_new")) {
  console.error("Missing DEEPSEEK_API_KEY. Create .env from .env.example with a fresh key.");
  process.exit(1);
}

const prompt = fs.readFileSync(path.join(root, promptPath), "utf8");
const projectContext = [
  "## index.html",
  readText("index.html"),
  "## styles.css",
  readText("styles.css"),
  "## game.js",
  readText("game.js")
].join("\n\n");

const response = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a senior web game prototyping assistant. Produce practical, minimal code drafts for human review."
      },
      {
        role: "user",
        content: `${prompt}\n\n${projectContext}`
      }
    ],
    temperature: 0.2
  })
});

if (!response.ok) {
  const body = await response.text();
  console.error(`DeepSeek request failed: ${response.status}`);
  console.error(body);
  process.exit(1);
}

const data = await response.json();
const draft = data.choices?.[0]?.message?.content || "";

if (!draft.trim()) {
  console.error("DeepSeek returned an empty draft.");
  process.exit(1);
}

fs.writeFileSync(path.join(root, outputPath), draft);
console.log(`DeepSeek draft written to ${outputPath}`);

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) {
    return env;
  }
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}
