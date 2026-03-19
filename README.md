<div align="center">

# 👁 SPECTER v2

### Advanced OSINT Reconnaissance Framework

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMisTAiM%2Fspecter-v2&env=ANTHROPIC_API_KEY&envDescription=Optional%20Anthropic%20API%20key%20for%20AI%20intelligence%20briefings&project-name=specter-v2)

**Hunt usernames across 120+ platforms with live HTTP probing, AI intelligence briefings, and full digital recon.**

---

</div>

## ⚡ What It Does

SPECTER v2 goes far beyond basic username checkers. It's a full OSINT reconnaissance suite built for real intelligence gathering.

| Feature | Description |
|---------|-------------|
| **Live HTTP Probing** | Real HEAD requests to 120+ platforms — see what responds vs what blocks |
| **AI Intelligence Briefing** | Claude Sonnet analyzes your scan results and writes a full intel report |
| **Username Pattern Analysis** | Birth year extraction, leet speak decoding, prefix analysis, entropy scoring |
| **Digital Footprint Score** | 0–100 composite threat score based on exposure and risk signals |
| **Email Permutation Engine** | Generates email variants across 12 providers with pattern mutations |
| **Domain Recon** | 12 TLD permutations with direct WHOIS lookup links |
| **Dual Export** | Full `.txt` report or structured `.json` for programmatic use |

## 🎯 Platform Coverage

120+ platforms across 13 categories:

- **Social** — X, Instagram, Facebook, TikTok, Reddit, Bluesky, Mastodon, VK, Threads...
- **Developer** — GitHub, GitLab, Stack Overflow, npm, PyPI, Docker Hub, HuggingFace, LeetCode...
- **Gaming** — Steam, Xbox, PSN, Twitch, Chess.com, Roblox, NameMC, op.gg, Valorant Tracker...
- **Professional** — LinkedIn, Crunchbase, AngelList, Keybase, Gravatar...
- **Content** — YouTube, SoundCloud, Spotify, Medium, Substack, Behance, DeviantArt...
- **Marketplace** — eBay, Etsy, Fiverr, Shopify, Gumroad, Ko-fi...
- **Crypto** — OpenSea, ENS, Mirror.xyz
- **Security** — HackerOne, Bugcrowd, TryHackMe, Hack The Box
- And more: Forums, Education, Fitness, Dating, Messaging

## 🚀 Quick Start

```bash
git clone https://github.com/MisTAiM/specter-v2.git
cd specter-v2
npm install
npm run dev
```

Open `http://localhost:5173` and start hunting.

## 🔑 AI Analysis (Optional)

To enable the AI intelligence briefing:

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add it as `ANTHROPIC_API_KEY` in your Vercel environment variables
3. The AI tab will generate full intelligence briefings after each scan

Without an API key, everything else works — probing, analysis, emails, domains, scoring, exports.

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` to Environment Variables (optional)
4. Deploy

Or use the one-click button at the top of this README.

## 🛡 Ethics & Legal

- All probes use standard HTTP HEAD requests (no-cors mode)
- No unauthorized access is performed
- Profile URLs are constructed from known platform patterns
- Manual verification recommended for all results
- Built for legitimate OSINT research, security auditing, and educational purposes

## ⚙ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Inline CSS with IBM Plex Mono
- **Probing:** Native Fetch API (HEAD, no-cors)
- **AI:** Claude Sonnet via Vercel Serverless Functions
- **Export:** Client-side TXT/JSON generation
- **Deploy:** Vercel

---

<div align="center">

**Built by [MisTAiM](https://github.com/MisTAiM)**

</div>
