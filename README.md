# House Advantage 

A unique twist on the classic Blackjack game where **you play as the Casino Dealer**! Your objective is to make the house win against a PC-controlled player by strategically deciding the player's moves and playing your own hand according to standard dealer rules.

![HA](https://raw.githubusercontent.com/LMLK-seal/House-Advantage/refs/heads/main/Preview.jpg)

## 🎮 Game Concept

Unlike traditional blackjack games where you try to beat the dealer, House Advantage flips the script:
- **You are the Casino Dealer** - Play according to dealer rules (hit on 16, stand on 17)
- **Strategic Decision Making** - Decide the PC player's moves to maximize house advantage
- **Authentic Casino Experience** - Experience the game from the house's perspective

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://python.org/) (v3.6 or higher)

### Option 1: Automated Setup (Recommended)
Run the automated setup script that handles everything for you:

```bash
python run.py
```

This script will:
1. ✅ Check if dependencies are installed (`node_modules`)
2. 📦 Run `npm install` if necessary
3. 🚀 Launch `npm run dev` in a new terminal
4. ⏳ Wait for the development server to be ready
5. 🌐 Automatically open your browser to `http://localhost:5173/`

### Option 2: Manual Setup
If you prefer to set up manually:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser and navigate to `http://localhost:5173/`

## 📁 Project Structure

```
house-advantage/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── .env.local          # Environment variables
├── .gitignore          # Git ignore rules
├── App.tsx             # Main application component
├── constants.ts        # Game constants and configurations
├── index.html          # HTML entry point
├── index.tsx           # React entry point
├── metadata.json       # Project metadata
├── package.json        # NPM dependencies and scripts
├── README.md           # This file
├── run.py              # Automated setup script
├── tsconfig.json       # TypeScript configuration
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

## 🛠️ Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS (component-based)
- **Game Logic**: Custom TypeScript implementation
- **Development**: Hot module replacement for fast development

## 🎯 How to Play

1. **Start the Game** - Launch the application using the quick start methods above
2. **Understand Your Role** - You are the casino dealer, not the player
3. **Make Strategic Decisions** - Choose the PC player's moves to benefit the house
4. **Follow Dealer Rules** - Play your own hand according to standard casino dealer rules
5. **Maximize House Advantage** - Your goal is to make the casino win!

## 🧩 Game Features

- **Authentic Blackjack Rules** - Standard casino blackjack gameplay
- **Dealer Perspective** - Unique gameplay from the house's point of view
- **Strategic Gameplay** - Balance risk and reward to maximize house wins
- **Clean UI** - Intuitive interface built with modern web technologies
- **Real-time Updates** - Smooth gameplay with instant feedback

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎲 About

House Advantage offers a fresh perspective on the classic casino game by putting you in the dealer's shoes. Experience the strategic depth of managing risk from the casino's perspective while enjoying smooth, modern web-based gameplay.

---

**Ready to deal?** Run `python run.py` and start your career as a casino dealer! 🃏
