import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   SPECTER v2 — Advanced OSINT Reconnaissance Framework
   Live probing · AI Analysis · Breach patterns · Footprint scoring
   ═══════════════════════════════════════════════════════════════════ */

const CATS = {
  social:       { l:"Social Media",     c:"#ff2d55", g:"rgba(255,45,85,.25)" },
  messaging:    { l:"Messaging",        c:"#af52de", g:"rgba(175,82,222,.25)" },
  dev:          { l:"Developer",        c:"#30d158", g:"rgba(48,209,88,.25)" },
  gaming:       { l:"Gaming",           c:"#ffd60a", g:"rgba(255,214,10,.25)" },
  professional: { l:"Professional",     c:"#0a84ff", g:"rgba(10,132,255,.25)" },
  content:      { l:"Content & Media",  c:"#ff375f", g:"rgba(255,55,95,.25)" },
  forum:        { l:"Forums",           c:"#bf5af2", g:"rgba(191,90,242,.25)" },
  marketplace:  { l:"Marketplace",      c:"#64d2ff", g:"rgba(100,210,255,.25)" },
  crypto:       { l:"Crypto / Web3",    c:"#ff9f0a", g:"rgba(255,159,10,.25)" },
  security:     { l:"Security",         c:"#ff453a", g:"rgba(255,69,58,.25)" },
  education:    { l:"Education",        c:"#5ac8fa", g:"rgba(90,200,250,.25)" },
  fitness:      { l:"Fitness / Health",  c:"#34c759", g:"rgba(52,199,89,.25)" },
  dating:       { l:"Dating",           c:"#ff6482", g:"rgba(255,100,130,.25)" },
};

