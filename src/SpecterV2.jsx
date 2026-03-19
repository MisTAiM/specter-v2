import { useState, useEffect, useRef, useCallback, useMemo } from "react";
const CATS = {
  social:{l:"Social Media",c:"#ff2d55"},messaging:{l:"Messaging",c:"#af52de"},dev:{l:"Developer",c:"#30d158"},
  gaming:{l:"Gaming",c:"#ffd60a"},professional:{l:"Professional",c:"#0a84ff"},content:{l:"Content & Media",c:"#ff375f"},
  forum:{l:"Forums",c:"#bf5af2"},marketplace:{l:"Marketplace",c:"#64d2ff"},crypto:{l:"Crypto / Web3",c:"#ff9f0a"},
  security:{l:"Security",c:"#ff453a"},education:{l:"Education",c:"#5ac8fa"},fitness:{l:"Fitness",c:"#34c759"},
  dating:{l:"Dating",c:"#ff6482"},
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
  {n:"Truth Social",url:"https://truthsocial.com/@{}",c:"social",u:"5M+",i:"T"},
  {n:"Minds",url:"https://minds.com/{}",c:"social",u:"5M+",i:"\u25b3"},
  {n:"Rumble",url:"https://rumble.com/user/{}",c:"social",u:"80M+",i:"R"},
  {n:"Telegram",url:"https://t.me/{}",c:"messaging",u:"800M+",i:"\u2708"},
  {n:"Discord",url:"https://discord.id/?prefill={}",c:"messaging",u:"200M+",i:"D"},
  {n:"Signal",url:"https://signal.me/#u/{}",c:"messaging",u:"40M+",i:"S"},
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
  {n:"Glitch",url:"https://glitch.com/@{}",c:"dev",u:"5M+",i:"\ud83d\udc1f"},
  {n:"Codeforces",url:"https://codeforces.com/profile/{}",c:"dev",u:"800K+",i:"CF"},
  {n:"Codeberg",url:"https://codeberg.org/{}",c:"dev",u:"200K+",i:"CB"},
  {n:"SourceForge",url:"https://sourceforge.net/u/{}/profile/",c:"dev",u:"3M+",i:"SF"},
  {n:"Steam",url:"https://steamcommunity.com/id/{}",c:"gaming",u:"130M+",i:"\ud83c\udfae"},
  {n:"Xbox",url:"https://xboxgamertag.com/search/{}",c:"gaming",u:"120M+",i:"\ud83d\udfe2"},
  {n:"PSN",url:"https://psnprofiles.com/{}",c:"gaming",u:"110M+",i:"\ud83d\udfe5"},
  {n:"Epic / Fortnite",url:"https://fortnitetracker.com/profile/all/{}",c:"gaming",u:"270M+",i:"E"},
  {n:"Roblox",url:"https://www.roblox.com/user.aspx?username={}",c:"gaming",u:"200M+",i:"R"},
  {n:"Chess.com",url:"https://chess.com/member/{}",c:"gaming",u:"150M+",i:"\u265f"},
  {n:"Lichess",url:"https://lichess.org/@/{}",c:"gaming",u:"10M+",i:"\u265e"},
  {n:"Twitch",url:"https://twitch.tv/{}",c:"gaming",u:"140M+",i:"\ud83d\udcfa"},
  {n:"Speedrun.com",url:"https://speedrun.com/users/{}",c:"gaming",u:"2M+",i:"\u23f1"},
  {n:"osu!",url:"https://osu.ppy.sh/users/{}",c:"gaming",u:"20M+",i:"\u25c9"},
  {n:"NameMC",url:"https://namemc.com/profile/{}",c:"gaming",u:"170M+",i:"\u26cf"},
  {n:"op.gg",url:"https://op.gg/summoners/na/{}",c:"gaming",u:"180M+",i:"\u2694"},
  {n:"Valorant Tracker",url:"https://tracker.gg/valorant/profile/riot/{}%23NA1",c:"gaming",u:"30M+",i:"V"},
  {n:"Itch.io",url:"https://{}.itch.io",c:"gaming",u:"10M+",i:"\ud83d\udd79"},
  {n:"Newgrounds",url:"https://{}.newgrounds.com",c:"gaming",u:"5M+",i:"NG"},
  {n:"Tracker.gg",url:"https://tracker.gg/profile/{}",c:"gaming",u:"50M+",i:"TG"},
  {n:"LinkedIn",url:"https://linkedin.com/in/{}",c:"professional",u:"1B+",i:"in"},
  {n:"AngelList",url:"https://angel.co/u/{}",c:"professional",u:"10M+",i:"\ud83d\ude07"},
  {n:"Crunchbase",url:"https://crunchbase.com/person/{}",c:"professional",u:"5M+",i:"CB"},
  {n:"About.me",url:"https://about.me/{}",c:"professional",u:"10M+",i:"\ud83d\udc64"},
  {n:"Gravatar",url:"https://gravatar.com/{}",c:"professional",u:"100M+",i:"G"},
  {n:"Keybase",url:"https://keybase.io/{}",c:"professional",u:"1M+",i:"\ud83d\udd11"},
  {n:"Notion",url:"https://notion.so/{}",c:"professional",u:"30M+",i:"N"},
  {n:"Polywork",url:"https://polywork.com/{}",c:"professional",u:"1M+",i:"P"},
  {n:"Read.cv",url:"https://read.cv/{}",c:"professional",u:"500K+",i:"cv"},
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
  {n:"Wattpad",url:"https://wattpad.com/user/{}",c:"content",u:"90M+",i:"\ud83d\udcd6"},
  {n:"VSCO",url:"https://vsco.co/{}",c:"content",u:"30M+",i:"\u25fb"},
  {n:"Unsplash",url:"https://unsplash.com/@{}",c:"content",u:"5M+",i:"\ud83d\udcf7"},
  {n:"Giphy",url:"https://giphy.com/{}",c:"content",u:"700M+",i:"\ud83c\udf9e"},
  {n:"Dailymotion",url:"https://dailymotion.com/{}",c:"content",u:"300M+",i:"\u25b6"},
  {n:"Pixiv",url:"https://pixiv.net/users/{}",c:"content",u:"84M+",i:"P"},
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
  {n:"Imgur",url:"https://imgur.com/user/{}",c:"forum",u:"300M+",i:"\ud83d\udcf8"},
  {n:"TripAdvisor",url:"https://tripadvisor.com/Profile/{}",c:"forum",u:"490M+",i:"\ud83c\udf0e"},
  {n:"eBay",url:"https://ebay.com/usr/{}",c:"marketplace",u:"130M+",i:"\ud83d\uded2"},
  {n:"Etsy",url:"https://etsy.com/shop/{}",c:"marketplace",u:"90M+",i:"\ud83e\uddf6"},
  {n:"Poshmark",url:"https://poshmark.com/closet/{}",c:"marketplace",u:"80M+",i:"\ud83d\udc57"},
  {n:"Fiverr",url:"https://fiverr.com/{}",c:"marketplace",u:"50M+",i:"5"},
  {n:"Shopify",url:"https://{}.myshopify.com",c:"marketplace",u:"4M+",i:"\ud83d\udecd"},
  {n:"Gumroad",url:"https://{}.gumroad.com",c:"marketplace",u:"5M+",i:"\ud83d\udcb0"},
  {n:"Ko-fi",url:"https://ko-fi.com/{}",c:"marketplace",u:"1M+",i:"\u2615"},
  {n:"Redbubble",url:"https://redbubble.com/people/{}",c:"marketplace",u:"10M+",i:"\ud83d\udd34"},
  {n:"Society6",url:"https://society6.com/{}",c:"marketplace",u:"5M+",i:"S6"},
  {n:"OpenSea",url:"https://opensea.io/{}",c:"crypto",u:"5M+",i:"\ud83c\udf0a"},
  {n:"ENS",url:"https://app.ens.domains/{}.eth",c:"crypto",u:"3M+",i:"\u25c8"},
  {n:"Mirror.xyz",url:"https://mirror.xyz/{}",c:"crypto",u:"500K+",i:"\ud83e\ude9e"},
  {n:"Rarible",url:"https://rarible.com/{}",c:"crypto",u:"2M+",i:"R"},
  {n:"Foundation",url:"https://foundation.app/@{}",c:"crypto",u:"500K+",i:"F"},
  {n:"HackerOne",url:"https://hackerone.com/{}",c:"security",u:"1M+",i:"\ud83d\udee1"},
  {n:"Bugcrowd",url:"https://bugcrowd.com/{}",c:"security",u:"500K+",i:"\ud83d\udc1b"},
  {n:"TryHackMe",url:"https://tryhackme.com/p/{}",c:"security",u:"3M+",i:"\ud83c\udff4"},
  {n:"Hack The Box",url:"https://app.hackthebox.com/users/{}",c:"security",u:"2M+",i:"\ud83d\udce6"},
  {n:"Duolingo",url:"https://duolingo.com/profile/{}",c:"education",u:"100M+",i:"\ud83e\udd89"},
  {n:"Khan Academy",url:"https://khanacademy.org/profile/{}",c:"education",u:"120M+",i:"KA"},
  {n:"Coursera",url:"https://coursera.org/user/{}",c:"education",u:"130M+",i:"C"},
  {n:"Strava",url:"https://strava.com/athletes/{}",c:"fitness",u:"120M+",i:"\ud83c\udfc3"},
  {n:"Tinder",url:"https://tinder.com/@{}",c:"dating",u:"75M+",i:"\ud83d\udd25"},
];
const TOTAL = P.length;
async function probeUrl(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),5000);try{const r=await fetch(url,{method:"HEAD",mode:"no-cors",signal:c.signal,redirect:"follow"});clearTimeout(t);return{reachable:true,status:r.status||"opaque"}}catch(e){clearTimeout(t);return{reachable:false,status:e.name==="AbortError"?"timeout":"blocked"}}}
async function checkWayback(url){try{const r=await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,{signal:AbortSignal.timeout(6000)});const d=await r.json();if(d.archived_snapshots?.closest?.url)return{archived:true,url:d.archived_snapshots.closest.url,ts:d.archived_snapshots.closest.timestamp};return{archived:false}}catch{return{archived:false}}}
function getMutations(u){const l=u.toLowerCase();const m=new Set();["1","2","_","0","00","01","69","420","x","xx","__","99","98","97","00","01","02","03","04","05"].forEach(n=>m.add(l+n));["the","real","official","not","its","x","_"].forEach(p=>m.add(p+l));if(l.includes("_")){m.add(l.replace(/_/g,""));m.add(l.replace(/_/g,"."));m.add(l.replace(/_/g,"-"))}if(l.includes(".")){m.add(l.replace(/\./g,""));m.add(l.replace(/\./g,"_"))}if(!l.includes("_")&&!l.includes(".")&&l.length>5)for(let i=3;i<l.length-2;i++){m.add(l.slice(0,i)+"_"+l.slice(i));m.add(l.slice(0,i)+"."+l.slice(i))}const lm={"a":"4","e":"3","i":"1","o":"0","s":"5","t":"7"};let lt=l;for(const[a,b]of Object.entries(lm))lt=lt.replaceAll(a,b);if(lt!==l)m.add(lt);const rl={"4":"a","3":"e","1":"i","0":"o","5":"s","7":"t","8":"b"};let ul=l;for(const[a,b]of Object.entries(rl))ul=ul.replaceAll(a,b);if(ul!==l)m.add(ul);const s=l.replace(/\d+/g,"");if(s&&s!==l)m.add(s);m.add(l+l[l.length-1]);m.delete(l);return[...m].slice(0,60)}
function getDorks(u){return[{q:`"${u}"`,d:"Exact match across web"},{q:`"${u}" site:reddit.com`,d:"Reddit posts/comments"},{q:`"${u}" site:x.com OR site:twitter.com`,d:"Twitter/X mentions"},{q:`"${u}" site:github.com`,d:"GitHub repos/issues"},{q:`"${u}" site:pastebin.com OR site:ghostbin.com`,d:"Paste sites (leaks)"},{q:`"${u}" site:youtube.com`,d:"YouTube content"},{q:`"${u}" email OR "@"`,d:"Email exposure"},{q:`"${u}" password OR leak OR breach`,d:"Breach references"},{q:`"${u}" site:linkedin.com`,d:"LinkedIn profiles"},{q:`"${u}" site:steamcommunity.com`,d:"Steam gaming"},{q:`"${u}" filetype:pdf`,d:"PDF documents"},{q:`"${u}" inurl:profile OR inurl:user`,d:"Profile pages"},{q:`"${u}" site:archive.org`,d:"Archived content"},{q:`intitle:"${u}"`,d:"Title mentions"},{q:`"${u}" site:medium.com OR site:dev.to`,d:"Blog posts"},{q:`"${u}" -site:${u}.com`,d:"External mentions"}]}
function analyzeUsername(u){const s=[];const l=u.toLowerCase();if(u.length<=3)s.push({t:"OG Handle",d:`${u.length} chars \u2014 high-value`,r:"high",cat:"identity"});else if(u.length<=5)s.push({t:"Short Handle",d:`${u.length} chars \u2014 desirable`,r:"medium",cat:"identity"});else if(u.length>20)s.push({t:"Extended Handle",d:`${u.length} chars \u2014 possible alt`,r:"medium",cat:"identity"});if(/^[a-z]+[._][a-z]+$/i.test(u))s.push({t:"Real Name Pattern",d:"firstname.lastname \u2014 strong PII",r:"critical",cat:"pii"});if(/^[a-z]+[._][a-z]+[0-9]{2,4}$/i.test(u))s.push({t:"Name + Year",d:"Name + trailing number \u2014 birth/grad year",r:"critical",cat:"pii"});const tr=u.match(/(\d{4})$/);if(tr){const yr=parseInt(tr[1]);if(yr>=1960&&yr<=2012)s.push({t:"Birth Year",d:`"${tr[1]}" \u2192 age ~${2026-yr}`,r:"critical",cat:"pii"});else if(yr>=2013&&yr<=2026)s.push({t:"Year Marker",d:`"${tr[1]}" \u2014 creation/grad year`,r:"medium",cat:"temporal"})}const t2=u.match(/(\d{2})$/);if(t2&&!tr){const n=parseInt(t2[1]);if(n>=60&&n<=99)s.push({t:"Birth Year (2d)",d:`"${t2[1]}" \u2192 born 19${t2[1]}? Age ~${2026-1900-n}`,r:"high",cat:"pii"});if(n>=0&&n<=12)s.push({t:"Birth Year (2d)",d:`"${t2[1]}" \u2192 born 20${t2[1].padStart(2,'0')}? Age ~${2026-2000-n}`,r:"high",cat:"pii"})}const pf={"the":"ownership","real":"authenticity","official":"brand","not":"negation","its":"identity","mr":"honorific","ms":"honorific","im":"identity"};for(const[p,d]of Object.entries(pf)){if(l.startsWith(p)&&u.length>p.length+2){s.push({t:"Prefix",d:`"${p}" ${d} \u2014 primary "${u.slice(p.length)}" was taken`,r:"medium",cat:"identity"});break}}if(/[0-9]/.test(u)&&/[a-zA-Z]/.test(u)){const lm={"0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","8":"b"};let d=u;for(const[n,c]of Object.entries(lm))d=d.replaceAll(n,c);if(d.toLowerCase()!==u.toLowerCase())s.push({t:"Leet Speak",d:`Decoded: "${d}"`,r:"medium",cat:"identity"})}if(/(.)\1{2,}/.test(u))s.push({t:"Char Repetition",d:"Stylized repeats",r:"low",cat:"style"});const uc=(u.match(/_/g)||[]).length;if(uc>=3)s.push({t:"Heavy Formatting",d:`${uc} underscores`,r:"medium",cat:"style"});if(u===u.toLowerCase()&&/[a-z]/.test(u))s.push({t:"All Lowercase",d:"Deliberate branding",r:"low",cat:"style"});const edgy=["dark","shadow","ghost","phantom","night","death","demon","chaos","void","null","zero","neo","cyber","hack","rage","fury","toxic","elite","sniper","reaper","wolf","ninja","dragon","king"];for(const w of edgy){if(l.includes(w)){s.push({t:"Thematic",d:`"${w}" \u2014 gaming/hacker culture`,r:"low",cat:"persona"});break}}const cn=["john","james","mike","chris","alex","david","sarah","emma","jake","nick","matt","ryan","adam","jason","andrew","daniel","josh","tyler","max","sam","ben","tom","joe"];for(const n of cn){if(l===n||l.startsWith(n+"_")||l.startsWith(n+".")){s.push({t:"Common Name",d:`"${n}" \u2014 high cross-ref probability`,r:"high",cat:"pii"});break}}const cs=new Set(u.split(""));const ent=Math.log2(Math.pow(cs.size,u.length));if(ent>40)s.push({t:"High Entropy",d:`${ent.toFixed(1)} bits`,r:"low",cat:"technical"});if(ent<15&&u.length>3)s.push({t:"Low Entropy",d:`${ent.toFixed(1)} bits \u2014 predictable`,r:"medium",cat:"technical"});return s}
function getEmailPerms(u){const b=u.toLowerCase().replace(/[^a-z0-9._-]/gi,"");const pr=["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com","icloud.com","pm.me","aol.com","tutanota.com","zoho.com","fastmail.com","hey.com"];const v=[b];if(b.includes("_"))v.push(b.replace(/_/g,"."),b.replace(/_/g,""));if(b.includes("."))v.push(b.replace(/\./g,"_"),b.replace(/\./g,""));const r=[];const s=new Set();for(const x of v)for(const p of pr){const e=`${x}@${p}`;if(!s.has(e)){s.add(e);r.push(e)}}return r}
function getDomainPerms(u){const b=u.toLowerCase().replace(/[^a-z0-9-]/gi,"");return[".com",".net",".org",".io",".dev",".co",".me",".xyz",".app",".tech",".info",".page",".site",".gg"].map(t=>b+t)}
function getFootprintScore(r,a){const f=r.filter(x=>x.probeStatus==="reachable").length;const c=new Set(r.filter(x=>x.probeStatus==="reachable").map(x=>x.c)).size;const rs=a.filter(x=>x.r==="critical"||x.r==="high").length;return{score:Math.min(100,Math.round((f/TOTAL)*60+c*4+rs*5)),found:f,catSpread:c,riskSignals:rs}}

