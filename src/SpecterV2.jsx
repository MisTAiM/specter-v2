import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   SPECTER v2.5 — OSINT Recon Framework
   Zero emojis. Real design. Proper Discord ID integration.
   ═══════════════════════════════════════════════════════════════ */

const CATS={social:{l:"Social",c:"#e8384f"},messaging:{l:"Messaging",c:"#a36bdb"},dev:{l:"Developer",c:"#20c997"},gaming:{l:"Gaming",c:"#e5a00d"},professional:{l:"Professional",c:"#4c9aff"},content:{l:"Content",c:"#e84393"},forum:{l:"Forums",c:"#9b59b6"},marketplace:{l:"Market",c:"#00cec9"},crypto:{l:"Web3",c:"#f39c12"},security:{l:"Security",c:"#e74c3c"},education:{l:"Education",c:"#0abde3"},fitness:{l:"Fitness",c:"#2ecc71"},dating:{l:"Dating",c:"#fd79a8"}};

// Platform icons: 2-3 char abbreviations styled as badges — NO emojis
const P=[
  {n:"Twitter / X",url:"https://x.com/{}",c:"social",u:"500M+",i:"X"},
  {n:"Instagram",url:"https://instagram.com/{}",c:"social",u:"2B+",i:"IG"},
  {n:"Facebook",url:"https://facebook.com/{}",c:"social",u:"3B+",i:"FB"},
  {n:"TikTok",url:"https://tiktok.com/@{}",c:"social",u:"1.5B+",i:"TT"},
  {n:"Snapchat",url:"https://snapchat.com/add/{}",c:"social",u:"750M+",i:"SC"},
  {n:"Pinterest",url:"https://pinterest.com/{}",c:"social",u:"450M+",i:"PN"},
  {n:"Tumblr",url:"https://{}.tumblr.com",c:"social",u:"135M+",i:"TB"},
  {n:"Reddit",url:"https://reddit.com/user/{}",c:"social",u:"500M+",i:"RD"},
  {n:"Threads",url:"https://threads.net/@{}",c:"social",u:"200M+",i:"TH"},
  {n:"Mastodon",url:"https://mastodon.social/@{}",c:"social",u:"12M+",i:"MD"},
  {n:"Bluesky",url:"https://bsky.app/profile/{}.bsky.social",c:"social",u:"30M+",i:"BS"},
  {n:"VK",url:"https://vk.com/{}",c:"social",u:"100M+",i:"VK"},
  {n:"Linktree",url:"https://linktr.ee/{}",c:"social",u:"50M+",i:"LT"},
  {n:"Carrd",url:"https://{}.carrd.co",c:"social",u:"5M+",i:"CR"},
  {n:"Truth Social",url:"https://truthsocial.com/@{}",c:"social",u:"5M+",i:"TS"},
  {n:"Minds",url:"https://minds.com/{}",c:"social",u:"5M+",i:"MI"},
  {n:"Rumble",url:"https://rumble.com/user/{}",c:"social",u:"80M+",i:"RM"},
  {n:"Telegram",url:"https://t.me/{}",c:"messaging",u:"800M+",i:"TG"},
  // Discord uses User ID — handled separately below
  {n:"Signal",url:"https://signal.me/#u/{}",c:"messaging",u:"40M+",i:"SG"},
  {n:"GitHub",url:"https://github.com/{}",c:"dev",u:"100M+",i:"GH"},
  {n:"GitLab",url:"https://gitlab.com/{}",c:"dev",u:"30M+",i:"GL"},
  {n:"Bitbucket",url:"https://bitbucket.org/{}",c:"dev",u:"10M+",i:"BB"},
  {n:"Stack Overflow",url:"https://stackoverflow.com/users/?tab=accounts&SearchText={}",c:"dev",u:"22M+",i:"SO"},
  {n:"Dev.to",url:"https://dev.to/{}",c:"dev",u:"1M+",i:"DV"},
  {n:"Codepen",url:"https://codepen.io/{}",c:"dev",u:"3M+",i:"CP"},
  {n:"Replit",url:"https://replit.com/@{}",c:"dev",u:"20M+",i:"RP"},
  {n:"npm",url:"https://www.npmjs.com/~{}",c:"dev",u:"17M+",i:"NP"},
  {n:"PyPI",url:"https://pypi.org/user/{}",c:"dev",u:"800K+",i:"PY"},
  {n:"Docker Hub",url:"https://hub.docker.com/u/{}",c:"dev",u:"20M+",i:"DK"},
  {n:"HackerRank",url:"https://hackerrank.com/profile/{}",c:"dev",u:"18M+",i:"HR"},
  {n:"LeetCode",url:"https://leetcode.com/u/{}",c:"dev",u:"10M+",i:"LC"},
  {n:"Kaggle",url:"https://kaggle.com/{}",c:"dev",u:"15M+",i:"KG"},
  {n:"Hashnode",url:"https://hashnode.com/@{}",c:"dev",u:"5M+",i:"HN"},
  {n:"Hugging Face",url:"https://huggingface.co/{}",c:"dev",u:"5M+",i:"HF"},
  {n:"CodeWars",url:"https://codewars.com/users/{}",c:"dev",u:"5M+",i:"CW"},
  {n:"Glitch",url:"https://glitch.com/@{}",c:"dev",u:"5M+",i:"GT"},
  {n:"Codeforces",url:"https://codeforces.com/profile/{}",c:"dev",u:"800K+",i:"CF"},
  {n:"Codeberg",url:"https://codeberg.org/{}",c:"dev",u:"200K+",i:"CB"},
  {n:"SourceForge",url:"https://sourceforge.net/u/{}/profile/",c:"dev",u:"3M+",i:"SF"},
  {n:"Steam",url:"https://steamcommunity.com/id/{}",c:"gaming",u:"130M+",i:"ST"},
  {n:"Xbox",url:"https://xboxgamertag.com/search/{}",c:"gaming",u:"120M+",i:"XB"},
  {n:"PSN",url:"https://psnprofiles.com/{}",c:"gaming",u:"110M+",i:"PS"},
  {n:"Epic / Fortnite",url:"https://fortnitetracker.com/profile/all/{}",c:"gaming",u:"270M+",i:"EP"},
  {n:"Roblox",url:"https://www.roblox.com/user.aspx?username={}",c:"gaming",u:"200M+",i:"RX"},
  {n:"Chess.com",url:"https://chess.com/member/{}",c:"gaming",u:"150M+",i:"CH"},
  {n:"Lichess",url:"https://lichess.org/@/{}",c:"gaming",u:"10M+",i:"LI"},
  {n:"Twitch",url:"https://twitch.tv/{}",c:"gaming",u:"140M+",i:"TW"},
  {n:"Speedrun",url:"https://speedrun.com/users/{}",c:"gaming",u:"2M+",i:"SR"},
  {n:"osu!",url:"https://osu.ppy.sh/users/{}",c:"gaming",u:"20M+",i:"OS"},
  {n:"NameMC",url:"https://namemc.com/profile/{}",c:"gaming",u:"170M+",i:"MC"},
  {n:"op.gg",url:"https://op.gg/summoners/na/{}",c:"gaming",u:"180M+",i:"OP"},
  {n:"Valorant",url:"https://tracker.gg/valorant/profile/riot/{}%23NA1",c:"gaming",u:"30M+",i:"VL"},
  {n:"Itch.io",url:"https://{}.itch.io",c:"gaming",u:"10M+",i:"IT"},
  {n:"Newgrounds",url:"https://{}.newgrounds.com",c:"gaming",u:"5M+",i:"NG"},
  {n:"Tracker.gg",url:"https://tracker.gg/profile/{}",c:"gaming",u:"50M+",i:"TR"},
  {n:"LinkedIn",url:"https://linkedin.com/in/{}",c:"professional",u:"1B+",i:"LN"},
  {n:"AngelList",url:"https://angel.co/u/{}",c:"professional",u:"10M+",i:"AL"},
  {n:"Crunchbase",url:"https://crunchbase.com/person/{}",c:"professional",u:"5M+",i:"CB"},
  {n:"About.me",url:"https://about.me/{}",c:"professional",u:"10M+",i:"AM"},
  {n:"Gravatar",url:"https://gravatar.com/{}",c:"professional",u:"100M+",i:"GR"},
  {n:"Keybase",url:"https://keybase.io/{}",c:"professional",u:"1M+",i:"KB"},
  {n:"Notion",url:"https://notion.so/{}",c:"professional",u:"30M+",i:"NT"},
  {n:"Polywork",url:"https://polywork.com/{}",c:"professional",u:"1M+",i:"PW"},
  {n:"Read.cv",url:"https://read.cv/{}",c:"professional",u:"500K+",i:"CV"},
  {n:"YouTube",url:"https://youtube.com/@{}",c:"content",u:"2.5B+",i:"YT"},
  {n:"Vimeo",url:"https://vimeo.com/{}",c:"content",u:"260M+",i:"VM"},
  {n:"SoundCloud",url:"https://soundcloud.com/{}",c:"content",u:"76M+",i:"SC"},
  {n:"Spotify",url:"https://open.spotify.com/user/{}",c:"content",u:"600M+",i:"SP"},
  {n:"Bandcamp",url:"https://{}.bandcamp.com",c:"content",u:"10M+",i:"BC"},
  {n:"Medium",url:"https://medium.com/@{}",c:"content",u:"100M+",i:"MD"},
  {n:"Substack",url:"https://{}.substack.com",c:"content",u:"35M+",i:"SS"},
  {n:"Patreon",url:"https://patreon.com/{}",c:"content",u:"8M+",i:"PT"},
  {n:"Behance",url:"https://behance.net/{}",c:"content",u:"50M+",i:"BE"},
  {n:"Dribbble",url:"https://dribbble.com/{}",c:"content",u:"12M+",i:"DR"},
  {n:"DeviantArt",url:"https://deviantart.com/{}",c:"content",u:"70M+",i:"DA"},
  {n:"ArtStation",url:"https://artstation.com/{}",c:"content",u:"15M+",i:"AS"},
  {n:"Flickr",url:"https://flickr.com/people/{}",c:"content",u:"100M+",i:"FL"},
  {n:"500px",url:"https://500px.com/p/{}",c:"content",u:"20M+",i:"5X"},
  {n:"Wattpad",url:"https://wattpad.com/user/{}",c:"content",u:"90M+",i:"WP"},
  {n:"VSCO",url:"https://vsco.co/{}",c:"content",u:"30M+",i:"VS"},
  {n:"Unsplash",url:"https://unsplash.com/@{}",c:"content",u:"5M+",i:"UN"},
  {n:"Giphy",url:"https://giphy.com/{}",c:"content",u:"700M+",i:"GY"},
  {n:"Dailymotion",url:"https://dailymotion.com/{}",c:"content",u:"300M+",i:"DM"},
  {n:"Pixiv",url:"https://pixiv.net/users/{}",c:"content",u:"84M+",i:"PX"},
  {n:"Hacker News",url:"https://news.ycombinator.com/user?id={}",c:"forum",u:"10M+",i:"HN"},
  {n:"Product Hunt",url:"https://producthunt.com/@{}",c:"forum",u:"5M+",i:"PH"},
  {n:"Quora",url:"https://quora.com/profile/{}",c:"forum",u:"400M+",i:"QA"},
  {n:"Disqus",url:"https://disqus.com/by/{}",c:"forum",u:"100M+",i:"DQ"},
  {n:"Letterboxd",url:"https://letterboxd.com/{}",c:"forum",u:"15M+",i:"LB"},
  {n:"Goodreads",url:"https://goodreads.com/{}",c:"forum",u:"150M+",i:"GR"},
  {n:"Last.fm",url:"https://last.fm/user/{}",c:"forum",u:"50M+",i:"LF"},
  {n:"MyAnimeList",url:"https://myanimelist.net/profile/{}",c:"forum",u:"20M+",i:"ML"},
  {n:"AniList",url:"https://anilist.co/user/{}",c:"forum",u:"3M+",i:"AL"},
  {n:"Trakt",url:"https://trakt.tv/users/{}",c:"forum",u:"5M+",i:"TK"},
  {n:"Imgur",url:"https://imgur.com/user/{}",c:"forum",u:"300M+",i:"IM"},
  {n:"TripAdvisor",url:"https://tripadvisor.com/Profile/{}",c:"forum",u:"490M+",i:"TA"},
  {n:"eBay",url:"https://ebay.com/usr/{}",c:"marketplace",u:"130M+",i:"EB"},
  {n:"Etsy",url:"https://etsy.com/shop/{}",c:"marketplace",u:"90M+",i:"ET"},
  {n:"Poshmark",url:"https://poshmark.com/closet/{}",c:"marketplace",u:"80M+",i:"PM"},
  {n:"Fiverr",url:"https://fiverr.com/{}",c:"marketplace",u:"50M+",i:"FV"},
  {n:"Shopify",url:"https://{}.myshopify.com",c:"marketplace",u:"4M+",i:"SH"},
  {n:"Gumroad",url:"https://{}.gumroad.com",c:"marketplace",u:"5M+",i:"GM"},
  {n:"Ko-fi",url:"https://ko-fi.com/{}",c:"marketplace",u:"1M+",i:"KF"},
  {n:"Redbubble",url:"https://redbubble.com/people/{}",c:"marketplace",u:"10M+",i:"RB"},
  {n:"Society6",url:"https://society6.com/{}",c:"marketplace",u:"5M+",i:"S6"},
  {n:"OpenSea",url:"https://opensea.io/{}",c:"crypto",u:"5M+",i:"OS"},
  {n:"ENS",url:"https://app.ens.domains/{}.eth",c:"crypto",u:"3M+",i:"EN"},
  {n:"Mirror",url:"https://mirror.xyz/{}",c:"crypto",u:"500K+",i:"MR"},
  {n:"Rarible",url:"https://rarible.com/{}",c:"crypto",u:"2M+",i:"RR"},
  {n:"Foundation",url:"https://foundation.app/@{}",c:"crypto",u:"500K+",i:"FN"},
  {n:"HackerOne",url:"https://hackerone.com/{}",c:"security",u:"1M+",i:"H1"},
  {n:"Bugcrowd",url:"https://bugcrowd.com/{}",c:"security",u:"500K+",i:"BC"},
  {n:"TryHackMe",url:"https://tryhackme.com/p/{}",c:"security",u:"3M+",i:"TH"},
  {n:"HackTheBox",url:"https://app.hackthebox.com/users/{}",c:"security",u:"2M+",i:"HB"},
  {n:"Duolingo",url:"https://duolingo.com/profile/{}",c:"education",u:"100M+",i:"DL"},
  {n:"Khan Academy",url:"https://khanacademy.org/profile/{}",c:"education",u:"120M+",i:"KA"},
  {n:"Coursera",url:"https://coursera.org/user/{}",c:"education",u:"130M+",i:"CO"},
  {n:"Strava",url:"https://strava.com/athletes/{}",c:"fitness",u:"120M+",i:"SV"},
  {n:"Tinder",url:"https://tinder.com/@{}",c:"dating",u:"75M+",i:"TD"},
];
const TOTAL=P.length;