const P = [
  {n:"Twitter / X",url:"https://x.com/{}",c:"social",u:"500M+",i:"\ud835\udd4f"},
  {n:"Instagram",url:"https://instagram.com/{}",c:"social",u:"2B+",i:"\ud83d\udcf7"},
  {n:"Facebook",url:"https://facebook.com/{}",c:"social",u:"3B+",i:"f"},
  {n:"TikTok",url:"https://tiktok.com/@{}",c:"social",u:"1.5B+",i:"\u266a"},
  {n:"Snapchat",url:"https://snapchat.com/add/{}",c:"social",u:"750M+",i:"\ud83d\udc7b"},
  {n:"Pinterest",url:"https://pinterest.com/{}",c:"social",u:"450M+",i:"\ud83d\udccc"},
  {n:"Tumblr",url:"https://{}.tumblr.com",c:"social",u:"135M+",i:"t"},
  {n:"Reddit",url:"https://reddit.com/user/{}",c:"social",u:"500M+",i:"\u25cf"},
  {n:"Threads",url:"https://threads.net/@{}",c:"social",u:"200M+",i:"\u25ce"},
  {n:"Mastodon",url:"https://mastodon.social/@{}",c:"social",u:"12M+",i:"M"},
  {n:"Bluesky",url:"https://bsky.app/profile/{}.bsky.social",c:"social",u:"30M+",i:"\ud83e\udd8b"},
  {n:"VK",url:"https://vk.com/{}",c:"social",u:"100M+",i:"\u0412"},
  {n:"Linktree",url:"https://linktr.ee/{}",c:"social",u:"50M+",i:"\ud83c\udf33"},
  {n:"Carrd",url:"https://{}.carrd.co",c:"social",u:"5M+",i:"\u25fb"},
  {n:"Cohost",url:"https://cohost.org/{}",c:"social",u:"200K+",i:"\ud83c\udfe0"},
  {n:"Fosstodon",url:"https://fosstodon.org/@{}",c:"social",u:"50K+",i:"F"},
  {n:"Truth Social",url:"https://truthsocial.com/@{}",c:"social",u:"5M+",i:"T"},
  {n:"Telegram",url:"https://t.me/{}",c:"messaging",u:"800M+",i:"\u2708"},
  {n:"Discord (Lookup)",url:"https://discord.id/?prefill={}",c:"messaging",u:"200M+",i:"D"},
  {n:"GitHub",url:"https://github.com/{}",c:"dev",u:"100M+",i:"\u25c6"},
  {n:"GitLab",url:"https://gitlab.com/{}",c:"dev",u:"30M+",i:"\ud83e\udd8a"},
  {n:"Bitbucket",url:"https://bitbucket.org/{}",c:"dev",u:"10M+",i:"B"},
  {n:"Stack Overflow",url:"https://stackoverflow.com/users/?tab=accounts&SearchText={}",c:"dev",u:"22M+",i:"\u26a1"},
  {n:"Dev.to",url:"https://dev.to/{}",c:"dev",u:"1M+",i:"\u25a6"},
  {n:"Codepen",url:"https://codepen.io/{}",c:"dev",u:"3M+",i:"\u25c7"},
  {n:"Replit",url:"https://replit.com/@{}",c:"dev",u:"20M+",i:"R"},
  {n:"npm",url:"https://www.npmjs.com/~{}",c:"dev",u:"17M+",i:"\ud83d\udce6"},
  {n:"PyPI",url:"https://pypi.org/user/{}",c:"dev",u:"800K+",i:"\ud83d\udc0d"},
  {n:"Docker Hub",url:"https://hub.docker.com/u/{}",c:"dev",u:"20M+",i:"\ud83d\udc33"},
  {n:"HackerRank",url:"https://hackerrank.com/profile/{}",c:"dev",u:"18M+",i:"H"},
  {n:"LeetCode",url:"https://leetcode.com/u/{}",c:"dev",u:"10M+",i:"LC"},
  {n:"Kaggle",url:"https://kaggle.com/{}",c:"dev",u:"15M+",i:"K"},
  {n:"Hashnode",url:"https://hashnode.com/@{}",c:"dev",u:"5M+",i:"#"},
  {n:"Hugging Face",url:"https://huggingface.co/{}",c:"dev",u:"5M+",i:"\ud83e\udd17"},
  {n:"CodeWars",url:"https://codewars.com/users/{}",c:"dev",u:"5M+",i:"\u2694"},
  {n:"Hacker Noon",url:"https://hackernoon.com/u/{}",c:"dev",u:"3M+",i:"HN"},
  {n:"Glitch",url:"https://glitch.com/@{}",c:"dev",u:"5M+",i:"\ud83d\udc1f"},
  {n:"Exercism",url:"https://exercism.org/profiles/{}",c:"dev",u:"1M+",i:"E"},
  {n:"Codeforces",url:"https://codeforces.com/profile/{}",c:"dev",u:"800K+",i:"CF"},
  {n:"Steam",url:"https://steamcommunity.com/id/{}",c:"gaming",u:"130M+",i:"\ud83c\udfae"},
  {n:"Xbox Gamertag",url:"https://xboxgamertag.com/search/{}",c:"gaming",u:"120M+",i:"\ud83d\udfe2"},
  {n:"PSN (PSNProfiles)",url:"https://psnprofiles.com/{}",c:"gaming",u:"110M+",i:"\ud83d\udfe5"},
  {n:"Epic / Fortnite",url:"https://fortnitetracker.com/profile/all/{}",c:"gaming",u:"270M+",i:"E"},
  {n:"Roblox",url:"https://www.roblox.com/user.aspx?username={}",c:"gaming",u:"200M+",i:"R"},
  {n:"Chess.com",url:"https://chess.com/member/{}",c:"gaming",u:"150M+",i:"\u265f"},
  {n:"Lichess",url:"https://lichess.org/@/{}",c:"gaming",u:"10M+",i:"\u265e"},
  {n:"Twitch",url:"https://twitch.tv/{}",c:"gaming",u:"140M+",i:"\ud83d\udcfa"},
  {n:"Speedrun.com",url:"https://speedrun.com/users/{}",c:"gaming",u:"2M+",i:"\u23f1"},
  {n:"osu!",url:"https://osu.ppy.sh/users/{}",c:"gaming",u:"20M+",i:"\u25c9"},
  {n:"NameMC",url:"https://namemc.com/profile/{}",c:"gaming",u:"170M+",i:"\u26cf"},
  {n:"op.gg (LoL)",url:"https://op.gg/summoners/na/{}",c:"gaming",u:"180M+",i:"\u2694"},
  {n:"Valorant Tracker",url:"https://tracker.gg/valorant/profile/riot/{}%23NA1",c:"gaming",u:"30M+",i:"V"},
  {n:"Itch.io",url:"https://{}.itch.io",c:"gaming",u:"10M+",i:"\ud83d\udd79"},
  {n:"RetroAchievements",url:"https://retroachievements.org/user/{}",c:"gaming",u:"500K+",i:"\ud83d\udd79"},
  {n:"Newgrounds",url:"https://{}.newgrounds.com",c:"gaming",u:"5M+",i:"NG"},
  {n:"LinkedIn",url:"https://linkedin.com/in/{}",c:"professional",u:"1B+",i:"in"},
  {n:"AngelList",url:"https://angel.co/u/{}",c:"professional",u:"10M+",i:"\ud83d\ude07"},
  {n:"Crunchbase",url:"https://crunchbase.com/person/{}",c:"professional",u:"5M+",i:"CB"},
  {n:"About.me",url:"https://about.me/{}",c:"professional",u:"10M+",i:"\ud83d\udc64"},
  {n:"Gravatar",url:"https://gravatar.com/{}",c:"professional",u:"100M+",i:"G"},
  {n:"Keybase",url:"https://keybase.io/{}",c:"professional",u:"1M+",i:"\ud83d\udd11"},
  {n:"Muckrack",url:"https://muckrack.com/{}",c:"professional",u:"1M+",i:"\ud83d\udcf0"},
  {n:"Notion",url:"https://notion.so/{}",c:"professional",u:"30M+",i:"N"},
  {n:"YouTube",url:"https://youtube.com/@{}",c:"content",u:"2.5B+",i:"\u25b6"},
  {n:"Vimeo",url:"https://vimeo.com/{}",c:"content",u:"260M+",i:"\u25b7"},
  {n:"SoundCloud",url:"https://soundcloud.com/{}",c:"content",u:"76M+",i:"\u2601"},
  {n:"Spotify",url:"https://open.spotify.com/user/{}",c:"content",u:"600M+",i:"\ud83c\udfb5"},
  {n:"Bandcamp",url:"https://{}.bandcamp.com",c:"content",u:"10M+",i:"\ud83c\udfb8"},
  {n:"Medium",url:"https://medium.com/@{}",c:"content",u:"100M+",i:"M"},
  {n:"Substack",url:"https://{}.substack.com",c:"content",u:"35M+",i:"\ud83d\udcf0"},
  {n:"Patreon",url:"https://patreon.com/{}",c:"content",u:"8M+",i:"P"},
  {n:"Behance",url:"https://behance.net/{}",c:"content",u:"50M+",i:"B\u0113"},
  {n:"Dribbble",url:"https://dribbble.com/{}",c:"content",u:"12M+",i:"\u25cf"},
  {n:"DeviantArt",url:"https://deviantart.com/{}",c:"content",u:"70M+",i:"\ud83c\udfad"},
  {n:"ArtStation",url:"https://artstation.com/{}",c:"content",u:"15M+",i:"\ud83d\uddbc"},
  {n:"Flickr",url:"https://flickr.com/people/{}",c:"content",u:"100M+",i:"\ud83d\udcf8"},
  {n:"500px",url:"https://500px.com/p/{}",c:"content",u:"20M+",i:"5"},
  {n:"Mixcloud",url:"https://mixcloud.com/{}",c:"content",u:"20M+",i:"\ud83c\udfa7"},
  {n:"Wattpad",url:"https://wattpad.com/user/{}",c:"content",u:"90M+",i:"\ud83d\udcd6"},
  {n:"VSCO",url:"https://vsco.co/{}",c:"content",u:"30M+",i:"\u25fb"},
  {n:"Unsplash",url:"https://unsplash.com/@{}",c:"content",u:"5M+",i:"\ud83d\udcf7"},
  {n:"Genius",url:"https://genius.com/artists/{}",c:"content",u:"30M+",i:"\ud83c\udfa4"},
  {n:"Giphy",url:"https://giphy.com/{}",c:"content",u:"700M+",i:"\ud83c\udf9e"},
  {n:"Dailymotion",url:"https://dailymotion.com/{}",c:"content",u:"300M+",i:"\u25b6"},
  {n:"Hacker News",url:"https://news.ycombinator.com/user?id={}",c:"forum",u:"10M+",i:"Y"},
  {n:"Product Hunt",url:"https://producthunt.com/@{}",c:"forum",u:"5M+",i:"\ud83d\ude80"},
  {n:"Quora",url:"https://quora.com/profile/{}",c:"forum",u:"400M+",i:"Q"},
  {n:"Disqus",url:"https://disqus.com/by/{}",c:"forum",u:"100M+",i:"\ud83d\udcac"},
  {n:"Letterboxd",url:"https://letterboxd.com/{}",c:"forum",u:"15M+",i:"\ud83c\udfac"},
  {n:"Goodreads",url:"https://goodreads.com/{}",c:"forum",u:"150M+",i:"\ud83d\udcda"},
  {n:"Last.fm",url:"https://last.fm/user/{}",c:"forum",u:"50M+",i:"\ud83c\udfb6"},
  {n:"MyAnimeList",url:"https://myanimelist.net/profile/{}",c:"forum",u:"20M+",i:"\ud83c\udf38"},
  {n:"AniList",url:"https://anilist.co/user/{}",c:"forum",u:"3M+",i:"A"},
  {n:"Trakt",url:"https://trakt.tv/users/{}",c:"forum",u:"5M+",i:"\ud83c\udfa5"},
  {n:"Instructables",url:"https://instructables.com/member/{}",c:"forum",u:"10M+",i:"\ud83d\udd27"},
  {n:"Imgur",url:"https://imgur.com/user/{}",c:"forum",u:"300M+",i:"\ud83d\udcf8"},
  {n:"TripAdvisor",url:"https://tripadvisor.com/Profile/{}",c:"forum",u:"490M+",i:"\ud83c\udf0e"},
  {n:"eBay",url:"https://ebay.com/usr/{}",c:"marketplace",u:"130M+",i:"\ud83d\uded2"},
  {n:"Etsy",url:"https://etsy.com/shop/{}",c:"marketplace",u:"90M+",i:"\ud83e\uddf6"},
  {n:"Poshmark",url:"https://poshmark.com/closet/{}",c:"marketplace",u:"80M+",i:"\ud83d\udc57"},
  {n:"Fiverr",url:"https://fiverr.com/{}",c:"marketplace",u:"50M+",i:"5"},
  {n:"Shopify",url:"https://{}.myshopify.com",c:"marketplace",u:"4M+",i:"\ud83d\udecd"},
  {n:"Gumroad",url:"https://{}.gumroad.com",c:"marketplace",u:"5M+",i:"\ud83d\udcb0"},
  {n:"Ko-fi",url:"https://ko-fi.com/{}",c:"marketplace",u:"1M+",i:"\u2615"},
  {n:"Buy Me a Coffee",url:"https://buymeacoffee.com/{}",c:"marketplace",u:"1M+",i:"\u2615"},
  {n:"Redbubble",url:"https://redbubble.com/people/{}",c:"marketplace",u:"10M+",i:"\ud83d\udd34"},
  {n:"OpenSea",url:"https://opensea.io/{}",c:"crypto",u:"5M+",i:"\ud83c\udf0a"},
  {n:"ENS Lookup",url:"https://app.ens.domains/{}.eth",c:"crypto",u:"3M+",i:"\u25c8"},
  {n:"Mirror.xyz",url:"https://mirror.xyz/{}",c:"crypto",u:"500K+",i:"\ud83e\ude9e"},
  {n:"HackerOne",url:"https://hackerone.com/{}",c:"security",u:"1M+",i:"\ud83d\udee1"},
  {n:"Bugcrowd",url:"https://bugcrowd.com/{}",c:"security",u:"500K+",i:"\ud83d\udc1b"},
  {n:"TryHackMe",url:"https://tryhackme.com/p/{}",c:"security",u:"3M+",i:"\ud83c\udff4"},
  {n:"Hack The Box",url:"https://app.hackthebox.com/users/{}",c:"security",u:"2M+",i:"\ud83d\udce6"},
  {n:"Duolingo",url:"https://duolingo.com/profile/{}",c:"education",u:"100M+",i:"\ud83e\udd89"},
  {n:"Khan Academy",url:"https://khanacademy.org/profile/{}",c:"education",u:"120M+",i:"KA"},
  {n:"Strava",url:"https://strava.com/athletes/{}",c:"fitness",u:"120M+",i:"\ud83c\udfc3"},
  {n:"Tinder",url:"https://tinder.com/@{}",c:"dating",u:"75M+",i:"\ud83d\udd25"},
];