export default function SpecterV2(){
  const[username,setUsername]=useState("");const[phase,setPhase]=useState("idle");const[results,setResults]=useState([]);
  const[probeProgress,setProbeProgress]=useState(0);const[activeTab,setActiveTab]=useState("platforms");
  const[activeFilter,setActiveFilter]=useState("all");const[statusFilter,setStatusFilter]=useState("all");
  const[analysis,setAnalysis]=useState([]);const[emails,setEmails]=useState([]);const[domains,setDomains]=useState([]);
  const[mutations,setMutations]=useState([]);const[dorks,setDorks]=useState([]);
  const[waybackResults,setWaybackResults]=useState([]);const[waybackLoading,setWaybackLoading]=useState(false);
  const[aiReport,setAiReport]=useState("");const[aiLoading,setAiLoading]=useState(false);
  const[footprint,setFootprint]=useState(null);const[history,setHistory]=useState([]);
  const[expandedSections,setExpandedSections]=useState({});const scanStartRef=useRef(0);
  const[elapsed,setElapsed]=useState(0);const[copied,setCopied]=useState("");

  const toggleSection=(k)=>setExpandedSections(p=>({...p,[k]:!p[k]}));
  const copyText=(t)=>{navigator.clipboard?.writeText(t);setCopied(t);setTimeout(()=>setCopied(""),1500)};
  const copyAll=(items)=>{navigator.clipboard?.writeText(items.join("\n"));setCopied("__all__");setTimeout(()=>setCopied(""),1500)};

  const runScan=useCallback(async()=>{
    if(!username.trim()||phase!=="idle")return;const u=username.trim();scanStartRef.current=Date.now();
    setPhase("scanning");setResults([]);setProbeProgress(0);setAnalysis([]);setEmails([]);setDomains([]);
    setMutations([]);setDorks([]);setWaybackResults([]);setAiReport("");setFootprint(null);
    setActiveTab("platforms");setActiveFilter("all");setStatusFilter("all");setExpandedSections({});
    const items=P.map(p=>({...p,profileUrl:p.url.replace("{}",u),probeStatus:"pending"}));
    setPhase("probing");const bs=15;const probed=[...items];
    for(let i=0;i<probed.length;i+=bs){const batch=probed.slice(i,i+bs);const pr=await Promise.all(batch.map(async item=>{const r=await probeUrl(item.profileUrl);return{...item,probeStatus:r.reachable?"reachable":"unreachable",httpDetail:r.status}}));pr.forEach((p,j)=>{probed[i+j]=p});setResults([...probed]);setProbeProgress(Math.min(100,Math.round(((i+bs)/probed.length)*100)))}
    const a=analyzeUsername(u);setAnalysis(a);setEmails(getEmailPerms(u));setDomains(getDomainPerms(u));
    setMutations(getMutations(u));setDorks(getDorks(u));
    const fp=getFootprintScore(probed,a);setFootprint(fp);setHistory(p=>[u,...p.filter(x=>x!==u)].slice(0,15));
    setWaybackLoading(true);const topR=probed.filter(r=>r.probeStatus==="reachable").slice(0,10);
    const wb=await Promise.all(topR.map(async r=>{const w=await checkWayback(r.profileUrl);return{platform:r.n,profileUrl:r.profileUrl,...w}}));
    setWaybackResults(wb.filter(w=>w.archived));setWaybackLoading(false);
    setPhase("ai");setAiLoading(true);
    try{const reachable=probed.filter(r=>r.probeStatus==="reachable").map(r=>r.n);const unreachable=probed.filter(r=>r.probeStatus==="unreachable").map(r=>r.n);
    const resp=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:`You are an OSINT analyst. Target: "${u}". Reachable (${reachable.length}): ${reachable.join(", ")}. Unreachable (${unreachable.length}): ${unreachable.join(", ")}. Signals: ${a.map(s=>`${s.t}: ${s.d}`).join("; ")}. Emails: ${getEmailPerms(u).length}. Mutations: ${getMutations(u).length}. Wayback archived: ${wb.filter(w=>w.archived).length}. Score: ${fp.score}/100. Write a 5-paragraph intel briefing: 1) IDENTITY ASSESSMENT 2) PLATFORM FOOTPRINT 3) RISK VECTORS 4) PERSONA PROFILE 5) RECOMMENDATIONS. Intelligence community tone. No markdown headers. Bold first 2-3 words of each paragraph.`})});
    const data=await resp.json();setAiReport(data.content?.map(b=>b.text||"").join("\n")||"AI analysis unavailable.")}catch{setAiReport("AI analysis could not be completed.")}
    setAiLoading(false);setPhase("done");
  },[username,phase]);

  useEffect(()=>{if(phase!=="idle"&&phase!=="done"){const iv=setInterval(()=>setElapsed(((Date.now()-scanStartRef.current)/1000).toFixed(1)),100);return()=>clearInterval(iv)}},[phase]);
  const filtered=useMemo(()=>{let f=results;if(activeFilter!=="all")f=f.filter(r=>r.c===activeFilter);if(statusFilter==="reachable")f=f.filter(r=>r.probeStatus==="reachable");if(statusFilter==="unreachable")f=f.filter(r=>r.probeStatus==="unreachable");return f},[results,activeFilter,statusFilter]);
  const catCounts=useMemo(()=>{const c={};results.forEach(r=>{c[r.c]=(c[r.c]||0)+1});return c},[results]);
  const reachableCount=results.filter(r=>r.probeStatus==="reachable").length;
  const unreachableCount=results.filter(r=>r.probeStatus==="unreachable").length;

  const exportFull=()=>{const lines=[`SPECTER v2.5 OSINT REPORT`,"",`TARGET: ${username}`,`DATE: ${new Date().toISOString()}`,`PLATFORMS: ${results.length} | REACHABLE: ${reachableCount} | UNREACHABLE: ${unreachableCount}`,`FOOTPRINT: ${footprint?.score||0}/100`,"","== ANALYSIS ==",...analysis.map(a=>`  [${a.r.toUpperCase().padEnd(8)}] ${a.t}: ${a.d}`),"","== AI BRIEFING ==",aiReport||"N/A","","== MUTATIONS ==",...mutations.map(m=>`  ${m}`),"","== DORKS ==",...dorks.map(d=>`  ${d.q}`),"","== WAYBACK ==",...waybackResults.map(w=>`  ${w.platform}: ${w.url}`),"","== EMAILS ==",...emails.map(e=>`  ${e}`),"","== DOMAINS ==",...domains.map(d=>`  ${d}`),"","== REACHABLE ==",...results.filter(r=>r.probeStatus==="reachable").map(r=>`  ${r.n.padEnd(22)} ${r.profileUrl}`),"","== UNREACHABLE ==",...results.filter(r=>r.probeStatus==="unreachable").map(r=>`  ${r.n.padEnd(22)} ${r.profileUrl}`)];const blob=new Blob([lines.join("\n")],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`SPECTER_${username}_${Date.now()}.txt`;a.click()};
  const exportJSON=()=>{const data={target:username,date:new Date().toISOString(),footprint,analysis,emails,domains,mutations,dorks,waybackResults,aiReport,platforms:results.map(r=>({name:r.n,url:r.profileUrl,category:r.c,status:r.probeStatus}))};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`SPECTER_${username}_${Date.now()}.json`;a.click()};
  const exportCSV=()=>{const h="Platform,Category,URL,Status,Users";const rows=results.map(r=>`"${r.n}","${CATS[r.c]?.l||r.c}","${r.profileUrl}","${r.probeStatus}","${r.u}"`);const blob=new Blob([[h,...rows].join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`SPECTER_${username}_${Date.now()}.csv`;a.click()};

  const rc={critical:"#ff453a",high:"#ff9f0a",medium:"#ffd60a",low:"#30d158"};
  const pill=(a,c)=>({padding:"4px 11px",borderRadius:3,fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:a?700:400,letterSpacing:.5,background:a?`${c}18`:"rgba(255,255,255,.02)",color:a?c:"#4a5568",border:`1px solid ${a?c+"33":"rgba(255,255,255,.05)"}`,transition:"all .15s"});
  const card={background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.05)",borderRadius:4,padding:"10px 14px",transition:"all .15s"};
  const sBox=c=>({background:`${c}08`,border:`1px solid ${c}18`,borderRadius:6,marginBottom:12,overflow:"hidden"});

  const TABS=[{k:"platforms",l:"\u25c6 Platforms",c:"#00ff64"},{k:"analysis",l:"\u25b2 Intelligence",c:"#ff9f0a"},{k:"mutations",l:"\u2042 Mutations",c:"#d946ef"},{k:"dorks",l:"\u2315 Google Dorks",c:"#ffd60a"},{k:"wayback",l:"\u29d6 Wayback",c:"#64d2ff"},{k:"emails",l:"\u2709 Emails",c:"#af52de"},{k:"domains",l:"\u25c8 Domains",c:"#00e5ff"},{k:"ai",l:"\ud83e\udde0 AI Briefing",c:"#ff453a"}];

  return(
    <div style={{minHeight:"100vh",background:"#050508",color:"#a8b2c1",fontFamily:"'IBM Plex Mono','Fira Code','SF Mono',monospace",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,opacity:0.025,backgroundImage:"linear-gradient(rgba(0,255,100,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,100,.4) 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>
      <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.012) 3px,rgba(0,0,0,.012) 6px)"}}/>
      <div style={{position:"relative",zIndex:2,maxWidth:1320,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",padding:"3px 14px",border:"1px solid rgba(0,255,100,.12)",borderRadius:2,fontSize:9,letterSpacing:6,color:"#00ff64",textTransform:"uppercase",marginBottom:6}}>Advanced OSINT Reconnaissance Suite</div>
          <h1 style={{fontSize:"clamp(42px,7vw,68px)",fontWeight:900,margin:"0 0 2px",letterSpacing:-3,background:"linear-gradient(135deg,#00ff64 0%,#00e5ff 35%,#d946ef 70%,#ff453a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>SPECTER<span style={{fontSize:"clamp(14px,2vw,20px)",letterSpacing:2,opacity:.5}}> v2.5</span></h1>
          <p style={{color:"#1e2535",fontSize:10,letterSpacing:3,margin:0}}>{TOTAL} TARGETS \u2022 PROBING \u2022 AI \u2022 DORKING \u2022 WAYBACK \u2022 MUTATIONS</p>
        </div>
        <div style={{display:"flex",gap:6,maxWidth:660,margin:"0 auto 14px",background:"rgba(0,255,100,.02)",border:"1px solid rgba(0,255,100,.1)",borderRadius:6,padding:3}}>
          <div style={{display:"flex",alignItems:"center",padding:"0 10px",color:"#00ff64",fontSize:16,opacity:.35,fontWeight:900}}>{"\u27e9"}</div>
          <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runScan()} placeholder="target username..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#e2e8f0",fontSize:15,fontFamily:"inherit",padding:"12px 0"}}/>
          <button onClick={runScan} disabled={phase!=="idle"||!username.trim()} style={{padding:"10px 28px",background:phase!=="idle"?"rgba(0,255,100,.06)":"linear-gradient(135deg,#00ff64,#00cc50)",color:phase!=="idle"?"#00ff64":"#000",border:"none",borderRadius:4,fontFamily:"inherit",fontWeight:800,fontSize:12,cursor:phase!=="idle"?"wait":"pointer",letterSpacing:2,transition:"all .2s"}}>{phase==="idle"?"HUNT":phase==="probing"?"PROBING...":phase==="ai"?"AI ANALYSIS...":"SCANNING..."}</button>
        </div>
        {history.length>0&&<div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>{history.map(h=><button key={h} onClick={()=>{if(phase==="idle")setUsername(h)}} style={{padding:"2px 8px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:2,color:"#3a4050",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>{h}</button>)}</div>}
        {phase!=="idle"&&phase!=="done"&&<div style={{maxWidth:660,margin:"0 auto 18px"}}><div style={{height:2,background:"rgba(0,255,100,.06)",borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",width:`${probeProgress}%`,background:"linear-gradient(90deg,#00ff64,#00e5ff,#d946ef)",transition:"width .1s",boxShadow:"0 0 16px rgba(0,255,100,.4)"}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:"#2a3040"}}><span>{phase==="ai"?"AI analysis...":"Probing..."}</span><span>{elapsed}s \u2022 {probeProgress}%</span></div></div>}
        {results.length>0&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(95px,1fr))",gap:4,marginBottom:12}}>{[{l:"Scanned",v:results.length,c:"#00ff64"},{l:"Reachable",v:reachableCount,c:"#00e5ff"},{l:"Blocked",v:unreachableCount,c:"#ff453a"},{l:"Categories",v:Object.keys(catCounts).length,c:"#d946ef"},{l:"Emails",v:emails.length||"\u2014",c:"#ff9f0a"},{l:"Mutations",v:mutations.length||"\u2014",c:"#af52de"},{l:"Dorks",v:dorks.length||"\u2014",c:"#ffd60a"},{l:"Wayback",v:waybackResults.length||"\u2014",c:"#64d2ff"},{l:"Signals",v:analysis.length||"\u2014",c:"#ff375f"},{l:"Score",v:footprint?`${footprint.score}`+"/100":"\u2014",c:footprint?.score>66?"#ff453a":footprint?.score>33?"#ffd60a":"#30d158"}].map(s=><div key={s.l} style={{...card,textAlign:"center",padding:"7px 4px"}}><div style={{fontSize:15,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:7,letterSpacing:1.5,color:"#2a3040",textTransform:"uppercase"}}>{s.l}</div></div>)}</div>
          <div style={{display:"flex",gap:2,marginBottom:12,borderBottom:"1px solid rgba(255,255,255,.03)",paddingBottom:7,flexWrap:"wrap"}}>{TABS.map(t=><button key={t.k} onClick={()=>setActiveTab(t.k)} style={{padding:"5px 12px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",fontWeight:activeTab===t.k?700:400,letterSpacing:.5,background:activeTab===t.k?`${t.c}12`:"transparent",color:activeTab===t.k?t.c:"#3a4050",border:activeTab===t.k?`1px solid ${t.c}28`:"1px solid transparent",transition:"all .15s"}}>{t.l}</button>)}<div style={{flex:1}}/>{phase==="done"&&<div style={{display:"flex",gap:2}}><button onClick={exportFull} style={{padding:"4px 10px",borderRadius:3,fontSize:8,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1,background:"rgba(0,229,255,.06)",color:"#00e5ff",border:"1px solid rgba(0,229,255,.15)"}}>TXT</button><button onClick={exportJSON} style={{padding:"4px 10px",borderRadius:3,fontSize:8,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1,background:"rgba(217,70,239,.06)",color:"#d946ef",border:"1px solid rgba(217,70,239,.15)"}}>JSON</button><button onClick={exportCSV} style={{padding:"4px 10px",borderRadius:3,fontSize:8,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1,background:"rgba(255,214,10,.06)",color:"#ffd60a",border:"1px solid rgba(255,214,10,.15)"}}>CSV</button></div>}</div>

          {activeTab==="platforms"&&<><div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}><button onClick={()=>setActiveFilter("all")} style={pill(activeFilter==="all","#00ff64")}>ALL ({results.length})</button>{Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat,count])=><button key={cat} onClick={()=>setActiveFilter(cat)} style={pill(activeFilter===cat,CATS[cat]?.c||"#888")}>{CATS[cat]?.l||cat} ({count})</button>)}</div><div style={{display:"flex",gap:3,marginBottom:10}}>{[{k:"all",l:"All"},{k:"reachable",l:"\ud83d\udfe2 Reachable"},{k:"unreachable",l:"\ud83d\udd34 Blocked"}].map(f=><button key={f.k} onClick={()=>setStatusFilter(f.k)} style={pill(statusFilter===f.k,statusFilter===f.k&&f.k==="reachable"?"#30d158":statusFilter===f.k&&f.k==="unreachable"?"#ff453a":"#00ff64")}>{f.l}</button>)}<div style={{flex:1}}/><span style={{fontSize:8,color:"#2a3040",alignSelf:"center"}}>{filtered.length} results</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:4}}>{filtered.map((r,i)=>{const ok=r.probeStatus==="reachable";const pend=r.probeStatus==="pending";const cc=CATS[r.c]?.c||"#666";return<a key={r.n+i} href={r.profileUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:ok?`${cc}06`:"rgba(255,255,255,.008)",border:`1px solid ${ok?cc+"1a":"rgba(255,255,255,.03)"}`,borderRadius:4,textDecoration:"none",color:"#c8d6e5",transition:"all .12s",cursor:"pointer",opacity:pend?.35:ok?1:.4}} onMouseEnter={e=>{e.currentTarget.style.background=`${cc}15`}} onMouseLeave={e=>{e.currentTarget.style.background=ok?`${cc}06`:"rgba(255,255,255,.008)"}}><div style={{width:28,height:28,borderRadius:3,background:`${cc}0c`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,border:`1px solid ${cc}14`}}>{r.i}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,fontWeight:600,color:ok?"#dde4ed":"#3a4050"}}>{r.n}</span><span style={{width:5,height:5,borderRadius:9,flexShrink:0,background:pend?"#3a4050":ok?"#30d158":"#ff453a",boxShadow:ok?"0 0 5px #30d158":"none"}}/></div><div style={{fontSize:8,color:"#1e2535",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.profileUrl}</div></div><div style={{fontSize:7,color:cc,padding:"2px 4px",background:`${cc}0c`,borderRadius:2,flexShrink:0}}>{r.u}</div></a>})}</div></>}

          {activeTab==="analysis"&&<div>{footprint&&<div style={{...card,textAlign:"center",padding:16,marginBottom:12}}><div style={{fontSize:8,letterSpacing:3,color:"#3a4050",textTransform:"uppercase",marginBottom:5}}>Digital Footprint Score</div><div style={{position:"relative",width:200,height:10,background:"rgba(255,255,255,.04)",borderRadius:5,margin:"0 auto 6px",overflow:"hidden"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${footprint.score}%`,borderRadius:5,background:footprint.score>66?"linear-gradient(90deg,#ff9f0a,#ff453a)":footprint.score>33?"linear-gradient(90deg,#ffd60a,#ff9f0a)":"linear-gradient(90deg,#30d158,#ffd60a)",transition:"width .5s"}}/></div><div style={{fontSize:28,fontWeight:900,color:footprint.score>66?"#ff453a":footprint.score>33?"#ffd60a":"#30d158"}}>{footprint.score}<span style={{fontSize:12,opacity:.5}}>/100</span></div><div style={{fontSize:9,color:"#3a4050",marginTop:2}}>{footprint.score>80?"CRITICAL EXPOSURE":footprint.score>60?"HIGH":footprint.score>40?"MODERATE":footprint.score>20?"LOW":"MINIMAL"}</div></div>}{["critical","high","medium","low"].map(risk=>{const items=analysis.filter(a=>a.r===risk);if(!items.length)return null;return<div key={risk} style={sBox(rc[risk])}><div onClick={()=>toggleSection(risk)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",userSelect:"none"}}><span style={{fontSize:10,letterSpacing:2,color:rc[risk],fontWeight:700}}>{"\u25b2"} {risk.toUpperCase()} ({items.length})</span><span style={{fontSize:12,color:rc[risk]}}>{expandedSections[risk]===false?"\u25b8":"\u25be"}</span></div>{expandedSections[risk]!==false&&<div style={{padding:"0 14px 10px"}}>{items.map((a,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,.02)":"none"}}><span style={{padding:"2px 5px",borderRadius:2,fontSize:7,fontWeight:700,letterSpacing:1,background:`${rc[risk]}18`,color:rc[risk],flexShrink:0,marginTop:2}}>{a.cat?.toUpperCase()}</span><div><div style={{fontSize:11,fontWeight:600,color:"#dde4ed"}}>{a.t}</div><div style={{fontSize:10,color:"#5a6578",marginTop:1}}>{a.d}</div></div></div>)}</div>}</div>})}</div>}

          {activeTab==="mutations"&&<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:10,color:"#3a4050"}}>{mutations.length} mutations</div><button onClick={()=>copyAll(mutations)} style={{padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",background:"rgba(217,70,239,.08)",color:"#d946ef",border:"1px solid rgba(217,70,239,.15)",fontWeight:600}}>{copied==="__all__"?"\u2713 Copied":"Copy All"}</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:3}}>{mutations.map(m=><div key={m} onClick={()=>copyText(m)} style={{...card,fontSize:10,color:copied===m?"#30d158":"#8b9dc3",padding:"5px 10px",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{m}</span><span style={{fontSize:8,color:copied===m?"#30d158":"#2a3040"}}>{copied===m?"\u2713":"copy"}</span></div>)}</div><div style={{fontSize:9,color:"#1e2535",marginTop:10}}>Includes: suffixes, prefixes, separators, leet/unleet, stripped numbers, char doubling</div></div>}

          {activeTab==="dorks"&&<div><div style={{fontSize:10,color:"#3a4050",marginBottom:10}}>Google Dork queries \u2014 click to search</div><div style={{display:"flex",flexDirection:"column",gap:4}}>{dorks.map((d,i)=><a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(d.q)}`} target="_blank" rel="noopener noreferrer" style={{...card,textDecoration:"none",padding:"8px 12px",display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:11,color:"#ffd60a",fontWeight:600,flex:1,wordBreak:"break-all"}}>{d.q}</span><span style={{fontSize:9,color:"#3a4050",flexShrink:0,maxWidth:200,textAlign:"right"}}>{d.d}</span><span style={{color:"#2a3040",fontSize:11,flexShrink:0}}>{"\u2197"}</span></a>)}</div></div>}

          {activeTab==="wayback"&&<div><div style={{fontSize:10,color:"#3a4050",marginBottom:10}}>Wayback Machine checks{waybackLoading&&<span style={{color:"#64d2ff",marginLeft:8,animation:"pulse 1.5s infinite"}}>Checking...</span>}</div>{waybackResults.length>0?<div style={{display:"flex",flexDirection:"column",gap:4}}>{waybackResults.map((w,i)=><a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{...card,textDecoration:"none",padding:"8px 12px",display:"flex",gap:10,alignItems:"center"}}><span style={{width:8,height:8,borderRadius:9,background:"#64d2ff",flexShrink:0,boxShadow:"0 0 6px #64d2ff"}}/><div style={{flex:1}}><div style={{fontSize:11,color:"#64d2ff",fontWeight:600}}>{w.platform}</div><div style={{fontSize:9,color:"#3a4050"}}>{w.profileUrl}</div></div><div style={{fontSize:9,color:"#4a5568"}}>{w.ts?`${w.ts.substring(0,4)}-${w.ts.substring(4,6)}-${w.ts.substring(6,8)}`:""}</div><span style={{color:"#2a3040",fontSize:11}}>{"\u2197"}</span></a>)}</div>:!waybackLoading&&<div style={{...card,textAlign:"center",padding:30,color:"#2a3040",fontSize:11}}>No archived snapshots found</div>}<div style={{fontSize:9,color:"#1e2535",marginTop:10}}>Checks top 10 reachable profiles via Wayback Availability API</div></div>}

          {activeTab==="emails"&&<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:10,color:"#3a4050"}}>{emails.length} emails</div><button onClick={()=>copyAll(emails)} style={{padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",background:"rgba(175,82,222,.08)",color:"#af52de",border:"1px solid rgba(175,82,222,.15)",fontWeight:600}}>{copied==="__all__"?"\u2713 Copied":"Copy All"}</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:3}}>{emails.map(e=><div key={e} onClick={()=>copyText(e)} style={{...card,fontSize:10,color:copied===e?"#30d158":"#7a8899",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px",cursor:"pointer"}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e}</span><span style={{fontSize:8,color:copied===e?"#30d158":"#2a3040",flexShrink:0}}>{copied===e?"\u2713":"copy"}</span></div>)}</div></div>}

          {activeTab==="domains"&&<div><div style={{fontSize:10,color:"#3a4050",marginBottom:10}}>Domain permutations \u2014 click for WHOIS</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:3}}>{domains.map(d=><a key={d} href={`https://who.is/whois/${d}`} target="_blank" rel="noopener noreferrer" style={{...card,fontSize:10,color:"#00e5ff",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px"}}><span>{d}</span><span style={{fontSize:8,color:"#2a3040"}}>WHOIS {"\u2197"}</span></a>)}</div></div>}

          {activeTab==="ai"&&<div style={sBox("#ff453a")}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid rgba(255,69,58,.08)"}}><span style={{fontSize:10,letterSpacing:2,color:"#ff453a",fontWeight:700}}>{"\ud83e\udde0"} AI INTELLIGENCE BRIEFING</span>{aiLoading&&<span style={{fontSize:9,color:"#ff453a",animation:"pulse 1.5s infinite"}}>Analyzing...</span>}</div><div style={{padding:"12px 14px"}}>{aiReport?<div style={{fontSize:11,lineHeight:1.8,color:"#a8b2c1",whiteSpace:"pre-wrap"}}>{aiReport}</div>:aiLoading?<div style={{textAlign:"center",padding:30,color:"#2a3040",fontSize:10}}>Generating briefing...</div>:<div style={{textAlign:"center",padding:30,color:"#2a3040",fontSize:10}}>Run a scan first</div>}</div></div>}

          {phase==="done"&&<div style={{textAlign:"center",marginTop:14,padding:10,fontSize:8,color:"#141a28",letterSpacing:1,borderTop:"1px solid rgba(255,255,255,.02)"}}>SPECTER v2.5 \u2022 {TOTAL} platforms \u2022 Live probing \u2022 Wayback Machine \u2022 Google Dorking \u2022 Mutation Engine \u2022 AI Analysis \u2022 No unauthorized access</div>}
        </>}
        {phase==="idle"&&results.length===0&&<div style={{textAlign:"center",marginTop:44,padding:32}}><div style={{fontSize:52,marginBottom:12,opacity:.08}}>{"\ud83d\udc41"}</div><div style={{fontSize:10,color:"#141a28",letterSpacing:2,maxWidth:520,margin:"0 auto",lineHeight:2}}>Enter a username to begin recon across {TOTAL} platforms.<br/><br/><span style={{color:"#1e2535"}}>LIVE PROBING \u2022 AI BRIEFING \u2022 USERNAME ANALYSIS \u2022 MUTATION ENGINE<br/>GOOGLE DORKING \u2022 WAYBACK MACHINE \u2022 EMAIL PERMUTATION<br/>DOMAIN RECON \u2022 FOOTPRINT SCORING \u2022 TXT / JSON / CSV EXPORT</span></div></div>}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#141a28 transparent}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#141a28;border-radius:3px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}button:hover{filter:brightness(1.12)}a:hover{filter:brightness(1.08)}`}</style>
    </div>
  );
}
