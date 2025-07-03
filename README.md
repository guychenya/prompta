# Prompts Hub 🚀

A curated collection of **357 high-quality AI prompts** organized for easy discovery and filtering. Perfect for building modern prompt filtering websites and applications.

## 📊 Collection Overview

- **Total Prompts**: 357 organized prompts
- **Categories**: 3 main categories with 12 subcategories
- **Sources**: 5 different repositories
- **Tags**: 76 unique tags for filtering
- **Licenses**: MIT, CC0, Apache 2.0 (all commercially usable)

## 🗂️ Repository Structure

```
website/
├── data/
│   ├── prompts.json
│   ├── categories.json
│   ├── sources.json
│   ├── tags.json
│   └── statistics.json
├── public/
└── src/

db/
├── prompts/
│   ├── conversational/
│   ├── system/
│   └── templates/
└── quarantine/
    ├── awesome-prompts/
    └── Awesome-Prompt-Engineering/

sources/
├── AI-Prompt-Database/
├── awesome-ai-system-prompts/
├── awesome-chatgpt-prompts/
├── ChatGPT-System-Prompts/
└── system-prompts-and-models-of-ai-tools/
```

## 🏷️ Prompt Structure

Each prompt follows a standardized JSON structure:

```json
{
  "id": "unique-identifier",
  "title": "Prompt Title",
  "description": "Brief description of the prompt",
  "category": "conversational|system|template",
  "subcategory": "educational|entertainment|professional|technical|creative",
  "complexity": "basic|intermediate|advanced|expert",
  "format": "act-as|system-message|template|instruction",
  "target_ai": ["chatgpt", "claude", "gemini", "any"],
  "use_cases": ["education", "business", "development", "creative"],
  "tags": ["relevant", "keywords"],
  "source": {
    "repository": "source-repo-name",
    "license": "MIT|CC0-1.0|Apache-2.0",
    "attribution": "Original source information"
  },
  "prompt_text": "The actual prompt content",
  "usage_example": "Optional example usage",
  "created_date": "2024-01-01",
  "last_updated": "2024-01-01"
}
```

## 🎯 Filtering Capabilities

Build powerful filtering experiences with these metadata fields:

- **Category**: Conversational, System, Template
- **Subcategory**: 12 specific domains
- **Complexity**: Basic, Intermediate, Advanced, Expert
- **AI Model**: ChatGPT, Claude, Gemini, Any
- **Format**: Act-as, System Message, Template, Instruction
- **Use Cases**: Education, Business, Development, Creative
- **Tags**: 76 searchable keywords
- **Source**: Original repository attribution

## 🔧 Quick Start

### For Website Developers

1. **Load the main database**:
   ```javascript
   const prompts = require('./data/prompts.json');
   ```

2. **Get categories for navigation**:
   ```javascript
   const categories = require('./data/categories.json');
   ```

3. **Filter prompts by category**:
   ```javascript
   const educationalPrompts = prompts.filter(p => p.subcategory === 'educational');
   ```

4. **Search by tags**:
   ```javascript
   const codingPrompts = prompts.filter(p => p.tags.includes('coding'));
   ```

### For API Developers

The JSON structure is ready for REST API implementation:

```
GET /api/prompts                    # Get all prompts
GET /api/prompts?category=system    # Filter by category
GET /api/prompts?tags=coding        # Filter by tags
GET /api/categories                 # Get category definitions
GET /api/sources                    # Get source attribution
```

## 📜 License Information

All prompts in the main collection are licensed under permissive licenses (MIT, CC0, Apache 2.0) that allow:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

See [LICENSE.md](LICENSE.md) for detailed licensing information.

## 🙏 Attribution

This collection aggregates prompts from these excellent repositories:

- [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) - 212 prompts
- [ChatGPT-System-Prompts](https://github.com/mustvlad/ChatGPT-System-Prompts) - 46 prompts
- [AI-Prompt-Database](https://github.com/seanchatmangpt/AI-Prompt-Database) - 19 prompts
- [awesome-ai-system-prompts](https://github.com/hijkzzz/awesome-ai-system-prompts) - 54 prompts
- [system-prompts-and-models-of-ai-tools](https://github.com/hijkzzz/system-prompts-and-models-of-ai-tools) - 26 prompts

## 🚀 Use Cases

Perfect for building:
- **Prompt Libraries**: Searchable prompt collections
- **AI Writing Tools**: Categorized prompt suggestions
- **Educational Platforms**: Learning-focused prompt discovery
- **Business Applications**: Professional prompt templates
- **Creative Tools**: Inspiration and creative prompt generators

## 🤝 Contributing

To add new prompts:
1. Follow the standardized JSON structure
2. Ensure proper categorization and tagging
3. Include source attribution and license information
4. Update the relevant data files

## 📈 Statistics

- **Most Popular Category**: Professional (97 prompts)
- **Most Common Tags**: coding, writing, analysis, education
- **Complexity Distribution**: 60% Basic, 30% Intermediate, 10% Advanced
- **License Distribution**: 85% MIT, 10% CC0, 5% Apache 2.0

---

Ready to build amazing prompt filtering experiences! 🎉