const TOTAL = P.length;

async function probeUrl(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const r = await fetch(url, { method:"HEAD", mode:"no-cors", signal:ctrl.signal, redirect:"follow" });
    clearTimeout(timer);
    return { reachable: true, status: r.status || "opaque" };
  } catch(e) {
    clearTimeout(timer);
    return { reachable: false, status: e.name === "AbortError" ? "timeout" : "blocked" };
  }
}

function analyzeUsername(u) {
  const signals = [];
  const lower = u.toLowerCase();
  if (u.length <= 3) signals.push({ t:"OG Handle",d:`Only ${u.length} chars \u2014 high-value username, likely early adopter or resold`, r:"high", cat:"identity" });
  else if (u.length <= 5) signals.push({ t:"Short Handle",d:`${u.length} chars \u2014 desirable username length`, r:"medium", cat:"identity" });
  else if (u.length > 20) signals.push({ t:"Extended Handle",d:`${u.length} chars \u2014 uncommon length, may be alt/burner account`, r:"medium", cat:"identity" });
  if (/^[a-z]+[._][a-z]+$/i.test(u)) signals.push({ t:"Real Name Pattern",d:"firstname.lastname or firstname_lastname \u2014 strong PII indicator", r:"critical", cat:"pii" });
  if (/^[a-z]+[._][a-z]+[0-9]{2,4}$/i.test(u)) signals.push({ t:"Name + Year",d:"Name pattern with trailing number \u2014 likely birth year or graduation year", r:"critical", cat:"pii" });
  const trailing = u.match(/(\d{4})$/);
  if (trailing) {
    const yr = parseInt(trailing[1]);
    if (yr >= 1960 && yr <= 2012) signals.push({ t:"Possible Birth Year",d:`Trailing "${trailing[1]}" falls in birth year range \u2014 age estimate: ${2026-yr}`, r:"critical", cat:"pii" });
    else if (yr >= 2013 && yr <= 2026) signals.push({ t:"Possible Year Marker",d:`"${trailing[1]}" could be account creation or graduation year`, r:"medium", cat:"temporal" });
  }
  const trail2 = u.match(/(\d{2})$/);
  if (trail2 && !trailing) {
    const n = parseInt(trail2[1]);
    if (n >= 60 && n <= 99) signals.push({ t:"Possible Birth Year (2-digit)",d:`Trailing "${trail2[1]}" \u2192 born 19${trail2[1]}? Age ~${2026-1900-n}`, r:"high", cat:"pii" });
    if (n >= 0 && n <= 12) signals.push({ t:"Possible Birth Year (2-digit)",d:`Trailing "${trail2[1]}" \u2192 born 20${trail2[1].padStart(2,'0')}? Age ~${2026-2000-n}`, r:"high", cat:"pii" });
  }
  const prefixes = { "the":"ownership","real":"authenticity","official":"brand","not":"negation","its":"identity","mr":"honorific","ms":"honorific","dr":"title","xx":"filler","xo":"affection","im":"identity","iam":"identity" };
  for (const [pf, desc] of Object.entries(prefixes)) {
    if (lower.startsWith(pf) && u.length > pf.length + 2) { signals.push({ t:"Username Prefix",d:`"${pf}" ${desc} prefix \u2014 primary name "${u.slice(pf.length)}" was likely taken`, r:"medium", cat:"identity" }); break; }
  }
  if (/[0-9]/.test(u) && /[a-zA-Z]/.test(u)) {
    const leetMap = {"0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","8":"b"};
    let decoded = u;
    for (const [num,letter] of Object.entries(leetMap)) decoded = decoded.replaceAll(num,letter);
    if (decoded.toLowerCase() !== u.toLowerCase()) signals.push({ t:"Leet Speak Detected",d:`Possible decoded form: "${decoded}"`, r:"medium", cat:"identity" });
  }
  if (/(.)\1{2,}/.test(u)) signals.push({ t:"Character Repetition",d:"Stylized with repeated characters \u2014 common in gaming/social", r:"low", cat:"style" });
  const underscores = (u.match(/_/g)||[]).length;
  if (underscores >= 3) signals.push({ t:"Heavy Formatting",d:`${underscores} underscores \u2014 decorative or bot-like pattern`, r:"medium", cat:"style" });
  if (u === u.toLowerCase() && /[a-z]/.test(u)) signals.push({ t:"All Lowercase",d:"Consistent casing \u2014 deliberate branding", r:"low", cat:"style" });
  const edgy = ["dark","shadow","ghost","phantom","night","death","demon","chaos","void","null","zero","neo","cyber","hack","rage","fury","toxic","elite"];
  for (const word of edgy) { if (lower.includes(word)) { signals.push({ t:"Thematic Keyword",d:`Contains "${word}" \u2014 gaming/hacker culture alias`, r:"low", cat:"persona" }); break; } }
  const charset = new Set(u.split(""));
  const entropy = Math.log2(Math.pow(charset.size, u.length));
  if (entropy > 40) signals.push({ t:"High Entropy",d:`${entropy.toFixed(1)} bits \u2014 complex/random username`, r:"low", cat:"technical" });
  if (entropy < 15 && u.length > 3) signals.push({ t:"Low Entropy",d:`${entropy.toFixed(1)} bits \u2014 simple/predictable`, r:"medium", cat:"technical" });
  return signals;
}

