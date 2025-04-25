const fs = require("fs");
const path = require("path");

function loadConfig() {
	const configPath = path.resolve(process.cwd(), "ai-commit.config.json");

	if (fs.existsSync(configPath)) {
		try {
			const raw = fs.readFileSync(configPath, "utf-8");
			return JSON.parse(raw);
		} catch (err) {
			console.error("⚠️ Failed to parse ai-commit.config.json:", err.message);
		}
	}
	return null;
}

module.exports = {
	generatePrompt: function (diff) {
		const config = loadConfig();

		const types = (
			config?.types || [
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"test",
				"chore",
			]
		).join(", ");

		const format =
			config?.format ||
			`Follow the format: "type(scope): summary"
Use present tense, imperative mood.
Keep message concise (under 72 characters).`;

		const prompt = `
You are an AI that writes clear, conventional commit messages.

Types: ${types}
${format}

Examples:
- "feat(auth): add password reset functionality"
- "fix(api): resolve user data retrieval issue"
- "docs(readme): update installation instructions"

Git Diff:
${diff}

Generate ONLY the commit message — no explanations, no newlines, just one line.
`;

		return prompt;
	},
};