# 🚀 Prompts Hub Installation Guide

This guide provides step-by-step instructions for setting up the Prompts Hub website locally and deploying it to Netlify.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - [Download Git](https://git-scm.com/downloads)
- **Python 3** - [Download Python](https://www.python.org/downloads/) (for local development server)
- **Node.js & npm** - [Download Node.js](https://nodejs.org/) (for Netlify deployment)

## 🏠 Local Installation (Option A: One-Click Installer)

### Quick Start

1. **Clone or download the repository**:
   ```bash
   git clone https://github.com/guychenya/Flows.git
   cd Flows
   ```

2. **Run the installer**:
   ```bash
   ./install.sh
   ```

3. **Follow the prompts** - The installer will:
   - ✅ Check system requirements
   - ✅ Set up the local development server
   - ✅ Offer to start the website immediately

4. **Access your website**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Start filtering and discovering prompts!

### Manual Installation

If you prefer manual setup:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/guychenya/Flows.git
   cd Flows
   ```

2. **Navigate to website directory**:
   ```bash
   cd website
   ```

3. **Start the development server**:
   ```bash
   python3 -m http.server 3000
   ```
   
   Or using npm:
   ```bash
   npm start
   ```

4. **Open in browser**:
   - Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Netlify Deployment (Option B: Cloud Hosting)

### Method 1: One-Click Deployment Script

1. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

2. **Follow the prompts**:
   - Choose between preview or production deployment
   - Log in to Netlify if prompted
   - The script will handle the rest!

### Method 2: Manual Netlify Deployment

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy to Netlify**:
   
   **Preview deployment:**
   ```bash
   netlify deploy --dir=website
   ```
   
   **Production deployment:**
   ```bash
   netlify deploy --dir=website --prod
   ```

### Method 3: Netlify Web Interface

1. **Go to [Netlify](https://netlify.com)**
2. **Connect your GitHub repository**
3. **Set build settings**:
   - Build command: `echo 'Static site - no build needed'`
   - Publish directory: `website`
4. **Deploy!**

## 🎨 Customizing the UI

The website is designed for easy customization:

### Quick Color Changes

Edit `/website/src/styles.css` and modify the CSS custom properties:

```css
:root {
  /* Change primary color */
  --primary-color: #2563eb;        /* Blue (default) */
  --primary-color: #dc2626;        /* Red */
  --primary-color: #059669;        /* Green */
  --primary-color: #7c3aed;        /* Purple */
  
  /* Change accent color */
  --accent-color: #f59e0b;         /* Amber (default) */
  --accent-color: #ec4899;         /* Pink */
  --accent-color: #06b6d4;         /* Cyan */
}
```

### Layout Modifications

- **Header**: Edit the `<header>` section in `index.html`
- **Search filters**: Modify the `.filters-container` in `index.html`
- **Card design**: Update `.prompt-card` styles in `styles.css`
- **Typography**: Change `--font-family` and font size variables

### Adding Features

The JavaScript is modular and easy to extend:

- **New filters**: Add to the `filters` object in `app.js`
- **Different views**: Extend the `renderPromptCard()` method
- **API integration**: Modify the `loadPrompts()` method

## 📁 Project Structure

```
Prompts Hub/
├── 📄 install.sh              # Local installer script
├── 📄 deploy.sh               # Netlify deployment script
├── 📄 netlify.toml            # Netlify configuration
├── 📁 website/                # Main website files
│   ├── 📄 index.html          # Main HTML file
│   ├── 📄 package.json        # NPM configuration
│   └── 📁 src/
│       ├── 📄 styles.css      # Main stylesheet
│       └── 📄 app.js          # JavaScript application
├── 📁 data/                   # Prompts database
│   ├── 📄 prompts.json        # All prompts with metadata
│   ├── 📄 categories.json     # Category definitions
│   ├── 📄 sources.json        # Source attribution
│   └── 📄 tags.json          # Tag definitions
├── 📁 prompts/                # Organized prompt files
└── 📁 quarantine/             # Non-compatible content
```

## 🔧 Development Commands

### Local Development
```bash
# Start development server
npm start
# or
python3 -m http.server 3000

# Install dependencies (if any added)
npm install
```

### Deployment
```bash
# Preview deployment
netlify deploy --dir=website

# Production deployment
netlify deploy --dir=website --prod

# Check deployment status
netlify status
```

## 🚨 Troubleshooting

### Common Issues

**1. "Permission denied" on install.sh**
```bash
chmod +x install.sh
./install.sh
```

**2. "Python not found"**
- Install Python 3 from [python.org](https://python.org)
- On macOS: `brew install python3`
- On Ubuntu: `sudo apt install python3`

**3. "Port 3000 already in use"**
- The installer will automatically try port 8000
- Or manually specify: `python3 -m http.server 8080`

**4. "Cannot load prompts database"**
- Ensure you're accessing via `http://localhost:3000` (not `file://`)
- Check that `data/prompts.json` exists
- Verify the file path in the browser console

**5. "Netlify CLI not found"**
```bash
npm install -g netlify-cli
```

### Performance Tips

- **Large datasets**: The website handles 357 prompts efficiently
- **Mobile optimization**: Responsive design works on all devices
- **Search performance**: Instant filtering with no lag
- **Caching**: Netlify automatically caches static assets

## 🆘 Support

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify file structure** matches the documentation
3. **Test with a fresh clone** of the repository
4. **Check network connectivity** for Netlify deployments

## 🎉 Success!

Once installed, you'll have:

- ✅ **357 organized prompts** ready for filtering
- ✅ **Advanced search capabilities** by category, complexity, AI model
- ✅ **Responsive design** that works on all devices
- ✅ **Easy customization** with CSS variables
- ✅ **One-click deployment** to Netlify
- ✅ **Lightning-fast performance** with static hosting

Start exploring prompts and building amazing AI interactions! 🚀