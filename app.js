(() => {
"use strict";
const CFG = Object.assign({goatcounter:"", feedbackUrl:"", submitUrl:"", pilotName:""}, window.UNILONDON_CONFIG || {});

/* ================= reference data ================= */
const ICONS = {
  food:'<path d="M7 3v7M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 10v11M17 3c-2 1.2-3 4-3 7.5h3V21"/>',
  work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
  careers:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  events:'<path d="M12 3l2.3 5.4L20 10l-4.4 3.8L17 20l-5-3-5 3 1.4-6.2L4 10l5.7-1.6z"/>',
  study:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M20 18v3H6.5"/>',
  housing:'<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
  sport:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4zM12 3v4.5M20.5 9.5l-4.7.8M17.5 19.5l-3-4.8M6.5 19.5l3-4.8M3.5 9.5l4.7.8"/>',
  funding:'<circle cx="12" cy="12" r="9"/><path d="M14.8 8.3A2.6 2.6 0 0 0 10 9.8V16M8 12.5h5M8 16h8"/>',
  deals:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.4"/>',
  today:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  map:'<path d="M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  plan:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  ask:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
  save:'<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  pin:'<path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  send:'<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  hide:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.9M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 19 12 19a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  share:'<path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7"/>',
};
const ic = (n, cls="icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||""}</svg>`;

const CATS = {
  food:{label:"Cheap eats", short:"Food"},
  study:{label:"Study spaces", short:"Study"},
  events:{label:"Events & societies", short:"Events"},
  careers:{label:"Careers & internships", short:"Careers"},
  work:{label:"Part-time work", short:"Jobs"},
  funding:{label:"Funding & money help", short:"Funding"},
  deals:{label:"Student discounts", short:"Deals"},
  sport:{label:"Sport & fitness", short:"Sport"},
  housing:{label:"Housing", short:"Housing"},
};
const catColor = c => `var(--c-${c})`;

const AREAS = {
  "Bloomsbury":[51.5226,-0.1300],"Holborn":[51.5174,-0.1200],"King's Cross":[51.5308,-0.1238],"Euston":[51.5282,-0.1337],
  "Camden":[51.5390,-0.1426],"Angel":[51.5322,-0.1058],"Clerkenwell":[51.5237,-0.1054],"Marylebone":[51.5225,-0.1631],
  "Fitzrovia":[51.5190,-0.1390],"Covent Garden":[51.5117,-0.1240],"Waterloo":[51.5033,-0.1145],"Elephant & Castle":[51.4946,-0.1004],
  "Borough":[51.5010,-0.0920],"Vauxhall":[51.4861,-0.1253],"Brixton":[51.4613,-0.1156],"Kentish Town":[51.5503,-0.1405],
  "Holloway":[51.5530,-0.1134],"Finsbury Park":[51.5642,-0.1065],"Shoreditch":[51.5265,-0.0786],"Whitechapel":[51.5194,-0.0612],
  "Mile End":[51.5250,-0.0332],"Stratford":[51.5416,-0.0034],"Canary Wharf":[51.5054,-0.0235],"Hackney":[51.5450,-0.0553],
  "Walthamstow":[51.5830,-0.0200],"Tottenham":[51.5880,-0.0600],"Peckham":[51.4700,-0.0690],"New Cross":[51.4749,-0.0376],
  "Greenwich":[51.4826,-0.0077],"Hammersmith":[51.4927,-0.2240],"Shepherd's Bush":[51.5046,-0.2187],"Paddington":[51.5154,-0.1755],
  "Kilburn":[51.5470,-0.1930],"Wembley":[51.5560,-0.2796],"Ealing":[51.5130,-0.3040],"Lewisham":[51.4657,-0.0142],
};
const HOME_AREAS = Object.keys(AREAS).sort();
const UNIS = [
  {id:"ucl",name:"UCL",full:"UCL (University College London)",ll:[51.5246,-0.1340],area:"Bloomsbury"},
  {id:"kcl",name:"King's",full:"King's College London",ll:[51.5115,-0.1160],area:"Holborn"},
  {id:"lse",name:"LSE",full:"LSE (London School of Economics)",ll:[51.5144,-0.1165],area:"Holborn"},
  {id:"other",name:"Other uni",full:"Another London university",ll:[51.5174,-0.1200],area:"Holborn"},
];
const COURSES = [
  ["Computer Science","tech"],["Engineering","tech"],["Maths","tech"],["Physics","tech"],["Data Science","tech"],
  ["Economics","finance"],["Business & Management","finance"],["Accounting & Finance","finance"],
  ["Law","law"],["Politics & IR","law"],["Geography","law"],
  ["Medicine","health"],["Nursing","health"],["Biology & Biomedical","health"],["Psychology","health"],["Pharmacy","health"],
  ["Art & Design","creative"],["Architecture","creative"],["Film & Media","creative"],["English","creative"],["History","creative"],["Languages","creative"],
  ["Something else","any"],
];
const INTERESTS = [
  {id:"tech",label:"Tech & coding",cats:{careers:.8},tags:["tech"]},
  {id:"finance",label:"Finance & consulting",cats:{careers:.8},tags:["finance","consulting"]},
  {id:"law",label:"Law & policy",cats:{careers:.6},tags:["law"]},
  {id:"research",label:"Research",cats:{careers:.3,study:.3},tags:["research"]},
  {id:"fitness",label:"Gym & fitness",cats:{sport:1},tags:["fitness"]},
  {id:"music",label:"Music & nights out",cats:{events:.7},tags:["music","nightlife"]},
  {id:"food",label:"Food",cats:{food:.8},tags:["food"]},
  {id:"culture",label:"Art, theatre & museums",cats:{deals:.6,events:.3},tags:["culture"]},
  {id:"community",label:"Meeting people",cats:{events:.7},tags:["community"]},
  {id:"money",label:"Saving money",cats:{deals:.7,funding:.8,food:.4},tags:["money"]},
  {id:"veg",label:"Vegetarian / vegan",cats:{},tags:["veg"]},
];
const LLW = 14.80; // London Living Wage 2025/26, per hour

/* ================= storage ================= */
const store = {
  get(k, d){ try{ const v = localStorage.getItem("unilondon:"+k); return v==null ? d : JSON.parse(v);}catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("unilondon:"+k, JSON.stringify(v)); }catch(e){} },
  clear(){ try{ Object.keys(localStorage).filter(k=>k.startsWith("unilondon:")).forEach(k=>localStorage.removeItem(k)); }catch(e){} },
};
const DEFAULT_PROFILE = {uni:"ucl", course:"Computer Science", year:1, area:"Bloomsbury", interests:["food","money","community"], rent:1000, meal:6};
const S = {
  profile: Object.assign({}, DEFAULT_PROFILE, store.get("profile", {})),
  onboarded: store.get("onboarded", false),
  saved: new Set(store.get("saved", [])),
  plan: new Set(store.get("plan", [])),
  applied: new Set(store.get("applied", [])),
  hidden: new Set(store.get("hidden", [])),
  catBias: store.get("catBias", {}),
  survey: store.get("survey", null),
  installDismissed: store.get("installDismissed", false),
  view: "today",
  explore: {q:"", cat:"all", sort:"foryou", openNow:false, free:false, limit:40},
  map: {cat:"all", vb:null, active:null},
  chat: [],
  updated: "",
};
function persist(){
  store.set("profile", S.profile); store.set("onboarded", S.onboarded);
  store.set("saved", [...S.saved]); store.set("plan", [...S.plan]); store.set("applied", [...S.applied]);
  store.set("hidden", [...S.hidden]); store.set("catBias", S.catBias); store.set("survey", S.survey);
  store.set("installDismissed", S.installDismissed);
}

/* ================= anonymous usage counting (GoatCounter) ================= */
const track = (() => {
  const queue = []; let ready = false; const once = new Set();
  if(CFG.goatcounter){
    const s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${CFG.goatcounter}.goatcounter.com/count`;
    s.dataset.goatcounterSettings = JSON.stringify({no_onload:true});
    s.onload = () => { ready = true; queue.splice(0).forEach(send); };
    document.head.appendChild(s);
  }
  function send(e){ try{ window.goatcounter?.count(e); }catch(err){} }
  return (path, opts={}) => {
    if(!CFG.goatcounter) return;
    if(opts.once){ if(once.has(path)) return; once.add(path); }
    const e = {path, title: path, event: !opts.pageview};
    ready ? send(e) : queue.push(e);
  };
})();
function trackVisit(){
  const today = new Date().toISOString().slice(0,10);
  const first = store.get("firstSeen", null), last = store.get("lastSeen", null);
  const days = store.get("visitDays", 0);
  track("/app", {pageview:true});
  if(last === today) return;
  if(!first){ store.set("firstSeen", today); track("visit/new"); }
  else {
    const since = Math.round((Date.parse(today)-Date.parse(first))/864e5);
    const gap = last ? Math.round((Date.parse(today)-Date.parse(last))/864e5) : null;
    track("visit/return");
    track(`return/day-${since<=7 ? since : since<=14 ? "8-14" : "15plus"}`);
    if(gap===1) track("return/next-day");
    if(window.matchMedia?.("(display-mode: standalone)").matches) track("visit/from-home-screen");
  }
  store.set("lastSeen", today); store.set("visitDays", days+1);
}

/* ================= helpers ================= */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $ = (sel, root=document) => root.querySelector(sel);
let NOW = new Date();
function hav(a, b){
  const R=6371, toR=x=>x*Math.PI/180;
  const dLat=toR(b[0]-a[0]), dLng=toR(b[1]-a[1]);
  const h=Math.sin(dLat/2)**2+Math.cos(toR(a[0]))*Math.cos(toR(b[0]))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
const fmtDist = km => km < 0.975 ? `${Math.max(50, Math.round(km*1000/50)*50)} m` : `${(km*0.621371).toFixed(1)} mi`;
const walkMin = km => Math.max(1, Math.round(km/4.8*60));
const rideMin = km => Math.round(8 + km*3.2);
const travelLabel = km => km <= 2.4 ? `${walkMin(km)} min walk` : `~${rideMin(km)} min by tube/bus`;
const hhmm = h => { const H=Math.floor(h)%24, M=Math.round((h-Math.floor(h))*60); return `${String(H).padStart(2,"0")}:${String(M).padStart(2,"0")}`; };
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const FULLDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const startOfDay = d => { const x=new Date(d); x.setHours(0,0,0,0); return x; };
const dayDiff = d => Math.round((startOfDay(d)-startOfDay(NOW))/864e5);
const dateShort = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const timeOf = d => hhmm(d.getHours()+d.getMinutes()/60);
function whenLabel(it){
  const s = it.start, e = it.end;
  if(e && dayDiff(e) !== dayDiff(s)){
    if(s <= NOW) return `On now · until ${dateShort(e)}`;
    return `${dateShort(s)} – ${dateShort(e)}`;
  }
  const allDay = s.getHours()===0 && s.getMinutes()===0 && e && e.getHours()===23 && e.getMinutes()===59;
  if(s <= NOW && e && e >= NOW) return allDay ? "Today · all day" : `On now · until ${timeOf(e)}`;
  const dd = dayDiff(s), t = allDay ? "· all day" : timeOf(s);
  if(dd===0) return (s.getHours()>=17 ? "Tonight " : "Today ") + t;
  if(dd===1) return "Tomorrow " + t;
  if(dd<7) return DAYS[s.getDay()] + " " + t;
  return `${dateShort(s)}, ${t}`;
}
const nowHour = () => NOW.getHours() + NOW.getMinutes()/60;
const hasHours = it => !!(it.hours || it.weekHours);
function hoursOn(it, dow){
  if(it.weekHours) return it.weekHours[dow] || null;
  if(!it.hours) return null;
  return !it.days || it.days.includes(dow) ? it.hours : null;
}
function openState(it){
  if(!hasHours(it)) return null;
  const h = nowHour(), dow = NOW.getDay();
  const prev = hoursOn(it, (dow+6)%7);
  if(prev && prev[1] > 24 && h < prev[1]-24) return {open:true, label:`Open · closes ${hhmm(prev[1]-24)}`};
  const t = hoursOn(it, dow);
  const nextOpen = () => { for(let n=1;n<=7;n++){ const d=(dow+n)%7, x=hoursOn(it,d); if(x) return {d, x, n}; } return null; };
  if(!t){
    const nx = nextOpen(); if(!nx) return {open:false, label:"Closed"};
    if(it.days && !it.weekHours){
      const weekdays = it.days.length===5 && [1,2,3,4,5].every(d=>it.days.includes(d));
      return {open:false, label: weekdays ? `Weekdays · opens ${DAYS[nx.d]}` : it.days.length>1 ? `Next on ${DAYS[nx.d]}` : `Only on ${FULLDAYS[nx.d]}s`};
    }
    return {open:false, label:`Closed today · opens ${nx.n===1?"tomorrow":DAYS[nx.d]} ${hhmm(nx.x[0])}`};
  }
  const [o,c] = t;
  if(o===0 && c>=24) return {open:true, label:"Open 24 hours"};
  if(h>=o && h<c) return {open:true, label:`Open · closes ${hhmm(c%24)}`};
  if(h<o) return {open:false, label:`Opens ${hhmm(o)}`};
  const nx = nextOpen();
  return {open:false, label: nx ? `Closed · opens ${nx.n===1?"tomorrow":DAYS[nx.d]} ${hhmm(nx.x[0])}` : "Closed"};
}
function hoursSummary(it){
  const fmt = x => x[0]===0 && x[1]>=24 ? "24 hours" : `${hhmm(x[0])}–${hhmm(x[1]%24)}`;
  if(it.weekHours){
    const order = [1,2,3,4,5,6,0], groups = [];
    for(const d of order){ const x = it.weekHours[d], key = x ? fmt(x) : "Closed"; const g = groups[groups.length-1]; if(g && g.key===key) g.days.push(d); else groups.push({key, days:[d]}); }
    return groups.map(g=>`${DAYS[g.days[0]]}${g.days.length>1?"–"+DAYS[g.days[g.days.length-1]]:""} ${g.key}`).join(" · ");
  }
  const days = !it.days ? "Daily" : it.days.length===5 && [1,2,3,4,5].every(d=>it.days.includes(d)) ? "Mon–Fri" : it.days.map(d=>DAYS[d]).join(", ");
  return `${days} ${fmt(it.hours)}`;
}
const daysLeft = it => Math.max(0, dayDiff(it.deadline));

/* ================= listings ================= */
let ITEMS = [], BY_ID = {};
const STALE_DAYS = 60; // hand-checked listings older than this are flagged and ranked lower
function hydrate(raw){
  const parseLocal = s => { if(!s) return null; const [d,t="23:59"] = s.split("T"); const [Y,M,D] = d.split("-").map(Number); const [h,m] = t.split(":").map(Number); return new Date(Y, M-1, D, h, m); };
  const out = [];
  for(const r of raw){
    if(!r || !r.id || !CATS[r.cat] || !r.title) continue;
    const it = Object.assign({tags:[]}, r);
    if(!it.ll){ it.ll = AREAS[it.area] || AREAS.Holborn; }
    it.start = parseLocal(r.start); it.end = parseLocal(r.end) || (it.start ? new Date(it.start.getTime()+2*36e5) : null);
    it.deadline = r.deadline ? parseLocal(r.deadline.includes("T") ? r.deadline : r.deadline+"T23:59") : null;
    if(it.end && it.end < NOW) continue;            // finished events drop off automatically
    if(it.deadline && it.deadline < NOW) continue;  // closed deadlines too
    if(!it.auto && it.checked) it.stale = (NOW - parseLocal(it.checked)) / 864e5 > STALE_DAYS;
    out.push(it);
  }
  ITEMS = out; BY_ID = Object.fromEntries(out.map(i=>[i.id,i]));
}

/* ================= personalisation ================= */
function ctx(){
  const p = S.profile;
  const uni = UNIS.find(u=>u.id===p.uni) || UNIS[0];
  const home = AREAS[p.area] || AREAS.Bloomsbury;
  const cg = (COURSES.find(c=>c[0]===p.course)||["","any"])[1];
  const ints = INTERESTS.filter(i=>p.interests.includes(i.id));
  const intTags = new Set(ints.flatMap(i=>i.tags));
  const catW = {}; for(const i of ints) for(const [c,w] of Object.entries(i.cats)) catW[c]=(catW[c]||0)+w;
  return {p, uni, home, cg, ints, intTags, catW};
}
function priceText(it){
  if(it.priceText) return it.priceText;
  if(it.cat==="work") return it.pay ? `£${it.pay.toFixed(2).replace(/\.00$/,"")}/h` : "";
  if(it.cat==="funding") return it.pay ? `Up to £${it.pay.toLocaleString("en-GB")}` : "";
  if(it.price==null) return "";
  if(it.price===0) return "Free";
  return "£" + (Number.isInteger(it.price) ? it.price : it.price.toFixed(2));
}
function timingText(it){
  if(it.start) return whenLabel(it);
  if(it.deadline){ const d = daysLeft(it); return d===0 ? "Closes tonight" : `${d} day${d===1?"":"s"} left`; }
  if(it.opensOn){ const d = new Date(it.opensOn+"T00:00"); return d > NOW ? `Opens ${d.getDate()} ${MONTHS[d.getMonth()]}` : "Open now"; }
  if(it.closedNote) return it.closedNote;
  if(it.rolling) return "Rolling applications";
  const os = openState(it); if(os) return os.label;
  return "";
}
const uniMismatch = (it, C) => it.unis && it.unis.length && !it.unis.includes(C.uni.id);

function score(it, C){
  C = C || ctx();
  const dh = hav(C.home, it.ll), du = hav(C.uni.ll, it.ll);
  const weekend = [0,6].includes(NOW.getDay());
  const near = it.online ? 99 : weekend ? dh : Math.min(dh, du);
  let s = 1; const why = [];
  s += (C.catW[it.cat]||0) * 1.6;
  const tagHits = (it.tags||[]).filter(t=>C.intTags.has(t));
  if(tagHits.length){ s += 1.1*Math.min(2,tagHits.length); const lbl = C.ints.find(i=>i.tags.includes(tagHits[0])); if(lbl) why.push(`You're into ${lbl.label.toLowerCase()}`); }
  if(it.cg && C.cg!=="any"){ if(it.cg.includes(C.cg)){ s+=2.2; why.push(`Fits ${C.p.course}`);} else s-=2; }
  if(it.yrs){ if(it.yrs.includes(Math.min(4,C.p.year))){ s+=1.8; why.push(`Aimed at year ${C.p.year} students`);} else s-=3; }
  if(it.unis && it.unis.length){ if(it.unis.includes(C.uni.id)){ s+=2; why.push(`For ${C.uni.name} students`);} else s-=4.5; }
  const distW = ["food","study","sport"].includes(it.cat) ? 3 : ["events","careers","housing"].includes(it.cat) ? 1.6 : .6;
  if(!it.online){ s += distW*Math.exp(-near/2); if(near < 1.2 && distW>1) why.push(dh<=du ? `${walkMin(dh)} min walk from ${C.p.area}` : `Near ${C.uni.name} campus`); }
  if(it.deadline){ const dl = daysLeft(it); if(dl<=10){ s += 2.6*(1-dl/11); why.push(dl<=3 ? `Closes in ${dl} day${dl===1?"":"s"}` : "Closes soon"); } }
  if(it.start){ const hrs = (it.start-NOW)/36e5; if(it.start<=NOW) { s+=1.4; why.push("Happening now"); } else if(hrs < 36){ s+=1.6; why.push(hrs<10 ? "Happening today" : "Coming up tomorrow"); } else if(hrs<24*8) s+=.8; else s-=.4; }
  if(it.rolling && ["careers","funding"].includes(it.cat)) s+=.3;
  const os = openState(it); if(os && os.open) s+=.7;
  if(hasHours(it) && !hoursOn(it, NOW.getDay()) && !(os && os.open)) s -= 3;
  if(it.closedNote) s -= 2;
  if(it.opensOn && new Date(it.opensOn+"T00:00") > NOW){ const dd = dayDiff(new Date(it.opensOn+"T00:00")); s += dd<=7 ? .8 : -.5; if(dd<=7) why.push("Opens this week"); }
  if(it.stale) s -= 1.5;
  if(it.cat==="food" && it.price!=null){ if(it.price<=C.p.meal){ s+=.8; if(it.price<=4) why.push(it.price===0 ? "Free" : `Under £${C.p.meal}`);} else s-=1.2; }
  if(it.cat==="housing" && it.price){ if(it.price<=C.p.rent){ s+=1.2; why.push(`Within your £${C.p.rent}/mo budget`);} else s-=1.5; }
  s *= (S.catBias[it.cat] ?? 1);
  return {s, why: [...new Set(why)].slice(0,2), dh, du};
}
function ranked(list, C){ C = C||ctx(); return list.filter(i=>!S.hidden.has(i.id)).map(i=>({it:i, ...score(i,C)})).sort((a,b)=>b.s-a.s); }
function diverse(rows, n, perCat=1){
  const out=[], count={};
  for(const r of rows){ if((count[r.it.cat]||0)>=perCat) continue; count[r.it.cat]=(count[r.it.cat]||0)+1; out.push(r); if(out.length>=n) break; }
  return out;
}

/* ================= cards ================= */
function badges(it){
  const b = [], C = ctx();
  if(it.deadline){ const d=daysLeft(it); b.push(`<span class="badge ${d<=5?"hot":""}">${d===0?"Closes tonight":`${d} day${d===1?"":"s"} left`}</span>`); }
  if(it.rolling) b.push(`<span class="badge">Rolling</span>`);
  if(it.opensOn){ const d = new Date(it.opensOn+"T00:00"); if(d > NOW) b.push(`<span class="badge warn">Opens ${d.getDate()} ${MONTHS[d.getMonth()]}</span>`); }
  if(it.closedNote) b.push(`<span class="badge warn">${esc(it.closedNote)}</span>`);
  if(it.stale) b.push(`<span class="badge warn">Not re-checked recently</span>`);
  if(it.start){ const soon = it.start<=NOW || (it.start-NOW)/36e5<10; b.push(`<span class="badge ${soon?"acc":""}">${esc(whenLabel(it))}</span>`); }
  const os = openState(it); if(os) b.push(`<span class="badge ${os.open?"good":""}">${esc(os.label)}</span>`);
  const pt = priceText(it); if(pt) b.push(`<span class="badge ${pt==="Free"?"good":""}">${esc(pt)}</span>`);
  if(it.cat==="work" && it.pay>=LLW) b.push(`<span class="badge good">London Living Wage+</span>`);
  if(uniMismatch(it, C)) b.push(`<span class="badge warn">${esc(it.unis.map(u=>UNIS.find(x=>x.id===u)?.name||u).join(" & "))} students</span>`);
  if(S.plan.has(it.id)) b.push(`<span class="badge acc">In your plan</span>`);
  return b.join("");
}
function card(r, opts={}){
  const it = r.it, saved = S.saved.has(it.id);
  const side = it.online ? `Online<small>${it.cat==="funding"?"apply online":"from anywhere"}</small>` : `${fmtDist(r.dh)}<small>${r.dh<=2.4?walkMin(r.dh)+" min walk":"~"+rideMin(r.dh)+" min ride"}</small>`;
  return `<article class="card" style="--cc:${catColor(it.cat)}">
    <button class="open" data-open="${esc(it.id)}" aria-label="Open ${esc(it.title)}"></button>
    <div class="glyph" aria-hidden="true">${ic(it.cat)}</div>
    <div class="card-body">
      <div class="card-title">${esc(it.title)}</div>
      <div class="card-meta">${esc(it.org)} · ${esc(it.area)}</div>
      <div class="card-badges">${badges(it)}</div>
      ${opts.why!==false && r.why && r.why.length ? `<div class="card-why">${ic("spark")}<span>${esc(r.why.join(" · "))}</span></div>` : ""}
    </div>
    <div class="card-side">
      <div class="dist">${side}</div>
      <button class="save" data-save="${esc(it.id)}" aria-pressed="${saved}" aria-label="${saved?"Remove from saved":"Save"}">${ic("save")}</button>
    </div>
  </article>`;
}

/* ================= shell ================= */
const NAV = [["today","Today"],["explore","Explore"],["map","Map"],["plan","Plan"],["ask","Ask"]];
function renderNav(){
  const html = NAV.map(([v,l])=>`<button class="navbtn" data-nav="${v}" ${S.view===v?'aria-current="page"':""}>${ic(v)}<span>${l}</span></button>`).join("");
  $("#railnav").innerHTML = `<div style="display:flex;flex-direction:column;gap:4px">${html}</div>`;
  $("#bottomnav").innerHTML = html;
  $("#railfoot").innerHTML = `${esc(CFG.pilotName)}${CFG.feedbackUrl?`<br><a href="${esc(CFG.feedbackUrl)}" target="_blank" rel="noopener" data-track="feedback/rail">Send feedback</a>`:""}`;
}
function greeting(){ const h=NOW.getHours(); return h<5?"Late night":h<12?"Good morning":h<18?"Good afternoon":"Good evening"; }
function topbar(){
  const C = ctx();
  return `<div class="topbar">
    <div class="brand"><span class="brand-mark">U</span><span>UniLondon<small class="pilot">${esc(CFG.pilotName)}</small></span></div>
    <div class="hdr-actions">
      ${CFG.feedbackUrl ? `<a class="iconbtn" href="${esc(CFG.feedbackUrl)}" target="_blank" rel="noopener" data-track="feedback/header">${ic("chat")}<span>Feedback</span></a>` : ""}
      <button class="avatar" data-profile aria-label="Edit your profile"><span class="dot">${esc(C.uni.name.replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase())}</span>Y${C.p.year}</button>
    </div>
  </div>`;
}
function footer(){
  return `<footer class="footer">
    <div>${S.events ? `Events synced ${esc(fmtSynced())} from ${S.events.sources.filter(x=>x.ok).map(x=>esc(x.name)).join(", ")}. ` : ""}Other listings hand-checked ${esc(fmtUpdated())}. Always confirm on the official page before you go.</div>
    ${eventsStale() ? `<div style="color:var(--warn)">Event listings haven't refreshed for a few days, so some may have changed.</div>` : ""}
    <div>${CFG.submitUrl ? `<a href="${esc(CFG.submitUrl)}" target="_blank" rel="noopener" data-track="submit/footer">Suggest a listing</a> · ` : ""}${CFG.feedbackUrl ? `<a href="${esc(CFG.feedbackUrl)}" target="_blank" rel="noopener" data-track="feedback/footer">Report a problem</a> · ` : ""}<button data-privacy>Privacy</button> · <button data-reset>Reset my data</button></div>
  </footer>`;
}
function fmtSynced(){
  if(!S.events?.generated) return "recently";
  const d = new Date(S.events.generated), dd = dayDiff(d);
  return (dd===0 ? "today" : dd===-1 ? "yesterday" : `${d.getDate()} ${MONTHS[d.getMonth()]}`) + " at " + timeOf(d);
}
const eventsStale = () => !!S.events?.generated && (NOW - new Date(S.events.generated)) / 864e5 > 3;
const fmtUpdated = () => { if(!S.updated) return "recently"; const [y,m,d]=S.updated.split("-").map(Number); return `${d} ${MONTHS[m-1]} ${y}`; };

/* ================= views ================= */
function viewToday(){
  const C = ctx();
  const all = ranked(ITEMS, C);
  const top = diverse(all.filter(r=>r.s>1 && !uniMismatch(r.it,C) && r.it.cat!=="housing"), 6, 1);
  const topIds = new Set(top.map(r=>r.it.id));
  const upcoming = all.filter(r=>r.it.start && !topIds.has(r.it.id) && !uniMismatch(r.it,C) && (r.it.start-NOW)/864e5 < 14).slice(0,6).sort((a,b)=>a.it.start-b.it.start);
  const deadlines = all.filter(r=>r.it.deadline && !S.applied.has(r.it.id) && !uniMismatch(r.it,C)).sort((a,b)=>a.it.deadline-b.it.deadline).slice(0,6);
  const openFood = all.filter(r=>r.it.cat==="food" && !uniMismatch(r.it,C) && openState(r.it)?.open && !topIds.has(r.it.id)).slice(0,3);
  const date = `${DAYS[NOW.getDay()]} ${NOW.getDate()} ${MONTHS[NOW.getMonth()]}`;
  return `${topbar()}
  <section class="hello">
    <div class="eyebrow">${date} · ${hhmm(nowHour())}</div>
    <h1>${greeting()}. <em>${top.length} things</em> worth your time today.</h1>
    <div class="ctxline">
      <span class="ctx">${ic("cap")}${esc(C.uni.name)} · ${esc(C.p.course)} · Year ${C.p.year}</span>
      <span class="ctx">${ic("pin")}${esc(C.p.area)}</span>
    </div>
    ${S.events ? `<button class="live" data-nav="explore" data-cat="events"><i></i>${ITEMS.filter(i=>i.auto).length} live events from official uni &amp; union calendars · synced ${esc(fmtSynced())}</button>` : ""}
  </section>
  ${installCard()}
  <section class="section">
    <div class="section-head"><h2>Picked for you</h2><button class="link" data-nav="explore">See everything</button></div>
    <div class="list">${top.map(r=>card(r)).join("")}</div>
  </section>
  ${upcoming.length ? `<section class="section">
    <div class="section-head"><h2>Coming up</h2><button class="link" data-nav="plan">Your plan</button></div>
    <div class="list">${upcoming.map(r=>card(r,{why:false})).join("")}</div>
  </section>` : ""}
  ${deadlines.length ? `<section class="section">
    <div class="section-head"><h2>Closing soon</h2></div>
    <div class="tiles">${deadlines.map(r=>tile(r.it)).join("")}</div>
  </section>` : ""}
  <section class="section">
    <div class="section-head"><h2>Eat for less, open now</h2></div>
    ${openFood.length ? `<div class="list">${openFood.map(r=>card(r,{why:false})).join("")}</div>` : `<div class="empty">Nothing on the list is open right now. <button class="link" data-nav="explore" data-cat="food">See all cheap eats</button></div>`}
  </section>
  ${surveyCard()}
  ${footer()}`;
}
function tile(it){
  const d = daysLeft(it), pct = Math.max(6, Math.min(100, 100 - d/30*100));
  return `<button class="tile ${d<=5?"urgent":""}" data-open="${esc(it.id)}">
    <div class="count">${d}<small>day${d===1?"":"s"} left</small></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="t">${esc(it.title)}</div>
    <div class="o">${esc(it.org)}${priceText(it)?" · "+esc(priceText(it)):""}</div>
  </button>`;
}

/* survey: the "how disappointed" test, asked from the second day of use */
function surveyCard(){
  if(S.survey?.answer || S.survey?.dismissedOn === new Date().toISOString().slice(0,10)) {
    if(S.survey?.answer && !S.survey.thanked) return `<section class="survey"><h3>Thanks, that really helps.</h3><p style="margin:0 0 10px">What's one thing UniLondon should add or fix?</p>${CFG.feedbackUrl?`<a class="btn primary" href="${esc(CFG.feedbackUrl)}" target="_blank" rel="noopener" data-track="feedback/after-survey">Tell us in 30 seconds</a> `:""}<button class="btn ghost" data-survey-done>Close</button></section>`;
    return "";
  }
  if(store.get("visitDays", 0) < 2) return "";
  return `<section class="survey" aria-labelledby="sv-h">
    <h3 id="sv-h">How would you feel if you could no longer use UniLondon?</h3>
    <div class="opts">
      <button data-survey="very">Very disappointed</button>
      <button data-survey="somewhat">Somewhat disappointed</button>
      <button data-survey="not">Not disappointed</button>
    </div>
    <button class="link" data-survey-later style="margin-top:8px">Ask me later</button>
  </section>`;
}

/* install prompt */
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; if(S.view==="today") render(); });
window.addEventListener("appinstalled", () => { track("install/done"); S.installDismissed = true; persist(); });
function installCard(){
  if(S.installDismissed) return "";
  const standalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone;
  if(standalone) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if(deferredInstall) return `<div class="install"><p><b>Add UniLondon to your home screen</b> so it's one tap away.</p><div><button class="btn primary" data-install>Add</button> <button class="btn ghost" data-install-no>Not now</button></div></div>`;
  if(ios) return `<div class="install"><p><b>Add to your home screen:</b> tap ${ic("share","icon")} Share, then “Add to Home Screen”.</p><button class="btn ghost" data-install-no>Got it</button></div>`;
  return "";
}

function viewExplore(){
  const E = S.explore, C = ctx();
  let rows = ranked(ITEMS, C);
  if(E.cat!=="all") rows = rows.filter(r=>r.it.cat===E.cat);
  if(E.q.trim()){
    const terms = E.q.toLowerCase().split(/\s+/).filter(Boolean);
    rows = rows.filter(r=>{ const hay = [r.it.title,r.it.org,r.it.area,r.it.desc,CATS[r.it.cat].label,...(r.it.tags||[])].join(" ").toLowerCase(); return terms.every(t=>hay.includes(t)); });
  }
  if(E.openNow) rows = rows.filter(r=>{ const o=openState(r.it); if(o) return o.open; if(r.it.start) return r.it.start<=NOW || (r.it.start-NOW)/36e5<6; return !!r.it.rolling; });
  if(E.free) rows = rows.filter(r=>r.it.price===0 || r.it.cat==="funding");
  const cmp = {
    foryou:(a,b)=>b.s-a.s,
    near:(a,b)=>(a.it.online?999:a.dh)-(b.it.online?999:b.dh),
    soon:(a,b)=>(a.it.deadline||a.it.start||Infinity)-(b.it.deadline||b.it.start||Infinity),
    cheap:(a,b)=>((a.it.price??99)-(b.it.price??99)),
  }[E.sort];
  rows.sort(cmp);
  const catChips = [["all","All"],...Object.entries(CATS).map(([k,v])=>[k,v.short])].map(([k,l])=>
    `<button class="chip" data-ecat="${k}" aria-pressed="${E.cat===k}">${k!=="all"?`<span class="sw" style="background:${catColor(k)}"></span>`:""}${l}</button>`).join("");
  return `${topbar()}
  <section class="hello"><div class="eyebrow">Explore</div><h1>Everything, filtered for you.</h1></section>
  <section class="section">
    <div class="searchrow">
      <label class="search">${ic("search")}<input id="q" type="search" placeholder="Search breakfast, library, careers fair…" value="${esc(E.q)}" aria-label="Search listings"></label>
      <select id="sort" class="select" aria-label="Sort">
        ${[["foryou","Best for you"],["near","Nearest"],["soon","Soonest"],["cheap","Cheapest"]].map(([v,l])=>`<option value="${v}" ${E.sort===v?"selected":""}>${l}</option>`).join("")}
      </select>
    </div>
    <div class="chips" role="group" aria-label="Category">${catChips}</div>
    <div class="toggles">
      <button class="chip" id="t-open" aria-pressed="${E.openNow}">${ic("clock","icon")} Open or on now</button>
      <button class="chip" id="t-free" aria-pressed="${E.free}">Free</button>
      <span class="resultcount" style="align-self:center">${rows.length} result${rows.length===1?"":"s"}</span>
    </div>
  </section>
  <section class="section" style="margin-top:14px">
    ${rows.length ? `<div class="list" id="results">${rows.slice(0,E.limit).map(r=>card(r)).join("")}</div>${rows.length>E.limit ? `<button class="btn" id="more" style="margin-top:10px;width:100%">Show more (${rows.length-E.limit} left)</button>` : ""}` : `<div class="empty">No matches. Try fewer words or turn off a filter.${CFG.submitUrl?` Know somewhere good? <a href="${esc(CFG.submitUrl)}" target="_blank" rel="noopener">Suggest it</a>.`:""}</div>`}
    ${S.hidden.size ? `<p class="fineprint">${S.hidden.size} hidden listing${S.hidden.size===1?"":"s"}. <button class="link" id="unhide">Show them again</button></p>`:""}
  </section>
  ${footer()}`;
}

/* ---------- map ---------- */
const MB = {minLng:-0.27, maxLng:0.05, minLat:51.44, maxLat:51.59};
const MW = 1000, MH = Math.round((MB.maxLat-MB.minLat)/((MB.maxLng-MB.minLng)*Math.cos(51.515*Math.PI/180))*1000);
const proj = ([lat,lng]) => [ (lng-MB.minLng)/(MB.maxLng-MB.minLng)*MW, (MB.maxLat-lat)/(MB.maxLat-MB.minLat)*MH ];
const KM_PER_UNIT = (MB.maxLng-MB.minLng)*111.32*Math.cos(51.515*Math.PI/180)/MW;
const THAMES = [[51.4930,-0.2700],[51.4880,-0.2440],[51.4880,-0.2305],[51.4770,-0.2250],[51.4700,-0.2200],[51.4665,-0.2120],[51.4650,-0.1950],[51.4680,-0.1850],[51.4760,-0.1790],[51.4820,-0.1700],[51.4850,-0.1500],[51.4860,-0.1330],[51.4900,-0.1250],[51.5008,-0.1219],[51.5087,-0.1170],[51.5098,-0.1040],[51.5080,-0.0877],[51.5055,-0.0754],[51.5045,-0.0560],[51.5075,-0.0380],[51.5040,-0.0290],[51.4960,-0.0290],[51.4870,-0.0200],[51.4845,-0.0090],[51.4900,-0.0010],[51.5000,0.0030],[51.5070,0.0060],[51.5040,0.0150],[51.4950,0.0200],[51.4920,0.0350],[51.4960,0.0550]];
const PARKS = [[51.5073,-0.1657,1.25,.55],[51.5313,-0.1570,.85,.6],[51.5370,-0.0390,.8,.35],[51.4770,-0.0010,.55,.4],[51.5430,-0.0160,.7,.9],[51.5580,-0.1650,1.2,.9],[51.4600,-0.1460,.9,.5],[51.4780,-0.1570,.55,.35],[51.5215,-0.1275,.12,.12],[51.5153,-0.1165,.18,.1]];
function smoothPath(pts){
  const P = pts.map(proj); let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for(let i=0;i<P.length-1;i++){
    const p0=P[i-1]||P[i], p1=P[i], p2=P[i+1], p3=P[i+2]||p2;
    const c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6], c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
function defaultVB(){
  const C = ctx(); const [hx,hy] = proj(C.home), [ux,uy] = proj(C.uni.ll);
  const cx=(hx+ux)/2, cy=(hy+uy)/2; const w = Math.max(220, Math.max(Math.abs(hx-ux), Math.abs(hy-uy)*MW/MH)*1.6+120); const h = w*MH/MW;
  return {x:cx-w/2, y:cy-h/2, w, h};
}
const MAP_LABELS = ["Bloomsbury","Holborn","King's Cross","Camden","Covent Garden","Waterloo","Clerkenwell","Marylebone","Euston","Shoreditch","Elephant & Castle","Angel","Borough","Stratford","Brixton","Hammersmith","Mile End","Greenwich","Holloway","Paddington"];
function mapSVG(rows, vb, idAttr=true, pxW){
  pxW = pxW || $("#mapwrap")?.clientWidth || Math.min(window.innerWidth - 32, 900);
  const k = vb.w/pxW * (pxW < 500 ? 0.95 : 1), C = ctx();
  const [hx,hy] = proj(C.home), [ux,uy] = proj(C.uni.ll);
  const walkR = 1.6/KM_PER_UNIT, fs = 13*k;
  return `<svg ${idAttr?'id="mapsvg"':""} viewBox="${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}" role="img" aria-label="Map of listings">
    <rect x="-2000" y="-2000" width="5000" height="5000" fill="var(--land)"/>
    ${PARKS.map(([la,ln,w,h])=>{const [x,y]=proj([la,ln]); return `<ellipse cx="${x}" cy="${y}" rx="${w/KM_PER_UNIT/2}" ry="${h/KM_PER_UNIT/2}" fill="var(--park)"/>`;}).join("")}
    <path d="${smoothPath(THAMES)}" fill="none" stroke="var(--river)" stroke-width="${Math.min(11, 14*k)}" stroke-linecap="round" stroke-linejoin="round"/>
    ${MAP_LABELS.map(a=>{const [x,y]=proj(AREAS[a]); return `<text x="${x}" y="${y-10*k}" text-anchor="middle" font-size="${fs}" class="maplabel" style="stroke-width:${3.5*k}">${esc(a)}</text>`;}).join("")}
    <circle cx="${hx}" cy="${hy}" r="${walkR}" fill="var(--accent)" fill-opacity=".07" stroke="var(--accent)" stroke-opacity=".45" stroke-dasharray="${6*k} ${5*k}" stroke-width="${1.4*k}"/>
    ${rows.map(r=>{ const [x,y]=proj(r.it.ll); const act = S.map.active===r.it.id; return `<g class="pin ${act?"active":""}" ${idAttr?`data-pin="${esc(r.it.id)}" tabindex="0" role="button" aria-label="${esc(r.it.title)}"`:'aria-hidden="true"'}><circle class="body" cx="${x}" cy="${y}" r="${(act?9:6.5)*k}" fill="${catColor(r.it.cat)}" stroke-width="${2*k}"/></g>`; }).join("")}
    ${C.uni.id!=="other" ? `<g><rect x="${ux-9*k}" y="${uy-9*k}" width="${18*k}" height="${18*k}" rx="${4*k}" fill="var(--ink)"/><path d="M${ux-5*k},${uy-1*k} l${5*k},${-3*k} l${5*k},${3*k} l${-5*k},${3*k}z" fill="var(--bg)"/><text x="${ux}" y="${uy+22*k}" text-anchor="middle" font-size="${fs*1.05}" class="maplabel" style="fill:var(--ink);stroke-width:${3.5*k}">${esc(C.uni.name)}</text></g>` : ""}
    <g><circle cx="${hx}" cy="${hy}" r="${10*k}" fill="var(--accent)" stroke="var(--surface)" stroke-width="${3*k}"/><circle cx="${hx}" cy="${hy}" r="${3.5*k}" fill="var(--accent-ink)"/><text x="${hx}" y="${hy+24*k}" text-anchor="middle" font-size="${fs*1.05}" class="maplabel" style="fill:var(--accent);stroke-width:${3.5*k}">Home</text></g>
  </svg>`;
}
function mapRows(){ const C=ctx(); let rows = ranked(ITEMS.filter(i=>!i.online && (!i.start || (i.start-NOW)/864e5 < 7)),C); if(S.map.cat!=="all") rows = rows.filter(r=>r.it.cat===S.map.cat); return rows; }
function viewMap(){
  const rows = mapRows();
  if(!S.map.vb) S.map.vb = defaultVB();
  const chips = [["all","All"],...Object.entries(CATS).map(([k,v])=>[k,v.short])].map(([k,l])=>
    `<button class="chip" data-mcat="${k}" aria-pressed="${S.map.cat===k}">${k!=="all"?`<span class="sw" style="background:${catColor(k)}"></span>`:""}${l}</button>`).join("");
  const near = [...rows].sort((a,b)=>a.dh-b.dh).slice(0,12);
  const act = S.map.active && BY_ID[S.map.active];
  return `${topbar()}
  <section class="hello"><div class="eyebrow">Map</div><h1>What's around you</h1><p>Dashed ring = a 20-minute walk from home. Drag to pan. Pinch, Ctrl + scroll or +/− to zoom.</p></section>
  <section class="section">
    <div class="chips" role="group" aria-label="Category">${chips}</div>
    <div class="mapgrid">
      <div>
        <div class="mapwrap" id="mapwrap">
          <div class="map-ctrl"><button data-zoom="in" aria-label="Zoom in">+</button><button data-zoom="out" aria-label="Zoom out">−</button><button data-zoom="reset" aria-label="Reset view">${ic("pin","icon")}</button></div>
          <div id="mapholder">${mapSVG(rows, S.map.vb)}</div>
          <div class="map-legend"><span><i style="background:var(--accent)"></i>Home</span><span><i style="background:var(--ink);border-radius:3px"></i>Campus</span><span>${rows.length} places</span></div>
        </div>
        <div id="mappreview" style="margin-top:10px">${act ? card({it:act,...score(act)}) : `<div class="empty">Tap a pin to preview it here.</div>`}</div>
      </div>
      <div>
        <div class="eyebrow" style="margin-bottom:8px">Nearest to home</div>
        <div class="maplist">${near.map(r=>card(r,{why:false})).join("")}</div>
      </div>
    </div>
  </section>
  ${footer()}`;
}
function refreshMap(){ const h = $("#mapholder"); if(h) h.innerHTML = mapSVG(mapRows(), S.map.vb); }
function setupMap(){
  const wrap = $("#mapwrap"); if(!wrap) return;
  let drag = null; const pointers = new Map(); let pinch = null;
  const toSvg = (cx, cy) => { const r=$("#mapsvg").getBoundingClientRect(); const vb=S.map.vb; return [vb.x + (cx-r.left)/r.width*vb.w, vb.y + (cy-r.top)/r.height*vb.h]; };
  const zoom = (f, cx, cy) => {
    const vb = S.map.vb; const nw = Math.min(MW*1.1, Math.max(60, vb.w*f)); const real = nw/vb.w;
    const px = cx ?? vb.x+vb.w/2, py = cy ?? vb.y+vb.h/2;
    S.map.vb = {x: px-(px-vb.x)*real, y: py-(py-vb.y)*real, w: nw, h: nw*MH/MW}; refreshMap();
  };
  wrap.addEventListener("wheel", e => { if(!e.ctrlKey && !e.metaKey) return; e.preventDefault(); const [x,y]=toSvg(e.clientX,e.clientY); zoom(e.deltaY>0?1.12:1/1.12, x, y); }, {passive:false});
  wrap.addEventListener("pointerdown", e => {
    if(e.target.closest(".map-ctrl")) return;
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if(pointers.size===2){ const [a,b]=[...pointers.values()]; pinch = {d:Math.hypot(a[0]-b[0],a[1]-b[1]), vb:{...S.map.vb}}; drag=null; return; }
    drag = {x:e.clientX, y:e.clientY, vb:{...S.map.vb}, moved:false, target:e.target.closest("[data-pin]")};
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener("pointermove", e => {
    if(pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if(pinch && pointers.size===2){
      const [a,b]=[...pointers.values()]; const d=Math.hypot(a[0]-b[0],a[1]-b[1]); if(d<10) return;
      const f = pinch.d/d; const vb0 = pinch.vb; const nw = Math.min(MW*1.1, Math.max(60, vb0.w*f));
      const cx = vb0.x+vb0.w/2, cy = vb0.y+vb0.h/2;
      S.map.vb = {x:cx-nw/2, y:cy-nw*MH/MW/2, w:nw, h:nw*MH/MW}; refreshMap(); return;
    }
    if(!drag) return; const dx=e.clientX-drag.x, dy=e.clientY-drag.y;
    if(!drag.moved && Math.hypot(dx,dy)<6) return;
    drag.moved = true; const svg=$("#mapsvg"); svg.classList.add("dragging");
    const r = svg.getBoundingClientRect();
    S.map.vb = {...drag.vb, x: drag.vb.x - dx/r.width*drag.vb.w, y: drag.vb.y - dy/r.height*drag.vb.h};
    svg.setAttribute("viewBox", `${S.map.vb.x} ${S.map.vb.y} ${S.map.vb.w} ${S.map.vb.h}`);
  });
  const end = e => {
    pointers.delete(e.pointerId); if(pointers.size<2) pinch = null;
    if(!drag) return; const d = drag; drag = null; $("#mapsvg")?.classList.remove("dragging");
    if(!d.moved && d.target) selectPin(d.target.dataset.pin); else if(d.moved) refreshMap();
  };
  wrap.addEventListener("pointerup", end); wrap.addEventListener("pointercancel", e => { pointers.delete(e.pointerId); drag=null; pinch=null; });
  wrap.addEventListener("keydown", e => { const p = e.target.closest?.("[data-pin]"); if(p && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); selectPin(p.dataset.pin); } });
  wrap.querySelectorAll("[data-zoom]").forEach(b => b.addEventListener("click", () => {
    const z = b.dataset.zoom; if(z==="reset"){ S.map.vb = defaultVB(); refreshMap(); } else zoom(z==="in"?1/1.4:1.4);
  }));
}
function selectPin(id){
  S.map.active = id; refreshMap();
  const it = BY_ID[id]; const pv = $("#mappreview");
  if(pv && it) pv.innerHTML = card({it, ...score(it)});
}

/* ---------- plan ---------- */
function viewPlan(){
  const C = ctx();
  const dls = ranked(ITEMS.filter(i=>i.deadline), C).filter(r=>!uniMismatch(r.it,C) || S.saved.has(r.it.id)).sort((a,b)=>a.it.deadline-b.it.deadline);
  const thisWeek = dls.filter(r=>daysLeft(r.it)<=7 && !S.applied.has(r.it.id)).length;
  const planned = [...S.plan].map(id=>BY_ID[id]).filter(it=>it && it.start);
  const savedRows = [...S.saved].map(id=>BY_ID[id]).filter(Boolean).map(it=>({it, ...score(it,C)}));
  const days = [...Array(7)].map((_,i)=>{ const d=startOfDay(NOW); d.setDate(d.getDate()+i); return d; });
  const onDay = (it, i) => { const a = dayDiff(it.start), b = dayDiff(it.end||it.start); return i>=a && i<=b; };
  const week = days.map((d,i)=>{
    const ev = planned.filter(it=>onDay(it,i)).sort((a,b)=>a.start-b.start);
    const dd = dls.filter(r=>(S.saved.has(r.it.id)||S.plan.has(r.it.id)) && !S.applied.has(r.it.id) && dayDiff(r.it.deadline)===i).map(r=>r.it);
    return `<div class="day ${i===0?"today":""}"><h4>${DAYS[d.getDay()]} <b>${d.getDate()}</b></h4>
      ${ev.map(it=>`<button class="slot" style="--cc:${catColor(it.cat)}" data-open="${esc(it.id)}">${esc(it.title)}<small>${dayDiff(it.start)===i?timeOf(it.start):"all day"} · ${esc(it.area)}</small></button>`).join("")}
      ${dd.map(it=>`<button class="slot dl" data-open="${esc(it.id)}">Deadline: ${esc(it.title)}<small>23:59</small></button>`).join("")}
    </div>`;
  }).join("");
  const later = planned.filter(it=>dayDiff(it.start)>=7).sort((a,b)=>a.start-b.start);
  return `${topbar()}
  <section class="hello"><div class="eyebrow">Your plan</div><h1>Stay ahead of the week.</h1></section>
  <section class="section">
    <div class="stats">
      <div class="stat"><b class="mono" style="color:${thisWeek?"var(--hot)":"inherit"}">${thisWeek}</b><span>deadlines in 7 days</span></div>
      <div class="stat"><b class="mono">${planned.length}</b><span>things planned</span></div>
      <div class="stat"><b class="mono">${S.saved.size}</b><span>saved</span></div>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><h2>This week</h2></div>
    <div class="week">${week}</div>
    ${planned.length ? "" : `<p class="fineprint">Open any event or careers fair and tap “Add to plan” to put it here.</p>`}
    ${later.length ? `<div class="eyebrow" style="margin-top:8px">Later</div><div class="list">${later.map(it=>card({it,...score(it,C)},{why:false})).join("")}</div>` : ""}
  </section>
  ${dls.length ? `<section class="section">
    <div class="section-head"><h2>Deadlines</h2></div>
    <div class="list">${dls.map(r=>{ const it=r.it, d=daysLeft(it), done=S.applied.has(it.id);
      return `<div class="dlrow ${d<=5&&!done?"urgent":""} ${done?"done":""}">
        <div class="when"><b>${d}</b>day${d===1?"":"s"}</div>
        <div style="min-width:0"><button class="t" data-open="${esc(it.id)}">${esc(it.title)}</button><div class="o">${esc(it.org)} · closes ${it.deadline.getDate()} ${MONTHS[it.deadline.getMonth()]}</div></div>
        <label class="check"><input type="checkbox" data-applied="${esc(it.id)}" ${done?"checked":""}> Done</label>
      </div>`; }).join("")}</div>
  </section>` : ""}
  <section class="section">
    <div class="section-head"><h2>Saved</h2><span class="resultcount">${savedRows.length}</span></div>
    ${savedRows.length ? `<div class="list">${savedRows.map(r=>card(r,{why:false})).join("")}</div>` : `<div class="empty">Tap the bookmark on anything to keep it here.</div>`}
  </section>
  ${footer()}`;
}

/* ---------- ask (on-device search assistant) ---------- */
const SUGGEST = ["Cheap lunch near campus today?","Where can I study late tonight?","What careers fairs are coming up?","How do I save money on travel?","I'm struggling with money, what help is there?","Free things to do this week"];
function viewAsk(){
  return `${topbar()}
  <section class="ask">
    <div class="hello"><div class="eyebrow">Ask UniLondon</div><h1>Ask it like you'd ask a friend.</h1>
      <div class="aimode"><i></i>Searches the listings on your phone, matched to your profile</div>
    </div>
    <div class="msgs" id="msgs">${S.chat.length ? S.chat.map(msgHTML).join("") : `<div class="suggest">${SUGGEST.map(s=>`<button data-suggest="${esc(s)}">${esc(s)}</button>`).join("")}</div>`}</div>
    <form class="composer" id="askform">
      <textarea id="askinput" rows="1" placeholder="Ask anything about student London" aria-label="Your question"></textarea>
      <button class="btn primary" type="submit" aria-label="Send">${ic("send")}</button>
    </form>
  </section>`;
}
function renderRich(text){
  const lines = esc(text).split(/\n+/).filter(l=>l.trim());
  let html = "", inList = false;
  for(const l of lines){
    const m = l.match(/^\s*(?:[-•*]|\d+\.)\s+(.*)$/);
    if(m){ if(!inList){ html+="<ul>"; inList=true; } html += `<li>${m[1]}</li>`; }
    else { if(inList){ html+="</ul>"; inList=false; } html += `<p>${l}</p>`; }
  }
  if(inList) html += "</ul>";
  return html.replace(/\{\{\s*([a-z0-9-]+)\s*\}\}/g, (m,id)=>{ const it = BY_ID[id]; return it ? `<button class="ref" style="--cc:${catColor(it.cat)}" data-open="${esc(id)}"><i></i>${esc(it.title)}</button>` : ""; });
}
function msgHTML(m){
  if(m.role==="user") return `<div class="msg me">${esc(m.content)}</div>`;
  if(m.pending) return `<div class="msg bot"><span class="thinking" aria-label="Searching"><i></i><i></i><i></i></span></div>`;
  return `<div class="msg bot">${renderRich(m.content)}</div>`;
}
function localAnswer(q){
  const C = ctx(), ql = q.toLowerCase();
  const catWords = {food:["food","eat","dinner","lunch","breakfast","meal","hungry","coffee","cheap eat"],work:["job","work","shift","part-time","part time","earn","wage"],careers:["internship","intern","grad","career","spring week","placement","insight","fair","cv"],events:["event","society","societies","party","social","meet people","friends","welcome"],study:["study","library","revise","revision","quiet","wifi","desk"],housing:["room","flat","housing","rent","accommodation","halls"],sport:["gym","sport","fitness","run","football","exercise"],funding:["scholarship","funding","grant","bursary","hardship","struggling","council tax","help with money"],deals:["discount","deal","railcard","oyster","travel","theatre","museum","culture"]};
  let cats = Object.entries(catWords).filter(([c,ws])=>ws.some(w=>ql.includes(w))).map(([c])=>c);
  if(/money|broke|afford/.test(ql) && !cats.length) cats = ["funding","deals","food"];
  if(!cats.length && /cheap|save|saving/.test(ql)) cats = ["deals","food"];
  if(/fun|this week|weekend/.test(ql) && !cats.length) cats = ["events","deals","sport"];
  if(cats.includes("study")) cats = ["study"];
  let relaxed = "";
  let rows = ranked(ITEMS, C).filter(r=>!uniMismatch(r.it,C));
  if(cats.length) rows = rows.filter(r=>cats.includes(r.it.cat));
  const today = NOW.getDay(), onToday = it => !it.days || it.days.includes(today);
  const num = ql.match(/£\s?(\d+)/); if(num){ const n=+num[1]; rows = rows.filter(r=>(r.it.price??0)<=n); }
  if(/free/.test(ql)) rows = rows.filter(r=>r.it.price===0 || r.it.cat==="funding");
  if(/cheap|budget/.test(ql)) rows = rows.filter(r=>r.it.price==null ? true : r.it.price <= Math.max(C.p.meal, 8));
  if(/today|now/.test(ql) && cats.includes("food")) rows = rows.filter(r=>r.it.hours ? onToday(r.it) && r.it.hours[1] > nowHour() : true);
  if(/late|tonight|night/.test(ql) && cats.includes("study")) rows = rows.filter(r=>r.it.hours && r.it.hours[1]>=21);
  if(/coming up|upcoming|fair|this week/.test(ql)){ const ev = rows.filter(r=>r.it.start).sort((a,b)=>a.it.start-b.it.start); if(ev.length) rows = ev; }
  if(/near|close|around|campus/.test(ql)) rows.sort((a,b)=>(a.it.online?99:Math.min(a.dh,a.du))-(b.it.online?99:Math.min(b.dh,b.du)));
  if(/deadline|priorit/.test(ql)) rows = rows.filter(r=>r.it.deadline || r.it.rolling).sort((a,b)=>(a.it.deadline||Infinity)-(b.it.deadline||Infinity));
  const understood = cats.length || /free|cheap|near|tonight|today|deadline|weekend|£/.test(ql);
  const top = rows.slice(0,4);
  const line = r => `- {{${r.it.id}}} ${[timingText(r.it), priceText(r.it), r.it.online ? "online" : fmtDist(Math.min(r.dh, r.du))].filter(Boolean).join(" · ")}`;
  if(!understood) return "I'm not sure what you're after. Try asking about food, study spaces, jobs, careers fairs, money help or discounts. Meanwhile, here are your top picks:\n" + ranked(ITEMS,C).filter(r=>!uniMismatch(r.it,C)).slice(0,3).map(line).join("\n");
  if(!top.length) return "Nothing on the list matches that yet. Try a broader question, or browse Explore." + (CFG.submitUrl ? " If you know a good spot, suggest it from the link at the bottom of Today." : "");
  const intro = relaxed || (/struggl|hardship|broke/.test(ql) ? "You're not alone, and there is real help. Start here:" : "Here's what I'd look at:");
  return intro + "\n" + top.map(line).join("\n");
}
async function ask(q){
  q = q.trim(); if(!q) return;
  track("ask/question");
  S.chat.push({role:"user", content:q});
  const bot = {role:"assistant", content:"", pending:true};
  S.chat.push(bot); drawMsgs();
  await new Promise(r=>setTimeout(r, 300));
  bot.content = localAnswer(q); bot.pending = false; drawMsgs();
}
function drawMsgs(){
  const box = $("#msgs"); if(!box) return;
  box.innerHTML = S.chat.map(msgHTML).join("");
  box.lastElementChild?.scrollIntoView({block:"nearest", behavior:"smooth"});
}

/* ---------- aside (wide screens) ---------- */
function renderAside(){
  const C = ctx();
  const planned = [...S.plan].map(id=>BY_ID[id]).filter(it=>it && it.start).sort((a,b)=>a.start-b.start);
  const rows = ranked(ITEMS.filter(i=>!i.online), C).filter(r=>r.dh < 2.4);
  const [hx,hy] = proj(C.home); const w = 240;
  const money = ranked(ITEMS.filter(i=>["funding","deals"].includes(i.cat)), C).filter(r=>!uniMismatch(r.it,C)).slice(0,5);
  $("#aside").innerHTML = `
    <div class="panel" style="padding:12px">
      <div class="section-head" style="margin-bottom:8px"><h3 style="margin:0">Near ${esc(C.p.area)}</h3><button class="link" data-nav="map">Open map</button></div>
      <div class="mapwrap" style="pointer-events:none">${mapSVG(rows, {x:hx-w/2,y:hy-w*MH/MW/2,w,h:w*MH/MW}, false, 300)}</div>
      <p class="fineprint" style="margin-top:8px">${rows.length} places within a 30-minute walk of home.</p>
    </div>
    <div class="panel">
      <h3>Your plan</h3>
      ${planned.length ? `<div class="mini-week">${planned.map(it=>`<button class="mini-row" style="--cc:${catColor(it.cat)}" data-open="${esc(it.id)}"><span class="d">${DAYS[it.start.getDay()]} ${it.start.getDate()}</span><i></i><span>${esc(it.title)}</span></button>`).join("")}</div>` : `<p class="fineprint" style="margin:0">Nothing planned yet. Open an event and choose “Add to plan”.</p>`}
    </div>
    <div class="panel">
      <h3>Money you might be missing</h3>
      <div class="mini-week">${money.map(r=>`<button class="mini-row" style="--cc:${catColor(r.it.cat)}" data-open="${esc(r.it.id)}"><i></i><span>${esc(r.it.title)}</span></button>`).join("")}</div>
    </div>`;
}

/* ---------- sheets ---------- */
let lastFocus = null;
function openSheet(html, onMount, opts={}){
  lastFocus = document.activeElement;
  const root = $("#sheetroot");
  root.innerHTML = `<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  const scrim = $("#scrim");
  scrim.addEventListener("click", e => { if((e.target===scrim && !opts.locked) || e.target.closest("[data-close]")) closeSheet(); });
  if(!opts.locked) document.addEventListener("keydown", escClose);
  onMount && onMount(root);
  root.querySelector("button, select, input, a")?.focus({preventScroll:true});
}
function escClose(e){ if(e.key==="Escape") closeSheet(); }
function closeSheet(){ $("#sheetroot").innerHTML = ""; document.removeEventListener("keydown", escClose); lastFocus?.focus?.({preventScroll:true}); }

function openDetail(id){
  const it = BY_ID[id]; if(!it) return;
  track(`open/${it.cat}`);
  const C = ctx(), r = score(it, C);
  const facts = [];
  const pt = priceText(it); if(pt) facts.push([it.cat==="work"?"Pay":it.cat==="funding"?"Amount":it.cat==="housing"?"Cost":"Price", pt]);
  if(it.start) facts.push(["When", it.end && dayDiff(it.end)!==dayDiff(it.start) ? `${dateShort(it.start)} – ${dateShort(it.end)}` : `${dateShort(it.start)}, ${timeOf(it.start)}${it.end?"–"+timeOf(it.end):""}`]);
  if(it.deadline) facts.push(["Deadline", `${dateShort(it.deadline)} · ${daysLeft(it)}d left`]);
  if(hasHours(it)) facts.push(["Hours", hoursSummary(it)]);
  if(it.opensOn || it.closedNote) facts.push(["Status", timingText(it)]);
  if(it.online) facts.push(["Where", it.cat==="funding" ? "Apply online" : "Online"]);
  else { facts.push(["From home", `${fmtDist(r.dh)} · ${travelLabel(r.dh)}`]); if(C.uni.id!=="other") facts.push([`From ${C.uni.name}`, `${fmtDist(r.du)} · ${travelLabel(r.du)}`]); }
  if(it.unis?.length) facts.push(["Who", it.unis.map(u=>UNIS.find(x=>x.id===u)?.name||u).join(", ") + " students"]);
  const isPlannable = !!it.start, saved = S.saved.has(id), inPlan = S.plan.has(id);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${it.ll[0].toFixed(5)},${it.ll[1].toFixed(5)}`;
  const checked = it.checked ? (()=>{ const [y,m,d]=it.checked.split("-").map(Number); return `${d} ${MONTHS[m-1]} ${y}`; })() : "";
  openSheet(`
    <div class="sheet-head" style="--cc:${catColor(it.cat)}">
      <div class="glyph">${ic(it.cat)}</div>
      <div style="min-width:0"><div class="eyebrow">${CATS[it.cat].label}</div><h2>${esc(it.title)}</h2><div class="card-meta" style="white-space:normal">${esc(it.org)} · ${esc(it.area)}</div></div>
      <button class="x" data-close aria-label="Close">${ic("x")}</button>
    </div>
    <div class="facts">${facts.map(([k,v])=>`<div class="fact"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>
    <p class="desc">${esc(it.desc)}</p>
    ${r.why.length ? `<div class="why"><div class="eyebrow" style="color:var(--accent)">Why you're seeing this</div><ul>${r.why.map(w=>`<li>${esc(w)}</li>`).join("")}</ul></div>` : ""}
    <div class="actions">
      ${it.url ? `<a class="btn primary" href="${esc(it.url)}" target="_blank" rel="noopener" data-track="outbound/${esc(it.id)}">${ic("ext")} Official page</a>` : ""}
      <button class="btn" data-dsave="${esc(id)}" aria-pressed="${saved}">${ic("save")} ${saved?"Saved":"Save"}</button>
      ${isPlannable ? `<button class="btn" data-dplan="${esc(id)}" aria-pressed="${inPlan}">${ic(inPlan?"check":"plus")} ${inPlan?"In your plan":"Add to plan"}</button>` : ""}
      ${it.deadline ? `<button class="btn" data-dapplied="${esc(id)}" aria-pressed="${S.applied.has(id)}">${ic("check")} ${S.applied.has(id)?"Done":"Mark done"}</button>`:""}
      ${!it.online ? `<a class="btn" href="${mapsUrl}" target="_blank" rel="noopener" data-track="directions/${esc(it.id)}">${ic("pin")} Directions</a>` : ""}
      <button class="btn" data-share="${esc(id)}">${ic("share")} Share</button>
      <button class="btn ghost" data-hide="${esc(id)}">${ic("hide")} Not for me</button>
    </div>
    <div class="srcline">
      ${it.auto
        ? `<span class="status verified">${ic("check","icon")} Live</span><span>From ${esc(it.source)}'s official calendar · synced ${esc(fmtSynced())}</span>`
        : `<span class="status ${it.stale?"check":"verified"}">${it.stale?"Needs re-checking":ic("check","icon")+" Checked"}</span><span>Source: ${esc(it.source||"—")}${checked?` · checked ${checked}`:""}</span>`}
      ${CFG.feedbackUrl ? `<a href="${esc(CFG.feedbackUrl)}" target="_blank" rel="noopener" data-track="report/${esc(it.id)}">Report a problem</a>` : ""}
    </div>`);
  $("#sheetroot .srcline .icon")?.setAttribute("style","width:12px;height:12px");
}

function onboardingHTML(p, first){
  const uniOpts = UNIS.map(u=>`<option value="${u.id}" ${u.id===p.uni?"selected":""}>${esc(u.full)}</option>`).join("");
  const courseOpts = COURSES.map(([c])=>`<option ${c===p.course?"selected":""}>${esc(c)}</option>`).join("");
  const areaOpts = HOME_AREAS.map(a=>`<option ${a===p.area?"selected":""}>${esc(a)}</option>`).join("");
  return `
    <div class="sheet-head"><div class="onb">${first?`<div class="eyebrow">Welcome to UniLondon</div><h2>Tell us a bit about you</h2><p class="pilot" style="margin:0">Takes 20 seconds. We use it to pick what's useful for you. It stays on your phone.</p>`:`<div class="eyebrow">Your profile</div><h2>Make London yours</h2>`}</div>${first?"":`<button class="x" data-close aria-label="Close">${ic("x")}</button>`}</div>
    <form class="form" id="pform">
      <div class="field"><label for="p-uni">University</label><select id="p-uni">${uniOpts}</select></div>
      <div class="field"><label for="p-course">Course</label><select id="p-course">${courseOpts}</select></div>
      <div class="field"><span class="lbl" id="yr-l">Year</span><div class="seg" role="group" aria-labelledby="yr-l">${[1,2,3,4].map(y=>`<button type="button" data-year="${y}" aria-pressed="${p.year===y}">${y===4?"4+ / PG":"Year "+y}</button>`).join("")}</div></div>
      <div class="field"><label for="p-area">Where you live</label><select id="p-area">${areaOpts}</select></div>
      <div class="field"><span class="lbl" id="int-l">What are you into?</span><div class="chipset" role="group" aria-labelledby="int-l">${INTERESTS.map(i=>`<button type="button" class="chip" data-int="${i.id}" aria-pressed="${p.interests.includes(i.id)}">${esc(i.label)}</button>`).join("")}</div></div>
      ${first ? "" : `<div class="field"><label for="p-rent">Max rent per month</label><div class="range"><input id="p-rent" type="range" min="500" max="2000" step="25" value="${p.rent}"><output id="o-rent" class="mono">£${p.rent}</output></div></div>`}
      <div class="field"><label for="p-meal">Max spend on a meal</label><div class="range"><input id="p-meal" type="range" min="2" max="15" step="1" value="${p.meal}"><output id="o-meal" class="mono">£${p.meal}</output></div></div>
      <div class="actions" style="margin-top:4px"><button class="btn primary" type="submit">${first?"Show me my London":"Save and update my feed"}</button>${first?"":`<button class="btn ghost" type="button" id="p-reset">Reset learning</button>`}</div>
      ${first ? `<p class="fineprint" style="margin:0">UniLondon is a student-run pilot. We count anonymous usage to see if it's useful. No names, no cookies, no tracking across sites.</p>` : ""}
    </form>`;
}
function openProfile(first=false){
  const p = {...S.profile, interests:[...S.profile.interests]};
  openSheet(onboardingHTML(p, first), root => {
    root.querySelectorAll("[data-year]").forEach(b=>b.addEventListener("click",()=>{ p.year=+b.dataset.year; root.querySelectorAll("[data-year]").forEach(x=>x.setAttribute("aria-pressed", x===b)); }));
    root.querySelectorAll("[data-int]").forEach(b=>b.addEventListener("click",()=>{ const id=b.dataset.int; const on = !p.interests.includes(id); p.interests = on ? [...p.interests,id] : p.interests.filter(x=>x!==id); b.setAttribute("aria-pressed", on); }));
    $("#p-rent")?.addEventListener("input", e=>$("#o-rent").textContent="£"+e.target.value);
    $("#p-meal").addEventListener("input", e=>$("#o-meal").textContent="£"+e.target.value);
    $("#p-uni").addEventListener("change", e=>{ const u = UNIS.find(x=>x.id===e.target.value); if(first && u && AREAS[u.area]) $("#p-area").value = u.area; });
    $("#p-reset")?.addEventListener("click", ()=>{ S.hidden.clear(); S.catBias={}; persist(); toast("Learning reset. Hidden listings are back."); render(); });
    $("#pform").addEventListener("submit", e=>{
      e.preventDefault();
      Object.assign(p, {uni:$("#p-uni").value, course:$("#p-course").value, area:$("#p-area").value, meal:+$("#p-meal").value});
      if($("#p-rent")) p.rent = +$("#p-rent").value;
      const wasFirst = !S.onboarded;
      S.profile = p; S.onboarded = true; S.map.vb = null; persist(); closeSheet(); render();
      if(wasFirst){ track(`profile/uni-${p.uni}`); track(`profile/year-${p.year}`); track("onboarding/done"); }
      toast(wasFirst ? "You're all set" : "Feed updated for you");
      window.scrollTo({top:0});
    });
  }, {locked:first});
}
function openPrivacy(){
  openSheet(`<div class="sheet-head"><div><div class="eyebrow">Privacy</div><h2>What UniLondon keeps</h2></div><button class="x" data-close aria-label="Close">${ic("x")}</button></div>
  <div class="desc" style="display:flex;flex-direction:column;gap:10px;margin-top:14px;color:var(--ink-2)">
    <p style="margin:0"><b>Your profile, saved items and plan stay on this device.</b> They're never sent anywhere. Clearing your browser data or tapping “Reset my data” removes them.</p>
    <p style="margin:0"><b>We count anonymous usage</b>${CFG.goatcounter ? " with GoatCounter" : ""}: things like “someone opened the Food tab” or “someone came back a second day”. No names, emails, cookies or cross-site tracking. This tells us whether the pilot is worth continuing.</p>
    <p style="margin:0"><b>Links open other websites</b> (your university, venues, Google Maps), which have their own privacy policies.</p>
  </div>`);
}

/* ---------- toast ---------- */
let toastT;
function toast(msg, undo){
  const root = $("#toastroot"); clearTimeout(toastT);
  root.innerHTML = `<div class="toast" role="status"><span>${esc(msg)}</span>${undo?`<button id="undo">Undo</button>`:""}</div>`;
  if(undo) $("#undo").onclick = () => { undo(); root.innerHTML=""; };
  toastT = setTimeout(()=>root.innerHTML="", 3800);
}

/* ================= actions ================= */
function bump(cat, f){ S.catBias[cat] = Math.max(.4, Math.min(1.6, (S.catBias[cat]??1)*f)); }
function toggleSave(id){
  const it = BY_ID[id]; if(!it) return;
  if(S.saved.has(id)){ S.saved.delete(id); toast("Removed from saved"); }
  else { S.saved.add(id); bump(it.cat, 1.08); track(`save/${it.cat}`); toast("Saved to your plan"); }
  persist();
}
function hideItem(id){
  const it = BY_ID[id]; S.hidden.add(id); S.saved.delete(id); S.plan.delete(id); bump(it.cat, .85); persist();
  track(`hide/${it.cat}`);
  closeSheet(); render();
  toast(`Hidden. You'll see fewer ${CATS[it.cat].short.toLowerCase()} picks.`, ()=>{ S.hidden.delete(id); bump(it.cat, 1/.85); persist(); render(); });
}
async function shareItem(id){
  const it = BY_ID[id];
  const url = location.origin + location.pathname;
  const text = `${it.title} (${it.org}, ${it.area})${timingText(it)?" · "+timingText(it):""}${priceText(it)?" · "+priceText(it):""}`;
  track(`share/${it.cat}`);
  if(navigator.share){ try{ await navigator.share({title:"UniLondon", text, url}); return; }catch(e){ if(e?.name==="AbortError") return; } }
  try{ await navigator.clipboard.writeText(`${text}\nFound on UniLondon: ${url}`); toast("Copied. Paste it in your group chat."); }
  catch(e){ toast("Couldn't copy on this device."); }
}

/* ================= render + routing ================= */
function render(){
  NOW = new Date();
  const v = S.view;
  $("#app").classList.toggle("wide", v==="map");
  renderNav();
  $("#main").innerHTML = v==="explore" ? viewExplore() : v==="map" ? viewMap() : v==="plan" ? viewPlan() : v==="ask" ? viewAsk() : viewToday();
  renderAside();
  if(v==="map") setupMap();
  if(v==="explore") bindExplore();
  if(v==="ask") bindAsk();
}
function go(v, opts={}){
  S.view = v; if(opts.cat && v==="explore") S.explore.cat = opts.cat;
  track(`tab/${v}`, {once:true});
  try{ history.replaceState(null, "", "#"+v); }catch(e){}
  render(); window.scrollTo({top:0});
}
function bindExplore(){
  const q = $("#q");
  let t; q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(()=>{ S.explore.q = q.value; S.explore.limit = 40; const pos=q.selectionStart; render(); const nq=$("#q"); nq.focus(); nq.setSelectionRange(pos,pos); }, 180); });
  q.addEventListener("change", () => { if(q.value.trim()) track("search", {once:true}); });
  $("#sort").addEventListener("change", e => { S.explore.sort = e.target.value; S.explore.limit = 40; render(); });
  $("#t-open").addEventListener("click", () => { S.explore.openNow = !S.explore.openNow; S.explore.limit = 40; render(); });
  $("#t-free").addEventListener("click", () => { S.explore.free = !S.explore.free; S.explore.limit = 40; render(); });
  $("#more")?.addEventListener("click", () => { const y = window.scrollY; S.explore.limit += 40; render(); window.scrollTo({top:y}); });
  $("#unhide")?.addEventListener("click", () => { S.hidden.clear(); persist(); render(); });
}
function bindAsk(){
  const ta = $("#askinput");
  ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = Math.min(140, ta.scrollHeight)+"px"; });
  ta.addEventListener("keydown", e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); $("#askform").requestSubmit(); } });
  $("#askform").addEventListener("submit", e => { e.preventDefault(); const v = ta.value; ta.value=""; ta.style.height="auto"; if(!S.chat.length) $("#msgs").innerHTML=""; ask(v); });
}

