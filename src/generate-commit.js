const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");
const { execSync } = require("child_process");
const { generatePrompt } = require("./get-prompt");
const clipboardy = require("clipboardy");

// Load .env file from current directory
require("dotenv").config();

// Function to locate and get the Gemini API key
function getGeminiApiKey() {
	// Check if it's already available in environment variables
	if (process.env.GEMINI_API_KEY) {
		return process.env.GEMINI_API_KEY;
	}

	// Try to find .env in the user's home directory
	const homeEnvPath = path.join(require('os').homedir(), '.ai-commit.env');
	if (fs.existsSync(homeEnvPath)) {
		try {
			const envContent = fs.readFileSync(homeEnvPath, 'utf-8');
			const match = envContent.match(/GEMINI_API_KEY=(.+)/);
			if (match && match[1]) {
				return match[1];
			}
		} catch (err) {
			// Silently fail and move to the next option
		}
	}

	// Try to find .env in the ai-commit installation directory
	try {
		const modulePath = path.dirname(require.resolve('ai-commit/package.json'));
		const moduleEnvPath = path.join(modulePath, '.env');
		if (fs.existsSync(moduleEnvPath)) {
			try {
				const envContent = fs.readFileSync(moduleEnvPath, 'utf-8');
				const match = envContent.match(/GEMINI_API_KEY=(.+)/);
				if (match && match[1]) {
					return match[1];
				}
			} catch (err) {
				// Silently fail and return null
			}
		}
	} catch (err) {
		// AI-commit might not be installed as a package, silently continue
	}

	return null;
}

async function getGitDiff() {
	try {
		return execSync("git diff --cached", { encoding: "utf-8" });
	} catch (err) {
		console.error("Error getting git diff:", err.message);
		return "";
	}
}

function commitChanges(message) {
	try {
		execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { encoding: 'utf-8' });
		console.log('✅ Changes committed successfully!');
		return true;
	} catch (err) {
		console.error('❌ Error committing changes:', err.message);
		return false;
	}
}

async function generateCommitMessage(diff) {
	const apiKey = getGeminiApiKey();
	
	if (!apiKey) {
		console.error("\n❌ Gemini API key not found!");
		console.log("\n📝 To fix this, you can:");
		console.log("  1. Create a .env file in your current project with GEMINI_API_KEY=your_key");
		console.log("  2. Create a .ai-commit.env file in your home directory with GEMINI_API_KEY=your_key");
		console.log("  3. Set the GEMINI_API_KEY environment variable");
		return "Failed to generate commit message: API key not found.";
	}
	
	const ai = new GoogleGenAI({ apiKey });
	const prompt = generatePrompt(diff);

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
		});

		return response.text || "No commit message generated.";
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Gemini API Error (Dev):", error);
		} else {
			console.error(
				"❌ Gemini API Error: Something went wrong while generating the commit message."
			);
		}
		return "Failed to generate commit message.";
	}
}

module.exports = async function (options = {}) {
	const diff = await getGitDiff();

	if (!diff || !diff.trim()) {
		console.log("🛑 No staged changes detected.");
		console.log("💡 Tip: Stage your changes using `git add .` and try again.");
		return;
	}

	const message = await generateCommitMessage(diff);
	console.log("\n🔧 Suggested Commit Message:\n" + message);
	
	if (options.copy) {
		await clipboardy.write(message);
		console.log("📋 Commit message copied to clipboard!");
	}
	
	if (options.autoCommit) {
		commitChanges(message);
	}
};