async function probeUrl(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),5000);try{await fetch(url,{method:"HEAD",mode:"no-cors",signal:c.signal,redirect:"follow"});clearTimeout(t);return{reachable:true}}catch(e){clearTimeout(t);return{reachable:false,status:e.name==="AbortError"?"timeout":"blocked"}}}
async function checkWayback(url){try{const r=await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,{signal:AbortSignal.timeout(6000)});const d=await r.json();if(d.archived_snapshots?.closest?.url)return{archived:true,url:d.archived_snapshots.closest.url,ts:d.archived_snapshots.closest.timestamp};return{archived:false}}catch{return{archived:false}}}
function getMutations(u){const l=u.toLowerCase();const m=new Set();["1","2","_","0","00","01","69","420","x","xx","99","98","97","03","04","05"].forEach(n=>m.add(l+n));["the","real","official","not","its","x","_"].forEach(p=>m.add(p+l));if(l.includes("_")){m.add(l.replace(/_/g,""));m.add(l.replace(/_/g,"."));m.add(l.replace(/_/g,"-"))}if(l.includes(".")){m.add(l.replace(/\./g,""));m.add(l.replace(/\./g,"_"))}if(!l.includes("_")&&!l.includes(".")&&l.length>5)for(let i=3;i<l.length-2;i++){m.add(l.slice(0,i)+"_"+l.slice(i))}const lm={"a":"4","e":"3","i":"1","o":"0","s":"5","t":"7"};let lt=l;for(const[a,b]of Object.entries(lm))lt=lt.replaceAll(a,b);if(lt!==l)m.add(lt);const s=l.replace(/\d+/g,"");if(s&&s!==l)m.add(s);m.add(l+l[l.length-1]);m.delete(l);return[...m].slice(0,60)}
function getDorks(u){return[{q:`"${u}"`,d:"Exact match"},{q:`"${u}" site:reddit.com`,d:"Reddit"},{q:`"${u}" site:x.com OR site:twitter.com`,d:"X / Twitter"},{q:`"${u}" site:github.com`,d:"GitHub"},{q:`"${u}" site:pastebin.com`,d:"Paste sites"},{q:`"${u}" site:youtube.com`,d:"YouTube"},{q:`"${u}" email OR "@"`,d:"Email exposure"},{q:`"${u}" password OR leak OR breach`,d:"Breaches"},{q:`"${u}" site:linkedin.com`,d:"LinkedIn"},{q:`"${u}" site:steamcommunity.com`,d:"Steam"},{q:`"${u}" filetype:pdf`,d:"PDFs"},{q:`"${u}" inurl:profile OR inurl:user`,d:"Profiles"},{q:`"${u}" site:archive.org`,d:"Archived"},{q:`intitle:"${u}"`,d:"In title"},{q:`"${u}" site:medium.com OR site:dev.to`,d:"Blogs"}]}
function analyzeUsername(u){const s=[];const l=u.toLowerCase();if(u.length<=3)s.push({t:"OG Handle",d:`${u.length} chars - high-value`,r:"high",cat:"identity"});else if(u.length<=5)s.push({t:"Short Handle",d:`${u.length} chars`,r:"medium",cat:"identity"});else if(u.length>20)s.push({t:"Extended Handle",d:`${u.length} chars - possible alt`,r:"medium",cat:"identity"});if(/^[a-z]+[._][a-z]+$/i.test(u))s.push({t:"Real Name Pattern",d:"firstname.lastname - strong PII",r:"critical",cat:"pii"});if(/^[a-z]+[._][a-z]+[0-9]{2,4}$/i.test(u))s.push({t:"Name + Year",d:"Name + number - birth/grad year",r:"critical",cat:"pii"});const tr=u.match(/(\d{4})$/);if(tr){const yr=parseInt(tr[1]);if(yr>=1960&&yr<=2012)s.push({t:"Birth Year",d:`"${tr[1]}" = age ~${2026-yr}`,r:"critical",cat:"pii"});else if(yr>=2013&&yr<=2026)s.push({t:"Year Marker",d:`"${tr[1]}" creation/grad`,r:"medium",cat:"temporal"})}const t2=u.match(/(\d{2})$/);if(t2&&!tr){const n=parseInt(t2[1]);if(n>=60&&n<=99)s.push({t:"Birth Year (2d)",d:`19${t2[1]} = age ~${2026-1900-n}`,r:"high",cat:"pii"});if(n>=0&&n<=12)s.push({t:"Birth Year (2d)",d:`20${t2[1].padStart(2,'0')} = age ~${2026-2000-n}`,r:"high",cat:"pii"})}const pf={"the":"ownership","real":"authenticity","official":"brand","not":"negation","its":"identity","mr":"honorific","im":"identity"};for(const[p,d]of Object.entries(pf)){if(l.startsWith(p)&&u.length>p.length+2){s.push({t:"Prefix",d:`"${p}" ${d} - primary "${u.slice(p.length)}" was taken`,r:"medium",cat:"identity"});break}}if(/[0-9]/.test(u)&&/[a-zA-Z]/.test(u)){const lm={"0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","8":"b"};let d=u;for(const[n,c]of Object.entries(lm))d=d.replaceAll(n,c);if(d.toLowerCase()!==u.toLowerCase())s.push({t:"Leet Speak",d:`Decoded: "${d}"`,r:"medium",cat:"identity"})}if(/(.)\1{2,}/.test(u))s.push({t:"Char Repetition",d:"Stylized repeats",r:"low",cat:"style"});if(u===u.toLowerCase()&&/[a-z]/.test(u))s.push({t:"All Lowercase",d:"Deliberate branding",r:"low",cat:"style"});const edgy=["dark","shadow","ghost","phantom","night","death","demon","chaos","void","null","zero","neo","cyber","hack","rage","fury","toxic","elite","sniper","reaper","wolf","ninja","dragon","king"];for(const w of edgy){if(l.includes(w)){s.push({t:"Thematic",d:`"${w}" - gaming/hacker culture`,r:"low",cat:"persona"});break}}const cn=["john","james","mike","chris","alex","david","sarah","emma","jake","nick","matt","ryan","adam","jason","andrew","daniel","josh","tyler","max","sam","ben","tom","joe"];for(const n of cn){if(l===n||l.startsWith(n+"_")||l.startsWith(n+".")){s.push({t:"Common Name",d:`"${n}" - cross-ref risk`,r:"high",cat:"pii"});break}}return s}
function getEmailPerms(u){const b=u.toLowerCase().replace(/[^a-z0-9._-]/gi,"");const pr=["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com","icloud.com","pm.me","aol.com","tutanota.com","zoho.com","fastmail.com","hey.com"];const v=[b];if(b.includes("_"))v.push(b.replace(/_/g,"."),b.replace(/_/g,""));if(b.includes("."))v.push(b.replace(/\./g,"_"),b.replace(/\./g,""));const r=[];const s=new Set();for(const x of v)for(const p of pr){const e=`${x}@${p}`;if(!s.has(e)){s.add(e);r.push(e)}}return r}
function getDomainPerms(u){const b=u.toLowerCase().replace(/[^a-z0-9-]/gi,"");return[".com",".net",".org",".io",".dev",".co",".me",".xyz",".app",".tech",".gg",".site"].map(t=>b+t)}
function getFootprintScore(r,a){const f=r.filter(x=>x.ps==="reachable").length;const c=new Set(r.filter(x=>x.ps==="reachable").map(x=>x.c)).size;const rs=a.filter(x=>x.r==="critical"||x.r==="high").length;return{score:Math.min(100,Math.round((f/TOTAL)*60+c*4+rs*5)),found:f,catSpread:c}}