function getEmailPerms(u) {
  const base = u.toLowerCase().replace(/[^a-z0-9._-]/gi, "");
  const providers = ["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com","icloud.com","pm.me","aol.com","tutanota.com","zoho.com","fastmail.com","hey.com"];
  const variants = [base];
  if (base.includes("_")) variants.push(base.replace(/_/g, "."), base.replace(/_/g, ""));
  if (base.includes(".")) variants.push(base.replace(/\./g, "_"), base.replace(/\./g, ""));
  const results = []; const seen = new Set();
  for (const v of variants) for (const p of providers) { const email = `${v}@${p}`; if (!seen.has(email)) { seen.add(email); results.push(email); } }
  return results;
}

function getDomainPerms(u) {
  const base = u.toLowerCase().replace(/[^a-z0-9-]/gi, "");
  return [".com",".net",".org",".io",".dev",".co",".me",".xyz",".app",".tech",".info",".page"].map(tld => base + tld);
}

function getFootprintScore(results, analysis) {
  const found = results.filter(r => r.probeStatus === "reachable").length;
  const catSpread = new Set(results.filter(r => r.probeStatus === "reachable").map(r => r.c)).size;
  const riskSignals = analysis.filter(a => a.r === "critical" || a.r === "high").length;
  return { score: Math.min(100, Math.round((found / TOTAL) * 60 + catSpread * 4 + riskSignals * 5)), found, catSpread, riskSignals };
}

