const fs = require('fs');

const path = "c:/Users/deeva/.gemini/antigravity-ide/brain/65f4609a-4977-47b1-be5d-192bae021548/.system_generated/logs/transcript.jsonl";
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);

let out = "";
for (const line of lines) {
  try {
    const data = JSON.parse(line);
    if (data.type === "USER_INPUT") {
      out += `=== USER ===\n${data.content}\n\n`;
    }
  } catch (e) {}
}

fs.writeFileSync("c:/Users/deeva/Downloads/vendimatch/user_messages.txt", out);
console.log("Dumped user messages to user_messages.txt");
