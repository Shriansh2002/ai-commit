#!/usr/bin/env node
const { Command } = require("commander");
const generateCommit = require("../src/generate-commit");

const program = new Command();

program
	.name("ai-commit")
	.description("AI-powered tool to generate conventional commit messages using Gemini API")
	.version("1.0.0")
	.option(
		"--auto-commit",
		"Automatically commit changes after generating message"
	)
	.option("--copy", "Copy commit message to clipboard")
	.addHelpText('after', `
Examples:
  $ ai-commit                   Generate a commit message for staged changes
  $ ai-commit --copy            Generate and copy the message to clipboard
  $ ai-commit --auto-commit     Generate message and commit changes automatically
  $ ai-commit --copy --auto-commit  Generate, copy, and commit automatically

Note:
  Ensure your Gemini API key is set in the .env file or as GEMINI_API_KEY in your environment.
  Create an ai-commit.config.json file to customize message types and format.
`)
	.action((options) => {
		generateCommit(options);
	});

program.parse();