export default function SpecterV2() {
  const [username, setUsername] = useState("");
  const [phase, setPhase] = useState("idle");
  const [results, setResults] = useState([]);
  const [probeProgress, setProbeProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("platforms");
  const [activeFilter, setActiveFilter] = useState("all");
  const [analysis, setAnalysis] = useState([]);
  const [emails, setEmails] = useState([]);
  const [domains, setDomains] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [footprint, setFootprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const scanStartRef = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState("");

  const toggleSection = (key) => setExpandedSections(prev => ({...prev, [key]: !prev[key]}));
  const copyText = (txt) => { navigator.clipboard?.writeText(txt); setCopied(txt); setTimeout(()=>setCopied(""),1500); };

  const runScan = useCallback(async () => {
    if (!username.trim() || phase !== "idle") return;
    const u = username.trim();
    scanStartRef.current = Date.now();
    setPhase("scanning"); setResults([]); setProbeProgress(0); setAnalysis([]); setEmails([]); setDomains([]);
    setAiReport(""); setFootprint(null); setActiveTab("platforms"); setActiveFilter("all"); setExpandedSections({});

    const items = P.map(p => ({ ...p, profileUrl: p.url.replace("{}", u), probeStatus: "pending" }));
    setPhase("probing");
    const batchSize = 15;
    const probed = [...items];
    for (let i = 0; i < probed.length; i += batchSize) {
      const batch = probed.slice(i, i + batchSize);
      const probeResults = await Promise.all(batch.map(async (item) => {
        const result = await probeUrl(item.profileUrl);
        return { ...item, probeStatus: result.reachable ? "reachable" : "unreachable", httpDetail: result.status };
      }));
      probeResults.forEach((pr, j) => { probed[i + j] = pr; });
      setResults([...probed]);
      setProbeProgress(Math.min(100, Math.round(((i + batchSize) / probed.length) * 100)));
    }

    const a = analyzeUsername(u);
    setAnalysis(a);
    setEmails(getEmailPerms(u));
    setDomains(getDomainPerms(u));
    const fp = getFootprintScore(probed, a);
    setFootprint(fp);
    setHistory(prev => [u, ...prev.filter(x => x !== u)].slice(0, 15));

    setPhase("ai"); setAiLoading(true);
    try {
      const reachable = probed.filter(r => r.probeStatus === "reachable").map(r => r.n);
      const unreachable = probed.filter(r => r.probeStatus === "unreachable").map(r => r.n);
      const resp = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an OSINT analyst writing an intelligence briefing. Target username: "${u}".

Reachable platforms (${reachable.length}): ${reachable.join(", ")}
Unreachable/blocked (${unreachable.length}): ${unreachable.join(", ")}
Username signals: ${a.map(s => `${s.t}: ${s.d}`).join("; ")}
Email permutations: ${getEmailPerms(u).length}
Digital footprint score: ${fp.score}/100

Write a 5-paragraph intelligence briefing:
1. IDENTITY ASSESSMENT \u2014 What the username pattern reveals
2. PLATFORM FOOTPRINT \u2014 Which platforms responded and behavioral implications
3. RISK VECTORS \u2014 PII exposure, cross-correlation opportunities
4. PERSONA PROFILE \u2014 Likely demographics, interests, digital behavior
5. RECOMMENDATIONS \u2014 Next investigation steps

Use intelligence community tone. Be specific with the data. No markdown headers, just flowing paragraphs. Bold the first 2-3 words of each paragraph as a topic label.`
        }),
      });
      const data = await resp.json();
      setAiReport(data.content?.map(b => b.text || "").join("\n") || "AI analysis unavailable.");
    } catch(e) { setAiReport("AI analysis could not be completed. Manual review of scan data recommended."); }
    setAiLoading(false); setPhase("done");
  }, [username, phase]);

  useEffect(() => {
    if (phase !== "idle" && phase !== "done") {
      const iv = setInterval(() => setElapsed(((Date.now() - scanStartRef.current) / 1000).toFixed(1)), 100);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const filtered = useMemo(() => activeFilter === "all" ? results : results.filter(r => r.c === activeFilter), [results, activeFilter]);
  const catCounts = useMemo(() => { const c = {}; results.forEach(r => { c[r.c] = (c[r.c] || 0) + 1; }); return c; }, [results]);
  const reachableCount = results.filter(r => r.probeStatus === "reachable").length;
  const unreachableCount = results.filter(r => r.probeStatus === "unreachable").length;

  const exportFull = () => {
    const lines = [
      `\u2554${"".padEnd(58,"\u2550")}\u2557`,`\u2551  SPECTER v2 \u2014 OSINT RECONNAISSANCE REPORT${" ".repeat(14)}\u2551`,`\u255a${"".padEnd(58,"\u2550")}\u255d`,
      "",`TARGET: ${username}`,`DATE: ${new Date().toISOString()}`,`PLATFORMS: ${results.length} | REACHABLE: ${reachableCount} | UNREACHABLE: ${unreachableCount}`,
      `FOOTPRINT: ${footprint?.score||0}/100`,`DURATION: ${elapsed}s`,"",
      `== USERNAME ANALYSIS ==`,...analysis.map(a => `  [${a.r.toUpperCase().padEnd(8)}] ${a.t}: ${a.d}`),"",
      `== AI BRIEFING ==`,aiReport||"N/A","",
      `== EMAILS (${emails.length}) ==`,...emails.map(e => `  ${e}`),"",
      `== DOMAINS (${domains.length}) ==`,...domains.map(d => `  ${d}`),"",
      `== REACHABLE PLATFORMS ==`,...results.filter(r=>r.probeStatus==="reachable").map(r=>`  [${(CATS[r.c]?.l||r.c).padEnd(16)}] ${r.n.padEnd(22)} ${r.profileUrl}`),"",
      `== UNREACHABLE ==`,...results.filter(r=>r.probeStatus==="unreachable").map(r=>`  [${(CATS[r.c]?.l||r.c).padEnd(16)}] ${r.n.padEnd(22)} ${r.profileUrl}`),"",
      `== END REPORT ==`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `SPECTER_${username}_${Date.now()}.txt`; a.click();
  };
  const exportJSON = () => {
    const data = { target:username,date:new Date().toISOString(),footprint,analysis,emails,domains,aiReport,
      platforms:results.map(r=>({name:r.n,url:r.profileUrl,category:r.c,status:r.probeStatus,http:r.httpDetail})) };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `SPECTER_${username}_${Date.now()}.json`; a.click();
  };

  const riskColor = { critical:"#ff453a", high:"#ff9f0a", medium:"#ffd60a", low:"#30d158" };
  const pill = (active,c) => ({ padding:"4px 12px",borderRadius:3,fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:active?700:400,letterSpacing:.5,background:active?`${c}18`:"rgba(255,255,255,.02)",color:active?c:"#4a5568",border:`1px solid ${active?c+"33":"rgba(255,255,255,.05)"}`,transition:"all .15s" });
  const card = { background:"rgba(255,255,255,.015)", border:"1px solid rgba(255,255,255,.05)", borderRadius:4, padding:"10px 14px", transition:"all .15s" };
  const sectionBox = (c) => ({ background:`${c}08`, border:`1px solid ${c}18`, borderRadius:6, marginBottom:12, overflow:"hidden" });

  return (
    <div style={{ minHeight:"100vh", background:"#050508", color:"#a8b2c1", fontFamily:"'IBM Plex Mono','Fira Code','SF Mono',monospace", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed",inset:0,zIndex:0,opacity:0.025, backgroundImage:"linear-gradient(rgba(0,255,100,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,100,.4) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
      <div style={{ position:"fixed",inset:0,zIndex:1,pointerEvents:"none", background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.012) 3px,rgba(0,0,0,.012) 6px)" }}/>
      <div style={{ position:"relative",zIndex:2,maxWidth:1280,margin:"0 auto",padding:"20px 16px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ display:"inline-block",padding:"3px 14px",border:"1px solid rgba(0,255,100,.12)",borderRadius:2,fontSize:9,letterSpacing:6,color:"#00ff64",textTransform:"uppercase",marginBottom:6 }}>Advanced OSINT Reconnaissance Suite</div>
          <h1 style={{ fontSize:"clamp(42px,7vw,68px)",fontWeight:900,margin:"0 0 2px",letterSpacing:-3, background:"linear-gradient(135deg,#00ff64 0%,#00e5ff 35%,#d946ef 70%,#ff453a 100%)", WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>
            SPECTER<span style={{ fontSize:"clamp(14px,2vw,20px)",letterSpacing:2,opacity:.5 }}> v2</span>
          </h1>
          <p style={{ color:"#1e2535",fontSize:10,letterSpacing:3,margin:0 }}>{TOTAL} TARGETS \u2022 LIVE PROBING \u2022 AI ANALYSIS \u2022 FULL RECON</p>
        </div>

        {/* SEARCH */}
        <div style={{ display:"flex",gap:6,maxWidth:640,margin:"0 auto 14px", background:"rgba(0,255,100,.02)", border:"1px solid rgba(0,255,100,.1)", borderRadius:6,padding:3 }}>
          <div style={{ display:"flex",alignItems:"center",padding:"0 10px",color:"#00ff64",fontSize:16,opacity:.35,fontWeight:900 }}>{"\u27e9"}</div>
          <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runScan()} placeholder="target username..." style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#e2e8f0",fontSize:15,fontFamily:"inherit",padding:"12px 0" }}/>
          <button onClick={runScan} disabled={phase!=="idle"||!username.trim()} style={{ padding:"10px 28px", background:phase!=="idle"?"rgba(0,255,100,.06)":"linear-gradient(135deg,#00ff64,#00cc50)", color:phase!=="idle"?"#00ff64":"#000", border:"none",borderRadius:4,fontFamily:"inherit",fontWeight:800,fontSize:12,cursor:phase!=="idle"?"wait":"pointer",letterSpacing:2,transition:"all .2s" }}>
            {phase==="idle"?"HUNT":phase==="probing"?"PROBING...":phase==="ai"?"AI ANALYSIS...":"SCANNING..."}
          </button>
        </div>

        {history.length > 0 && (
          <div style={{ display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:14 }}>
            {history.map(h => <button key={h} onClick={()=>{if(phase==="idle")setUsername(h)}} style={{ padding:"2px 8px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:2,color:"#3a4050",fontSize:10,fontFamily:"inherit",cursor:"pointer" }}>{h}</button>)}
          </div>
        )}

        {/* PROGRESS */}
        {phase !== "idle" && phase !== "done" && (
          <div style={{ maxWidth:640,margin:"0 auto 18px" }}>
            <div style={{ height:2,background:"rgba(0,255,100,.06)",borderRadius:1,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${probeProgress}%`,background:"linear-gradient(90deg,#00ff64,#00e5ff,#d946ef)",transition:"width .1s",boxShadow:"0 0 16px rgba(0,255,100,.4)" }}/>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:"#2a3040" }}>
              <span>{phase==="ai"?"Running AI intelligence analysis...":"Probing endpoints..."}</span>
              <span>{elapsed}s \u2022 {probeProgress}%</span>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {results.length > 0 && (<>
          {/* Stats */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:5,marginBottom:14 }}>
            {[
              {l:"Scanned",v:results.length,c:"#00ff64"},{l:"Reachable",v:reachableCount,c:"#00e5ff"},{l:"Blocked",v:unreachableCount,c:"#ff453a"},
              {l:"Categories",v:Object.keys(catCounts).length,c:"#d946ef"},{l:"Emails",v:emails.length||"\u2014",c:"#ff9f0a"},
              {l:"Signals",v:analysis.length||"\u2014",c:"#ffd60a"},
              {l:"Footprint",v:footprint?`${footprint.score}/100`:"\u2014",c:footprint?.score>66?"#ff453a":footprint?.score>33?"#ffd60a":"#30d158"},
              {l:"Time",v:`${elapsed}s`,c:"#64d2ff"},
            ].map(s => (
              <div key={s.l} style={{...card,textAlign:"center",padding:"8px 6px"}}>
                <div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</div>
                <div style={{fontSize:7,letterSpacing:2,color:"#2a3040",textTransform:"uppercase"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:3,marginBottom:12,borderBottom:"1px solid rgba(255,255,255,.03)",paddingBottom:7,flexWrap:"wrap" }}>
            {[{k:"platforms",l:"\u25c6 Platforms",c:"#00ff64"},{k:"analysis",l:"\u25b2 Intelligence",c:"#ff9f0a"},{k:"emails",l:"\u2709 Email Recon",c:"#d946ef"},{k:"domains",l:"\u25c8 Domain Recon",c:"#00e5ff"},{k:"ai",l:"\ud83e\udde0 AI Briefing",c:"#ff453a"}].map(t => (
              <button key={t.k} onClick={()=>setActiveTab(t.k)} style={{
                padding:"5px 14px",borderRadius:3,fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:activeTab===t.k?700:400,letterSpacing:.5,
                background:activeTab===t.k?`${t.c}12`:"transparent",color:activeTab===t.k?t.c:"#3a4050",
                border:activeTab===t.k?`1px solid ${t.c}28`:"1px solid transparent",transition:"all .15s",
              }}>{t.l}</button>
            ))}
            <div style={{flex:1}}/>
            {phase==="done" && (<div style={{display:"flex",gap:3}}>
              <button onClick={exportFull} style={{padding:"4px 12px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1,background:"rgba(0,229,255,.06)",color:"#00e5ff",border:"1px solid rgba(0,229,255,.15)"}}>TXT</button>
              <button onClick={exportJSON} style={{padding:"4px 12px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1,background:"rgba(217,70,239,.06)",color:"#d946ef",border:"1px solid rgba(217,70,239,.15)"}}>JSON</button>
            </div>)}
          </div>

          {/* PLATFORMS TAB */}
          {activeTab==="platforms" && (<>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:10}}>
              <button onClick={()=>setActiveFilter("all")} style={pill(activeFilter==="all","#00ff64")}>ALL ({results.length})</button>
              {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat,count]) => (
                <button key={cat} onClick={()=>setActiveFilter(cat)} style={pill(activeFilter===cat,CATS[cat]?.c||"#888")}>{CATS[cat]?.l||cat} ({count})</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:5}}>
              {filtered.map((r,i) => {
                const ok = r.probeStatus==="reachable";
                const pend = r.probeStatus==="pending";
                const cc = CATS[r.c]?.c||"#666";
                return (
                  <a key={r.n+i} href={r.profileUrl} target="_blank" rel="noopener noreferrer" style={{
                    display:"flex",alignItems:"center",gap:9,padding:"7px 11px",
                    background:ok?`${cc}06`:"rgba(255,255,255,.008)",
                    border:`1px solid ${ok?cc+"1a":"rgba(255,255,255,.03)"}`,
                    borderRadius:4,textDecoration:"none",color:"#c8d6e5",transition:"all .12s",cursor:"pointer",
                    opacity:pend?.35:ok?1:.4,
                  }} onMouseEnter={e=>{e.currentTarget.style.background=`${cc}15`;e.currentTarget.style.borderColor=`${cc}40`}} onMouseLeave={e=>{e.currentTarget.style.background=ok?`${cc}06`:"rgba(255,255,255,.008)";e.currentTarget.style.borderColor=ok?`${cc}1a`:"rgba(255,255,255,.03)"}}>
                    <div style={{width:30,height:30,borderRadius:3,background:`${cc}0c`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,border:`1px solid ${cc}14`}}>{r.i}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontSize:11,fontWeight:600,color:ok?"#dde4ed":"#3a4050"}}>{r.n}</span>
                        <span style={{width:5,height:5,borderRadius:9,flexShrink:0,background:pend?"#3a4050":ok?"#30d158":"#ff453a",boxShadow:ok?"0 0 5px #30d158":"none"}}/>
                      </div>
                      <div style={{fontSize:8,color:"#1e2535",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.profileUrl}</div>
                    </div>
                    <div style={{fontSize:7,color:cc,padding:"2px 4px",background:`${cc}0c`,borderRadius:2,flexShrink:0}}>{r.u}</div>
                    <div style={{color:"#2a3040",fontSize:11,flexShrink:0}}>{"\u2197"}</div>
                  </a>
                );
              })}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:10,fontSize:8,color:"#1e2535"}}>
              <span>{"\ud83d\udfe2"} Reachable ({reachableCount})</span><span>{"\ud83d\udd34"} Blocked ({unreachableCount})</span><span>{"\u26ab"} Pending ({results.filter(r=>r.probeStatus==="pending").length})</span>
            </div>
          </>)}

          {/* ANALYSIS TAB */}
          {activeTab==="analysis" && (<div>
            {footprint && (
              <div style={{...card,textAlign:"center",padding:18,marginBottom:12}}>
                <div style={{fontSize:8,letterSpacing:3,color:"#3a4050",textTransform:"uppercase",marginBottom:6}}>Digital Footprint Score</div>
                <div style={{position:"relative",width:200,height:10,background:"rgba(255,255,255,.04)",borderRadius:5,margin:"0 auto 6px",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${footprint.score}%`,borderRadius:5,background:footprint.score>66?"linear-gradient(90deg,#ff9f0a,#ff453a)":footprint.score>33?"linear-gradient(90deg,#ffd60a,#ff9f0a)":"linear-gradient(90deg,#30d158,#ffd60a)",transition:"width .5s"}}/>
                </div>
                <div style={{fontSize:28,fontWeight:900,color:footprint.score>66?"#ff453a":footprint.score>33?"#ffd60a":"#30d158"}}>{footprint.score}<span style={{fontSize:12,opacity:.5}}>/100</span></div>
                <div style={{fontSize:9,color:"#3a4050",marginTop:3}}>{footprint.score>80?"CRITICAL EXPOSURE":footprint.score>60?"HIGH EXPOSURE":footprint.score>40?"MODERATE EXPOSURE":footprint.score>20?"LOW EXPOSURE":"MINIMAL EXPOSURE"}</div>
              </div>
            )}
            {["critical","high","medium","low"].map(risk => {
              const items = analysis.filter(a=>a.r===risk);
              if (!items.length) return null;
              return (
                <div key={risk} style={sectionBox(riskColor[risk])}>
                  <div onClick={()=>toggleSection(risk)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",userSelect:"none"}}>
                    <span style={{fontSize:10,letterSpacing:2,color:riskColor[risk],fontWeight:700}}>{"\u25b2"} {risk.toUpperCase()} ({items.length})</span>
                    <span style={{fontSize:12,color:riskColor[risk]}}>{expandedSections[risk]===false?"\u25b8":"\u25be"}</span>
                  </div>
                  {expandedSections[risk]!==false && (<div style={{padding:"0 14px 10px"}}>
                    {items.map((a,i) => (
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,.025)":"none"}}>
                        <span style={{padding:"2px 5px",borderRadius:2,fontSize:7,fontWeight:700,letterSpacing:1,background:`${riskColor[risk]}18`,color:riskColor[risk],flexShrink:0,marginTop:2}}>{a.cat?.toUpperCase()}</span>
                        <div><div style={{fontSize:11,fontWeight:600,color:"#dde4ed"}}>{a.t}</div><div style={{fontSize:10,color:"#5a6578",marginTop:1}}>{a.d}</div></div>
                      </div>
                    ))}
                  </div>)}
                </div>
              );
            })}
          </div>)}

          {/* EMAILS TAB */}
          {activeTab==="emails" && (<div>
            <div style={{fontSize:10,color:"#3a4050",marginBottom:10}}>Generated {emails.length} email permutations across 12 providers</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:3}}>
              {emails.map(e => (
                <div key={e} onClick={()=>copyText(e)} style={{...card,fontSize:10,color:copied===e?"#30d158":"#7a8899",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px",cursor:"pointer"}}>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e}</span>
                  <span style={{fontSize:8,color:copied===e?"#30d158":"#2a3040",flexShrink:0}}>{copied===e?"\u2713":"copy"}</span>
                </div>
              ))}
            </div>
          </div>)}

          {/* DOMAINS TAB */}
          {activeTab==="domains" && (<div>
            <div style={{fontSize:10,color:"#3a4050",marginBottom:10}}>Domain permutations \u2014 click to check WHOIS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:3}}>
              {domains.map(d => (
                <a key={d} href={`https://who.is/whois/${d}`} target="_blank" rel="noopener noreferrer" style={{...card,fontSize:10,color:"#00e5ff",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px"}}>
                  <span>{d}</span><span style={{fontSize:8,color:"#2a3040"}}>WHOIS {"\u2197"}</span>
                </a>
              ))}
            </div>
          </div>)}

          {/* AI TAB */}
          {activeTab==="ai" && (
            <div style={sectionBox("#ff453a")}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid rgba(255,69,58,.08)"}}>
                <span style={{fontSize:10,letterSpacing:2,color:"#ff453a",fontWeight:700}}>{"\ud83e\udde0"} AI INTELLIGENCE BRIEFING</span>
                {aiLoading && <span style={{fontSize:9,color:"#ff453a",animation:"pulse 1.5s infinite"}}>Analyzing...</span>}
              </div>
              <div style={{padding:"12px 14px"}}>
                {aiReport ? <div style={{fontSize:11,lineHeight:1.8,color:"#a8b2c1",whiteSpace:"pre-wrap"}}>{aiReport}</div>
                : aiLoading ? <div style={{textAlign:"center",padding:30,color:"#2a3040"}}><div style={{fontSize:20,marginBottom:6}}>{"\ud83e\udde0"}</div><div style={{fontSize:10}}>Generating intelligence briefing...</div></div>
                : <div style={{textAlign:"center",padding:30,color:"#2a3040",fontSize:10}}>Run a scan to generate AI analysis</div>}
              </div>
            </div>
          )}

          {phase==="done" && (
            <div style={{textAlign:"center",marginTop:16,padding:12,fontSize:8,color:"#141a28",letterSpacing:1,borderTop:"1px solid rgba(255,255,255,.02)"}}>
              SPECTER v2 \u2022 Live HTTP HEAD probing (no-cors) \u2022 AI analysis via Claude Sonnet \u2022 No unauthorized access performed
            </div>
          )}
        </>)}

        {phase==="idle" && results.length===0 && (
          <div style={{textAlign:"center",marginTop:48,padding:36}}>
            <div style={{fontSize:52,marginBottom:12,opacity:.08}}>{"\ud83d\udc41"}</div>
            <div style={{fontSize:10,color:"#141a28",letterSpacing:2,maxWidth:480,margin:"0 auto",lineHeight:2}}>
              Enter a username to begin full reconnaissance across {TOTAL} platforms.
              <br/><br/>
              <span style={{color:"#1e2535"}}>LIVE HTTP PROBING \u2022 AI INTELLIGENCE BRIEFING \u2022 USERNAME ANALYSIS<br/>EMAIL PERMUTATION \u2022 DOMAIN RECON \u2022 FOOTPRINT SCORING \u2022 TXT/JSON EXPORT</span>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#141a28 transparent}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#141a28;border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        button:hover{filter:brightness(1.12)}a:hover{filter:brightness(1.08)}
      `}</style>
    </div>
  );
}
