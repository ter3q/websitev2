
const DISCORD_ID = "988061028489236579"; 
const STATUS_COLORS = {
online:  "#3ba55d",
idle:    "#faa61a",
dnd:     "#ed4245",
offline: "#747f8d",
};

function fmtMs(ms) {
const t = Math.max(0, Math.floor(ms / 1000));
const m = Math.floor(t / 60);
const s = t % 60;
return `${m}:${String(s).padStart(2, "0")}`;
}

let spotifyInterval;
let activityInterval;

async function fetchLanyard() {
try {
const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
const { data } = await res.json();
if (!data) return;


const statusDot = document.getElementById("status-dot");
const statusColor = STATUS_COLORS[data.discord_status] || STATUS_COLORS.offline;
statusDot.style.background = statusColor;
statusDot.style.boxShadow = `0 0 5px ${statusColor}77`;
statusDot.style.display = "block";
statusDot.style.animation = data.discord_status === "online" ? "blink 2.2s ease-in-out infinite" : "none";


const activityLine = document.getElementById("activity-line");
let currentActivityText = "";

if (data.listening_to_spotify && data.spotify) {
    currentActivityText = `Listening to ${data.spotify.song} by ${data.spotify.artist}`;
} else {
    const mainAct = data.activities.find(a => a.type !== 4);
    if (mainAct) {
    currentActivityText = `Playing ${mainAct.name}`;
    }
}


if (currentActivityText) {
    activityLine.innerText = currentActivityText;
    activityLine.style.display = "block";
} else {
    activityLine.style.display = "none";
}


const metaContainer = document.getElementById("discord-meta");
metaContainer.innerHTML = "";

clearInterval(spotifyInterval);
clearInterval(activityInterval);

if (data.listening_to_spotify && data.spotify) {
    const { song, artist, album, album_art_url, timestamps } = data.spotify;
    metaContainer.innerHTML = `
    <div class="meta-row">
        <span class="meta-label">listening to</span>
        <span class="meta-value"><strong>${song}</strong> by ${artist}</span>
    </div>
    <div class="meta-row" style="margin-top: 8px;">
        <span class="meta-label"></span>
        <div style="width: 100%; max-width: 220px;">
        ${album_art_url ? `<img src="${album_art_url}" alt="${album}" width="32" height="32" style="border-radius: 4px; display: block; margin-bottom: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.3)" />` : ''}
        <div style="margin-top: 8px;">
            <div style="height: 2px; border-radius: 1px; background: var(--border); overflow: hidden; margin-bottom: 4px;">
            <div id="spotify-bar" style="height: 100%; width: 0%; background: var(--fg); border-radius: 1px; transition: width 0.95s linear;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--fg-3); font-variant-numeric: tabular-nums;">
            <span id="spotify-elapsed">0:00</span>
            <span>${fmtMs(timestamps.end - timestamps.start)}</span>
            </div>
        </div>
        </div>
    </div>
    `;

    const barEl = document.getElementById("spotify-bar");
    const elapsedEl = document.getElementById("spotify-elapsed");
    const updateSpotify = () => {
    const elapsed = Math.max(0, Date.now() - timestamps.start);
    const duration = timestamps.end - timestamps.start;
    const pct = Math.min(100, (elapsed / duration) * 100);
    if(barEl) barEl.style.width = `${pct}%`;
    if(elapsedEl) elapsedEl.innerText = fmtMs(elapsed);
    };
    updateSpotify();
    spotifyInterval = setInterval(updateSpotify, 1000);

} else if (data.activities.filter(a => a.type !== 4).length > 0) {
    const acts = data.activities.filter(a => a.type !== 4);
    let html = "";
    acts.forEach((a, i) => {
    let imgUrl = "";
    if (a.assets?.large_image) {
        if (a.assets.large_image.startsWith("mp:external/")) {
        imgUrl = `https://media.discordapp.net/external/${a.assets.large_image.slice(12)}`;
        } else if (a.application_id) {
        imgUrl = `https://cdn.discordapp.com/app-assets/${a.application_id}/${a.assets.large_image}.png`;
        }
    }
    html += `
        <div style="margin-top: 4px;">
        <div class="act-card">
            ${imgUrl ? `<img src="${imgUrl}" width="36" height="36" style="border-radius: 6px; flex-shrink: 0; object-fit: cover;" />` : ''}
            <div style="min-width: 0; flex: 1;">
            <p style="font-size: 13px; font-weight: 500; color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.name}</p>
            ${a.details ? `<p style="font-size: 12px; color: var(--fg-2); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.details}</p>` : ''}
            ${a.state ? `<p style="font-size: 12px; color: var(--fg-3); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.state}</p>` : ''}
            ${a.timestamps?.start ? `<p id="act-time-${i}" style="font-size: 11px; color: var(--fg-3); margin-top: 2px; font-variant-numeric: tabular-nums;"></p>` : ''}
            </div>
        </div>
        </div>
    `;
    });
    metaContainer.innerHTML = html;

    const updateActivityTime = () => {
    acts.forEach((a, i) => {
        if (a.timestamps?.start) {
        const el = document.getElementById(`act-time-${i}`);
        if (el) el.innerText = `${fmtMs(Date.now() - a.timestamps.start)} elapsed`;
        }
    });
    };
    updateActivityTime();
    activityInterval = setInterval(updateActivityTime, 1000);

} else {
    metaContainer.innerHTML = `
    <div class="meta-row">
        <span class="meta-label">activity</span>
        <span class="meta-value">Nothing right now</span>
    </div>
    `;
}

} catch (e) {
console.error("Lanyard Fetch Error:", e);
}
}

fetchLanyard();
setInterval(fetchLanyard, 15000);