# AI-Commit

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

AI-Commit is a command-line tool that leverages Google's Gemini AI to automatically generate conventional commit messages based on your staged changes. It analyzes your git diff and suggests meaningful, standardized commit messages to ensure consistency across your project history.

## 🚀 Features

- 🤖 AI-powered commit message generation
- 📋 Copy to clipboard functionality
- 🔄 Automatic commit option
- ⚙️ Customizable message formats and types
- 🛠️ Configurable through a simple JSON file

## 📋 Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- A Google Gemini API key

## 🔧 Installation

### Global Setup

If you're developing the tool or want to use it across repositories:

```bash
# In the ai-commit directory
npm link

# Now you can use it globally
ai-commit
```

## ⚙️ API Key Setup

You have multiple options for setting up your Gemini API Key:

### Option 1: Project-specific .env file
Create a `.env` file in the root of your project:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Option 2: Global .env file (Recommended for global installation)
Create a `.ai-commit.env` file in your home directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

For macOS/Linux:
```bash
echo "GEMINI_API_KEY=your_key_here" > ~/.ai-commit.env
```

For Windows:
```bash
echo GEMINI_API_KEY=your_key_here > %USERPROFILE%\.ai-commit.env
```

### Option 3: Environment variable
Set the GEMINI_API_KEY as an environment variable:

```bash
export GEMINI_API_KEY=your_key_here  # For macOS/Linux
set GEMINI_API_KEY=your_key_here     # For Windows
```

## 🖥️ Usage

### Basic Usage

```bash
ai-commit
```

This will analyze your staged changes and suggest a commit message.

### Copy to Clipboard

```bash
ai-commit --copy
```

Generates a commit message and copies it to your clipboard.

### Auto-Commit

```bash
ai-commit --auto-commit
```

Generates a commit message and automatically commits the staged changes.

### Combined Options

```bash
ai-commit --copy --auto-commit
```

Generates a commit message, copies it to clipboard, and commits the changes.

### Help

```bash
ai-commit --help
```

Displays all available commands and options.

## 🛠️ Configuration

You can customize AI-Commit by creating an `ai-commit.config.json` file in your project root:

```json
{
  "types": [
    "feat",
    "fix",
    "docs",
    "style",
    "refactor",
    "test",
    "chore",
    "perf"
  ],
  "format": "Custom format instructions here"
}
```

### Configuration Options

- `types`: Array of commit types to use (follows Conventional Commits specification)
- `format`: Custom instructions for commit message format

## 📝 Examples

### Example Git Diff

```diff
diff --git a/src/user-service.js b/src/user-service.js
index 1a2b3c4..5d6e7f8 100644
--- a/src/user-service.js
+++ b/src/user-service.js
@@ -42,6 +42,12 @@ class UserService {
   async getUserById(id) {
     return this.userRepository.findById(id);
   }
+
+  async resetPassword(email) {
+    const user = await this.userRepository.findByEmail(email);
+    const tempPassword = generateRandomPassword();
+    return await this.userRepository.updatePassword(user.id, tempPassword);
+  }
 }
```

### Example Generated Commit Message

```
feat(user): add password reset functionality
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/ai-commit/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/docs/gemini_api_overview) for powering the AI suggestions
- [Conventional Commits](https://www.conventionalcommits.org/) for the commit message format