document.addEventListener("click", e => {
  const a = e.target.closest("a[data-track]"); if(a){ track(a.dataset.track); return; }
  const t = e.target.closest("button, [data-open], [data-nav]"); if(!t) return;
  const d = t.dataset;
  if(d.save){ e.stopPropagation(); toggleSave(d.save); render(); return; }
  if(d.open){ openDetail(d.open); return; }
  if(d.nav){ closeSheet(); go(d.nav, {cat:d.cat}); return; }
  if("profile" in d){ openProfile(false); return; }
  if(d.ecat){ S.explore.cat = d.ecat; S.explore.limit = 40; render(); return; }
  if(d.mcat){ S.map.cat = d.mcat; S.map.active = null; render(); return; }
  if(d.suggest){ $("#msgs").innerHTML=""; ask(d.suggest); return; }
  if(d.dsave){ toggleSave(d.dsave); openDetail(d.dsave); render(); return; }
  if(d.dplan){ const id=d.dplan; if(S.plan.has(id)){ S.plan.delete(id); toast("Removed from your plan"); } else { S.plan.add(id); S.saved.add(id); bump(BY_ID[id].cat,1.1); track(`plan/${BY_ID[id].cat}`); toast("Added to your plan"); } persist(); openDetail(id); render(); return; }
  if(d.dapplied){ const id=d.dapplied; S.applied.has(id)?S.applied.delete(id):S.applied.add(id); persist(); openDetail(id); render(); return; }
  if(d.share){ shareItem(d.share); return; }
  if(d.hide){ hideItem(d.hide); return; }
  if(d.survey){ S.survey = {answer:d.survey, on:new Date().toISOString().slice(0,10)}; persist(); track(`survey/${d.survey}`); render(); return; }
  if("surveyLater" in d){ S.survey = {dismissedOn:new Date().toISOString().slice(0,10)}; persist(); render(); return; }
  if("surveyDone" in d){ S.survey.thanked = true; persist(); render(); return; }
  if("install" in d && deferredInstall){ track("install/prompt"); deferredInstall.prompt(); deferredInstall.userChoice.finally(()=>{ deferredInstall=null; render(); }); return; }
  if("installNo" in d){ S.installDismissed = true; persist(); render(); return; }
  if("privacy" in d){ openPrivacy(); return; }
  if("reset" in d){
    if(t.dataset.armed){ store.clear(); location.reload(); return; }
    t.dataset.armed = "1"; t.textContent = "Tap again to erase everything"; setTimeout(()=>{ if(t.isConnected){ delete t.dataset.armed; t.textContent="Reset my data"; } }, 4000); return;
  }
});
document.addEventListener("change", e => {
  const id = e.target.dataset?.applied; if(!id) return;
  e.target.checked ? S.applied.add(id) : S.applied.delete(id); persist(); render();
  if(e.target.checked){ track(`done/${BY_ID[id]?.cat}`); toast("Nice. Marked as done."); }
});
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if(h!==S.view && NAV.some(([v])=>v===h)){ closeSheet(); S.view = h; render(); window.scrollTo({top:0}); } });
document.addEventListener("visibilitychange", () => { if(document.visibilityState==="visible" && ITEMS.length){ const d = new Date(); if(d.getDate()!==NOW.getDate() || d-NOW > 15*60e3) { render(); } } });

/* ================= boot ================= */
async function boot(){
  try{
    const [lres, eres] = await Promise.all([
      fetch("listings.json", {cache:"no-cache"}),
      fetch("events.json", {cache:"no-cache"}).catch(()=>null),
    ]);
    if(!lres.ok) throw new Error(lres.status);
    const data = await lres.json();
    S.updated = data.updated || "";
    let events = [];
    if(eres && eres.ok){ try{ const ev = await eres.json(); S.events = {generated: ev.generated, sources: ev.sources || []}; events = ev.events || []; }catch(e){} }
    hydrate([...(data.listings || []), ...events]);
  }catch(err){
    $("#main").innerHTML = `<div class="loading">Couldn't load listings. Check your connection and refresh.</div>`;
    return;
  }
  const hash = (location.hash||"").slice(1);
  if(NAV.some(([v])=>v===hash)) S.view = hash;
  render();
  trackVisit();
  if(!S.onboarded) openProfile(true);
}
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
boot();
})();
