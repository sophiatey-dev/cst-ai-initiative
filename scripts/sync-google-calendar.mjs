import { mkdir, writeFile } from "node:fs/promises";

const CALENDAR_ID = "c_2d5281aabd9761afe0af92777f3088081ab620546331f1bf36a26daf3d0d898@group.calendar.google.com";
const ICS_URL = process.env.KAKU_CALENDAR_ICS_URL || `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
const TIME_ZONE = "Asia/Kuala_Lumpur";

const response = await fetch(ICS_URL);
if (!response.ok) throw new Error(`Google Calendar feed returned ${response.status}. Make the calendar public or provide KAKU_CALENDAR_ICS_URL.`);
const source = (await response.text()).replace(/\r?\n[ \t]/g, "");

const decode = value => (value || "")
  .replace(/\\n/gi, " ")
  .replace(/\\,/g, ",")
  .replace(/\\;/g, ";")
  .replace(/\\\\/g, "\\")
  .trim();

const read = (block, key) => {
  const line = block.split(/\r?\n/).find(item => item.split(":", 1)[0].split(";", 1)[0] === key);
  return line ? decode(line.slice(line.indexOf(":") + 1)) : "";
};

const readRaw = (block, key) => {
  const line = block.split(/\r?\n/).find(item => item.split(":", 1)[0].split(";", 1)[0] === key);
  return line ? { params: line.slice(0, line.indexOf(":")), value: line.slice(line.indexOf(":") + 1) } : null;
};

const parseDate = raw => {
  if (!raw) return null;
  const value = raw.value;
  const allDay = /^\d{8}$/.test(value) || raw.params.includes("VALUE=DATE");
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
  if (!match) return null;
  const [,y,m,d,hh="00",mm="00",ss="00",z] = match;
  const date = z ? new Date(Date.UTC(+y,+m-1,+d,+hh,+mm,+ss)) : new Date(+y,+m-1,+d,+hh,+mm,+ss);
  return { date, allDay };
};

const parts = date => Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(date).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
const isoDate = date => { const p=parts(date); return `${p.year}-${p.month}-${p.day}`; };
const displayDate = date => new Intl.DateTimeFormat("en-MY", { timeZone: TIME_ZONE, day:"2-digit", month:"short" }).format(date).toUpperCase();
const displayTime = (start,end,allDay) => allDay ? "All day" : `${new Intl.DateTimeFormat("en-MY", { timeZone: TIME_ZONE, hour:"numeric", minute:"2-digit" }).format(start)}${end?`–${new Intl.DateTimeFormat("en-MY", { timeZone: TIME_ZONE, hour:"numeric", minute:"2-digit" }).format(end)}`:""}`;

const categoryFor = (title,description,categories) => {
  const text = `${title} ${description} ${categories}`.toLowerCase();
  if (/\b(ai for all|forum air|awareness)\b/.test(text)) return "AI for All";
  if (/\b(ai for skills|prompt|onboarding|foundation|class)\b/.test(text)) return "AI for Skills";
  if (/\b(ai for business|biggins|trading|trader|workflow|vibe coding|dashboard|business)\b/.test(text)) return "AI for Business and Works";
  return "Community and Life Interests";
};

const now = Date.now();
const earliest = now - 45 * 86400000;
const latest = now + 400 * 86400000;
const events = [...source.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)].map(match => {
  const block = match[1];
  const start = parseDate(readRaw(block,"DTSTART"));
  const end = parseDate(readRaw(block,"DTEND"));
  const title = read(block,"SUMMARY") || "Kaku Community Event";
  const description = read(block,"DESCRIPTION");
  const categories = read(block,"CATEGORIES");
  const url = read(block,"URL") || description.match(/https?:\/\/[^\s]+/)?.[0];
  if (!start || read(block,"STATUS") === "CANCELLED") return null;
  return {
    category: categoryFor(title,description,categories),
    iso: isoDate(start.date),
    date: displayDate(start.date),
    time: displayTime(start.date,end?.date,start.allDay),
    title,
    copy: description.replace(/\[[^\]]+\]/g,"").slice(0,220) || read(block,"LOCATION") || "Ka-Ku community calendar event.",
    ...(url ? { href:url } : {})
  };
}).filter(Boolean).filter(event => {
  const time = new Date(`${event.iso}T00:00:00+08:00`).getTime();
  return time >= earliest && time <= latest;
}).sort((a,b)=>`${a.iso} ${a.time}`.localeCompare(`${b.iso} ${b.time}`));

await mkdir("public", { recursive:true });
await writeFile("public/calendar-events.json", `${JSON.stringify(events,null,2)}\n`);
console.log(`Synced ${events.length} Ka-Ku calendar events.`);