// SVG Icons
const Icon=({d,size=16,color="currentColor"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const Icons={
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  ext:"M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  copy:"M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2zM16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2",
  check:"M20 6L9 17l-5-5",
  down:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  alert:"M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  globe:"M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  clock:"M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

export default function SpecterV2(){
  const[username,setUsername]=useState("");
  const[discordId,setDiscordId]=useState("");
  const[phase,setPhase]=useState("idle");
  const[results,setResults]=useState([]);
  const[probeProgress,setProbeProgress]=useState(0);
  const[activeTab,setActiveTab]=useState("platforms");
  const[activeFilter,setActiveFilter]=useState("all");
  const[statusFilter,setStatusFilter]=useState("all");
  const[analysis,setAnalysis]=useState([]);
  const[emails,setEmails]=useState([]);
  const[domains,setDomains]=useState([]);
  const[mutations,setMutations]=useState([]);
  const[dorks,setDorks]=useState([]);
  const[waybackResults,setWaybackResults]=useState([]);
  const[waybackLoading,setWaybackLoading]=useState(false);
  const[aiReport,setAiReport]=useState("");
  const[aiLoading,setAiLoading]=useState(false);
  const[footprint,setFootprint]=useState(null);
  const[history,setHistory]=useState([]);
  const[expanded,setExpanded]=useState({});
  const[discordData,setDiscordData]=useState(null);
  const timerRef=useRef(0);
  const[elapsed,setElapsed]=useState(0);
  const[copied,setCopied]=useState("");

  const toggle=k=>setExpanded(p=>({...p,[k]:!p[k]}));
  const cp=t=>{navigator.clipboard?.writeText(t);setCopied(t);setTimeout(()=>setCopied(""),1200)};
  const cpAll=items=>{navigator.clipboard?.writeText(items.join("\n"));setCopied("__all");setTimeout(()=>setCopied(""),1200)};

  const runScan=useCallback(async()=>{
    if(!username.trim()||phase!=="idle")return;
    const u=username.trim();timerRef.current=Date.now();
    setPhase("probing");setResults([]);setProbeProgress(0);setAnalysis([]);setEmails([]);setDomains([]);
    setMutations([]);setDorks([]);setWaybackResults([]);setAiReport("");setFootprint(null);setDiscordData(null);
    setActiveTab("platforms");setActiveFilter("all");setStatusFilter("all");setExpanded({});

    // Discord ID lookup
    if(discordId.trim()){
      try{
        const dr=await fetch(`https://discord.id/api/user/${discordId.trim()}`);
        if(dr.ok){const dd=await dr.json();setDiscordData(dd)}
      }catch{}
    }

    const items=P.map(p=>({...p,profileUrl:p.url.replace("{}",u),ps:"pending"}));
    const bs=15;const probed=[...items];
    for(let i=0;i<probed.length;i+=bs){
      const batch=probed.slice(i,i+bs);
      const pr=await Promise.all(batch.map(async item=>{const r=await probeUrl(item.profileUrl);return{...item,ps:r.reachable?"reachable":"unreachable"}}));
      pr.forEach((p,j)=>{probed[i+j]=p});setResults([...probed]);
      setProbeProgress(Math.min(100,Math.round(((i+bs)/probed.length)*100)));
    }
    // Add Discord as special result if ID provided
    if(discordId.trim()){
      probed.push({n:"Discord",profileUrl:`https://discord.id/${discordId.trim()}`,c:"messaging",u:"200M+",i:"DC",ps:"reachable"});
      setResults([...probed]);
    }

    const a=analyzeUsername(u);setAnalysis(a);setEmails(getEmailPerms(u));setDomains(getDomainPerms(u));
    setMutations(getMutations(u));setDorks(getDorks(u));
    const fp=getFootprintScore(probed,a);setFootprint(fp);setHistory(p=>[u,...p.filter(x=>x!==u)].slice(0,15));

    setWaybackLoading(true);
    const topR=probed.filter(r=>r.ps==="reachable").slice(0,10);
    const wb=await Promise.all(topR.map(async r=>{const w=await checkWayback(r.profileUrl);return{platform:r.n,profileUrl:r.profileUrl,...w}}));
    setWaybackResults(wb.filter(w=>w.archived));setWaybackLoading(false);

    setPhase("ai");setAiLoading(true);
    try{
      const reachable=probed.filter(r=>r.ps==="reachable").map(r=>r.n);
      const resp=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        prompt:`You are an OSINT analyst. Target: "${u}". ${discordId?`Discord ID: ${discordId}.`:""} Reachable (${reachable.length}): ${reachable.join(", ")}. Signals: ${a.map(s=>`${s.t}: ${s.d}`).join("; ")}. Score: ${fp.score}/100. Mutations: ${getMutations(u).length}. Wayback hits: ${wb.filter(w=>w.archived).length}. Write a 5-paragraph intelligence briefing covering identity assessment, platform footprint, risk vectors, persona profile, and next steps. Intelligence community tone. No markdown. Bold first 2-3 words per paragraph.`
      })});
      const data=await resp.json();setAiReport(data.content?.map(b=>b.text||"").join("\n")||"AI unavailable.");
    }catch{setAiReport("AI analysis failed.")}
    setAiLoading(false);setPhase("done");
  },[username,discordId,phase]);

  useEffect(()=>{if(phase!=="idle"&&phase!=="done"){const iv=setInterval(()=>setElapsed(((Date.now()-timerRef.current)/1000).toFixed(1)),100);return()=>clearInterval(iv)}},[phase]);

  const filtered=useMemo(()=>{let f=results;if(activeFilter!=="all")f=f.filter(r=>r.c===activeFilter);if(statusFilter==="reachable")f=f.filter(r=>r.ps==="reachable");if(statusFilter==="unreachable")f=f.filter(r=>r.ps==="unreachable");return f},[results,activeFilter,statusFilter]);
  const catCounts=useMemo(()=>{const c={};results.forEach(r=>{c[r.c]=(c[r.c]||0)+1});return c},[results]);
  const rCount=results.filter(r=>r.ps==="reachable").length;
  const uCount=results.filter(r=>r.ps==="unreachable").length;

  const exportTXT=()=>{const l=[`SPECTER v2.5 OSINT REPORT`,`TARGET: ${username}`,discordId?`DISCORD ID: ${discordId}`:"",`DATE: ${new Date().toISOString()}`,`SCORE: ${footprint?.score||0}/100`,"","-- ANALYSIS --",...analysis.map(a=>`[${a.r.toUpperCase()}] ${a.t}: ${a.d}`),"","-- AI BRIEFING --",aiReport||"N/A","","-- MUTATIONS --",...mutations,"","-- DORKS --",...dorks.map(d=>d.q),"","-- EMAILS --",...emails,"","-- DOMAINS --",...domains,"","-- REACHABLE --",...results.filter(r=>r.ps==="reachable").map(r=>`${r.n}: ${r.profileUrl}`),"","-- BLOCKED --",...results.filter(r=>r.ps==="unreachable").map(r=>`${r.n}: ${r.profileUrl}`)].filter(Boolean);const b=new Blob([l.join("\n")],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`SPECTER_${username}.txt`;a.click()};
  const exportJSON=()=>{const d={target:username,discordId,date:new Date().toISOString(),footprint,analysis,emails,domains,mutations,dorks,waybackResults,aiReport,discordData,platforms:results.map(r=>({name:r.n,url:r.profileUrl,category:r.c,status:r.ps}))};const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`SPECTER_${username}.json`;a.click()};
  const exportCSV=()=>{const h="Platform,Category,URL,Status,Users";const rows=results.map(r=>`"${r.n}","${CATS[r.c]?.l||r.c}","${r.profileUrl}","${r.ps}","${r.u||""}"`);const b=new Blob([[h,...rows].join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`SPECTER_${username}.csv`;a.click()};

  const rc={critical:"#e8384f",high:"#f39c12",medium:"#e5a00d",low:"#20c997"};

  const TABS=[
    {k:"platforms",l:"Platforms",ic:Icons.globe},{k:"analysis",l:"Intelligence",ic:Icons.shield},
    {k:"mutations",l:"Mutations",ic:Icons.search},{k:"dorks",l:"Dorks",ic:Icons.eye},
    {k:"wayback",l:"Wayback",ic:Icons.clock},{k:"emails",l:"Emails",ic:Icons.ext},
    {k:"domains",l:"Domains",ic:Icons.globe},{k:"ai",l:"AI Briefing",ic:Icons.alert},
  ];

  // Badge component for platform icons
  const Badge=({text,color})=><div style={{width:30,height:30,borderRadius:4,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color,letterSpacing:-.5,flexShrink:0,border:`1px solid ${color}20`}}>{text}</div>;

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#9ca3af",fontFamily:"'JetBrains Mono',monospace"}}>
      {/* Subtle dot pattern - not a grid */}
      <div style={{position:"fixed",inset:0,opacity:.03,backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:1300,margin:"0 auto",padding:"24px 20px"}}>

        {/* HEADER — clean, no emojis */}
        <div style={{marginBottom:28,display:"flex",alignItems:"flex-end",gap:16,borderBottom:"1px solid #ffffff08",paddingBottom:20}}>
          <div>
            <div style={{fontSize:9,letterSpacing:8,color:"#374151",textTransform:"uppercase",marginBottom:4}}>OSINT Reconnaissance</div>
            <h1 style={{fontSize:44,fontWeight:900,margin:0,color:"#f9fafb",letterSpacing:-3,lineHeight:1}}>SPECTER <span style={{color:"#374151",fontWeight:400}}>v2.5</span></h1>
          </div>
          <div style={{flex:1}}/>
          <div style={{fontSize:10,color:"#1f2937",textAlign:"right",lineHeight:1.6}}>{TOTAL} platforms / 13 categories<br/>Live probe + AI + Wayback + Dorks</div>
        </div>

        {/* SEARCH */}
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <div style={{flex:1,display:"flex",background:"#111118",border:"1px solid #1f2937",borderRadius:6,overflow:"hidden"}}>
              <div style={{padding:"0 14px",display:"flex",alignItems:"center",color:"#374151"}}><Icon d={Icons.search} size={14}/></div>
              <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runScan()} placeholder="Username" style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#e5e7eb",fontSize:14,fontFamily:"inherit",padding:"13px 0"}}/>
            </div>
            <div style={{width:220,display:"flex",background:"#111118",border:"1px solid #1f2937",borderRadius:6,overflow:"hidden"}}>
              <div style={{padding:"0 10px",display:"flex",alignItems:"center",fontSize:9,color:"#4b5563",fontWeight:600,letterSpacing:1}}>DC ID</div>
              <input value={discordId} onChange={e=>setDiscordId(e.target.value)} placeholder="Discord User ID" style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#a78bfa",fontSize:12,fontFamily:"inherit",padding:"13px 0"}}/>
            </div>
            <button onClick={runScan} disabled={phase!=="idle"||!username.trim()} style={{padding:"0 32px",background:phase!=="idle"?"#1f2937":"#f9fafb",color:phase!=="idle"?"#4b5563":"#0a0a0f",border:"none",borderRadius:6,fontFamily:"inherit",fontWeight:800,fontSize:12,cursor:phase!=="idle"?"wait":"pointer",letterSpacing:1,transition:"all .15s"}}>
              {phase==="idle"?"SCAN":phase==="probing"?"PROBING":phase==="ai"?"ANALYZING":"..."}
            </button>
          </div>
          {history.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{history.map(h=><button key={h} onClick={()=>phase==="idle"&&setUsername(h)} style={{padding:"2px 8px",background:"#111118",border:"1px solid #1f2937",borderRadius:3,color:"#374151",fontSize:9,fontFamily:"inherit",cursor:"pointer"}}>{h}</button>)}</div>}
        </div>

        {/* PROGRESS */}
        {phase!=="idle"&&phase!=="done"&&<div style={{marginBottom:20}}><div style={{height:1,background:"#1f2937",borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",width:`${probeProgress}%`,background:"linear-gradient(90deg,#f9fafb,#6366f1)",transition:"width .1s"}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:"#1f2937"}}><span>{phase==="ai"?"AI analysis...":"Probing..."}</span><span>{elapsed}s</span></div></div>}

        {/* DASHBOARD */}
        {results.length>0&&<>
          {/* Stats row */}
          <div style={{display:"flex",gap:1,marginBottom:16,background:"#111118",borderRadius:6,overflow:"hidden",border:"1px solid #1f2937"}}>
            {[{l:"SCANNED",v:results.length,c:"#f9fafb"},{l:"LIVE",v:rCount,c:"#20c997"},{l:"BLOCKED",v:uCount,c:"#e8384f"},{l:"SIGNALS",v:analysis.length||"-",c:"#f39c12"},{l:"MUTATIONS",v:mutations.length||"-",c:"#a78bfa"},{l:"WAYBACK",v:waybackResults.length||"-",c:"#4c9aff"},{l:"SCORE",v:footprint?footprint.score:"-",c:footprint?.score>60?"#e8384f":footprint?.score>30?"#f39c12":"#20c997"}].map((s,i)=><div key={s.l} style={{flex:1,padding:"10px 8px",textAlign:"center",borderRight:i<6?"1px solid #1f2937":"none"}}><div style={{fontSize:16,fontWeight:800,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div><div style={{fontSize:7,letterSpacing:2,color:"#374151",marginTop:2}}>{s.l}</div></div>)}
          </div>

          {/* Discord ID result card */}
          {discordId&&<div style={{marginBottom:12,padding:"12px 16px",background:"#111118",border:"1px solid #7c3aed22",borderRadius:6,display:"flex",alignItems:"center",gap:12}}>
            <Badge text="DC" color="#7c3aed"/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#a78bfa"}}>Discord Lookup</div>
              <div style={{fontSize:10,color:"#4b5563"}}>User ID: {discordId}</div>
            </div>
            <a href={`https://discord.id/${discordId}`} target="_blank" rel="noopener noreferrer" style={{padding:"4px 12px",background:"#7c3aed18",color:"#a78bfa",borderRadius:3,fontSize:10,textDecoration:"none",fontWeight:600,fontFamily:"inherit",border:"1px solid #7c3aed22"}}>View Profile</a>
          </div>}

          {/* Tabs */}
          <div style={{display:"flex",gap:1,marginBottom:14,background:"#111118",borderRadius:6,overflow:"hidden",border:"1px solid #1f2937"}}>
            {TABS.map(t=><button key={t.k} onClick={()=>setActiveTab(t.k)} style={{flex:1,padding:"8px 4px",fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:activeTab===t.k?700:400,letterSpacing:.5,background:activeTab===t.k?"#1f2937":"transparent",color:activeTab===t.k?"#f9fafb":"#374151",border:"none",transition:"all .1s",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon d={t.ic} size={11} color={activeTab===t.k?"#f9fafb":"#374151"}/>{t.l}</button>)}
          </div>
          {/* Export bar */}
          {phase==="done"&&<div style={{display:"flex",gap:4,marginBottom:14,justifyContent:"flex-end"}}>{[{fn:exportTXT,l:"TXT"},{fn:exportJSON,l:"JSON"},{fn:exportCSV,l:"CSV"}].map(e=><button key={e.l} onClick={e.fn} style={{padding:"4px 14px",background:"#111118",border:"1px solid #1f2937",borderRadius:3,color:"#4b5563",fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:600,letterSpacing:1,display:"flex",alignItems:"center",gap:4}}><Icon d={Icons.down} size={10} color="#4b5563"/>{e.l}</button>)}</div>}

          {/* PLATFORMS */}
          {activeTab==="platforms"&&<>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>
              <button onClick={()=>setActiveFilter("all")} style={{padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:activeFilter==="all"?700:400,background:activeFilter==="all"?"#f9fafb":"#111118",color:activeFilter==="all"?"#0a0a0f":"#374151",border:`1px solid ${activeFilter==="all"?"#f9fafb":"#1f2937"}`}}>All ({results.length})</button>
              {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat,count])=><button key={cat} onClick={()=>setActiveFilter(cat)} style={{padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:activeFilter===cat?700:400,background:activeFilter===cat?`${CATS[cat]?.c}18`:"#111118",color:activeFilter===cat?CATS[cat]?.c:"#374151",border:`1px solid ${activeFilter===cat?CATS[cat]?.c+"33":"#1f2937"}`}}>{CATS[cat]?.l} ({count})</button>)}
            </div>
            <div style={{display:"flex",gap:3,marginBottom:10}}>
              {[{k:"all",l:"All"},{k:"reachable",l:"Live"},{k:"unreachable",l:"Blocked"}].map(f=><button key={f.k} onClick={()=>setStatusFilter(f.k)} style={{padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",background:statusFilter===f.k?"#1f2937":"transparent",color:statusFilter===f.k?"#9ca3af":"#374151",border:"1px solid #1f2937"}}>{f.l}</button>)}
            </div>
            {/* TABLE layout — not cards */}
            <div style={{border:"1px solid #1f2937",borderRadius:6,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 70px 20px",padding:"6px 12px",background:"#0d0d14",fontSize:8,letterSpacing:2,color:"#374151",fontWeight:700,borderBottom:"1px solid #1f2937"}}>
                <span></span><span>PLATFORM</span><span>URL</span><span>STATUS</span><span></span>
              </div>
              {filtered.map((r,i)=>{const ok=r.ps==="reachable";const cc=CATS[r.c]?.c||"#666";return(
                <a key={r.n+i} href={r.profileUrl} target="_blank" rel="noopener noreferrer" style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 70px 20px",padding:"7px 12px",alignItems:"center",background:i%2===0?"transparent":"#ffffff02",borderBottom:"1px solid #ffffff04",textDecoration:"none",color:"#9ca3af",transition:"background .1s",opacity:ok?1:.35}} onMouseEnter={e=>e.currentTarget.style.background="#ffffff06"} onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"#ffffff02"}>
                  <Badge text={r.i} color={cc}/>
                  <span style={{fontSize:11,fontWeight:600,color:ok?"#e5e7eb":"#374151"}}>{r.n}</span>
                  <span style={{fontSize:9,color:"#1f2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.profileUrl}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:6,background:ok?"#20c997":"#e8384f",boxShadow:ok?"0 0 6px #20c99744":"none"}}/><span style={{fontSize:8,color:ok?"#20c997":"#374151"}}>{ok?"LIVE":"DOWN"}</span></span>
                  <Icon d={Icons.ext} size={10} color="#1f2937"/>
                </a>
              )})}
            </div>
          </>}

          {/* ANALYSIS */}
          {activeTab==="analysis"&&<div>
            {footprint&&<div style={{padding:20,background:"#111118",border:"1px solid #1f2937",borderRadius:6,marginBottom:14,display:"flex",alignItems:"center",gap:20}}>
              <div style={{width:80,height:80,borderRadius:"50%",border:`3px solid ${footprint.score>60?"#e8384f":footprint.score>30?"#f39c12":"#20c997"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:24,fontWeight:900,color:footprint.score>60?"#e8384f":footprint.score>30?"#f39c12":"#20c997"}}>{footprint.score}</span>
              </div>
              <div><div style={{fontSize:11,fontWeight:700,color:"#e5e7eb"}}>Digital Footprint Score</div><div style={{fontSize:10,color:"#4b5563",marginTop:4}}>{footprint.score>80?"Critical exposure - massive digital presence":footprint.score>60?"High exposure - significant online footprint":footprint.score>40?"Moderate presence":footprint.score>20?"Low exposure":"Minimal footprint"}</div><div style={{fontSize:9,color:"#374151",marginTop:6}}>{footprint.found} platforms reachable across {footprint.catSpread} categories</div></div>
            </div>}
            {["critical","high","medium","low"].map(risk=>{const items=analysis.filter(a=>a.r===risk);if(!items.length)return null;return<div key={risk} style={{marginBottom:8,border:`1px solid ${rc[risk]}18`,borderRadius:6,overflow:"hidden",background:`${rc[risk]}06`}}>
              <div onClick={()=>toggle(risk)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",cursor:"pointer"}}>
                <span style={{fontSize:10,fontWeight:700,color:rc[risk],letterSpacing:1}}>{risk.toUpperCase()} ({items.length})</span>
                <span style={{fontSize:10,color:rc[risk]}}>{expanded[risk]===false?"+":"-"}</span>
              </div>
              {expanded[risk]!==false&&<div style={{padding:"0 14px 10px"}}>{items.map((a,i)=><div key={i} style={{padding:"5px 0",borderTop:i?"1px solid #ffffff06":"none",display:"flex",gap:8}}>
                <span style={{fontSize:7,fontWeight:700,color:rc[risk],background:`${rc[risk]}14`,padding:"2px 5px",borderRadius:2,flexShrink:0,marginTop:2}}>{a.cat?.toUpperCase()}</span>
                <div><div style={{fontSize:11,fontWeight:600,color:"#e5e7eb"}}>{a.t}</div><div style={{fontSize:10,color:"#4b5563"}}>{a.d}</div></div>
              </div>)}</div>}
            </div>})}
          </div>}

          {/* MUTATIONS */}
          {activeTab==="mutations"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:10,color:"#374151"}}>{mutations.length} mutations</span>
              <button onClick={()=>cpAll(mutations)} style={{padding:"3px 10px",fontSize:9,fontFamily:"inherit",cursor:"pointer",background:"#111118",color:"#4b5563",border:"1px solid #1f2937",borderRadius:3,display:"flex",alignItems:"center",gap:4}}><Icon d={copied==="__all"?Icons.check:Icons.copy} size={10}/>{copied==="__all"?"Copied":"Copy All"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:2}}>
              {mutations.map(m=><div key={m} onClick={()=>cp(m)} style={{padding:"5px 10px",background:"#111118",border:"1px solid #1f2937",borderRadius:3,fontSize:10,color:copied===m?"#20c997":"#6b7280",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{m}</span><Icon d={copied===m?Icons.check:Icons.copy} size={10} color={copied===m?"#20c997":"#1f2937"}/></div>)}
            </div>
          </div>}

          {/* DORKS */}
          {activeTab==="dorks"&&<div style={{display:"flex",flexDirection:"column",gap:2}}>
            {dorks.map((d,i)=><a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(d.q)}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 14px",background:"#111118",border:"1px solid #1f2937",borderRadius:4,textDecoration:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#e5a00d",fontWeight:600}}>{d.q}</span>
              <span style={{fontSize:9,color:"#374151",display:"flex",alignItems:"center",gap:6}}>{d.d}<Icon d={Icons.ext} size={10} color="#374151"/></span>
            </a>)}
          </div>}

          {/* WAYBACK */}
          {activeTab==="wayback"&&<div>
            <div style={{fontSize:10,color:"#374151",marginBottom:10}}>Archive.org snapshots{waybackLoading&&<span style={{color:"#4c9aff",marginLeft:8}}>checking...</span>}</div>
            {waybackResults.length>0?<div style={{display:"flex",flexDirection:"column",gap:2}}>{waybackResults.map((w,i)=><a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{padding:"8px 14px",background:"#111118",border:"1px solid #1f2937",borderRadius:4,textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:6,height:6,borderRadius:6,background:"#4c9aff",boxShadow:"0 0 6px #4c9aff44"}}/>
              <div style={{flex:1}}><div style={{fontSize:11,color:"#4c9aff",fontWeight:600}}>{w.platform}</div><div style={{fontSize:9,color:"#374151"}}>{w.profileUrl}</div></div>
              <span style={{fontSize:9,color:"#4b5563"}}>{w.ts?`${w.ts.slice(0,4)}-${w.ts.slice(4,6)}-${w.ts.slice(6,8)}`:""}</span>
              <Icon d={Icons.ext} size={10} color="#374151"/>
            </a>)}</div>:<div style={{padding:30,textAlign:"center",color:"#1f2937",fontSize:10,background:"#111118",borderRadius:6,border:"1px solid #1f2937"}}>No archived snapshots found</div>}
          </div>}

          {/* EMAILS */}
          {activeTab==="emails"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:10,color:"#374151"}}>{emails.length} permutations</span>
              <button onClick={()=>cpAll(emails)} style={{padding:"3px 10px",fontSize:9,fontFamily:"inherit",cursor:"pointer",background:"#111118",color:"#4b5563",border:"1px solid #1f2937",borderRadius:3,display:"flex",alignItems:"center",gap:4}}><Icon d={copied==="__all"?Icons.check:Icons.copy} size={10}/>{copied==="__all"?"Copied":"Copy All"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:2}}>
              {emails.map(e=><div key={e} onClick={()=>cp(e)} style={{padding:"5px 10px",background:"#111118",border:"1px solid #1f2937",borderRadius:3,fontSize:10,color:copied===e?"#20c997":"#6b7280",cursor:"pointer"}}>{e}</div>)}
            </div>
          </div>}

          {/* DOMAINS */}
          {activeTab==="domains"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:2}}>
            {domains.map(d=><a key={d} href={`https://who.is/whois/${d}`} target="_blank" rel="noopener noreferrer" style={{padding:"5px 10px",background:"#111118",border:"1px solid #1f2937",borderRadius:3,fontSize:10,color:"#4c9aff",textDecoration:"none",display:"flex",justifyContent:"space-between"}}><span>{d}</span><span style={{fontSize:8,color:"#374151"}}>WHOIS</span></a>)}
          </div>}

          {/* AI */}
          {activeTab==="ai"&&<div style={{background:"#111118",border:"1px solid #1f2937",borderRadius:6,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid #1f2937",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#e8384f",letterSpacing:1}}>AI INTELLIGENCE BRIEFING</span>
              {aiLoading&&<span style={{fontSize:9,color:"#e8384f",animation:"pulse 1.5s infinite"}}>analyzing...</span>}
            </div>
            <div style={{padding:"14px 16px"}}>{aiReport?<div style={{fontSize:11,lineHeight:1.9,color:"#9ca3af",whiteSpace:"pre-wrap"}}>{aiReport}</div>:aiLoading?<div style={{padding:20,textAlign:"center",color:"#374151",fontSize:10}}>Generating...</div>:<div style={{padding:20,textAlign:"center",color:"#1f2937",fontSize:10}}>Run a scan first</div>}</div>
          </div>}

          {phase==="done"&&<div style={{marginTop:20,padding:10,textAlign:"center",fontSize:8,color:"#111118",letterSpacing:1,borderTop:"1px solid #ffffff04"}}>SPECTER v2.5 / {TOTAL} platforms / Live probing / Wayback / Dorking / Mutations / AI Analysis / No unauthorized access</div>}
        </>}

        {/* EMPTY STATE */}
        {phase==="idle"&&results.length===0&&<div style={{marginTop:60,textAlign:"center"}}>
          <Icon d={Icons.eye} size={40} color="#1f2937"/>
          <div style={{fontSize:10,color:"#1f2937",letterSpacing:2,marginTop:16,lineHeight:2.2,maxWidth:460,margin:"16px auto 0"}}>
            Enter a username to probe {TOTAL} platforms.<br/>
            Optional: Add Discord User ID for direct profile lookup.<br/><br/>
            <span style={{color:"#374151"}}>PROBING / AI BRIEFING / MUTATIONS / DORKING / WAYBACK / EMAIL + DOMAIN RECON / TXT + JSON + CSV</span>
          </div>
        </div>}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#1f2937 transparent}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1f2937;border-radius:2px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}button:hover{filter:brightness(1.15)}a:hover{filter:brightness(1.1)}`}</style>
    </div>
  );
}
