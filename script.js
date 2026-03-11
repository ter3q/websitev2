
function switchTab(tabId, element) {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(sec => sec.classList.remove('active'));

    const links = document.querySelectorAll('nav a');
    links.forEach(link => link.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}


const DISCORD_ID = "988061028489236579"; 

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

        const metaContainer = document.getElementById("discord-meta");
        metaContainer.innerHTML = "";

        clearInterval(spotifyInterval);
        clearInterval(activityInterval);

        if (data.listening_to_spotify && data.spotify) {
            const { song, artist, album, album_art_url, timestamps } = data.spotify;
            metaContainer.innerHTML = `
            <div class="meta-row">
                <span class="meta-label">Playing</span>
                <span class="meta-value"><strong>${song}</strong><br><span style="font-size:0.8rem; color:#c4a98b;">by ${artist}</span></span>
            </div>
            <div class="meta-row" style="margin-top: 8px;">
                <span class="meta-label"></span>
                <div style="width: 100%; max-width: 250px;">
                ${album_art_url ? `<img src="${album_art_url}" alt="${album}" width="48" height="48" style="border-radius: 4px; display: block; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3)" />` : ''}
                <div>
                    <div style="height: 3px; border-radius: 2px; background: rgba(255,255,255,0.1); overflow: hidden; margin-bottom: 6px;">
                        <div id="spotify-bar" style="height: 100%; width: 0%; background: #d4b595; border-radius: 2px; transition: width 0.95s linear;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #c4a98b; font-variant-numeric: tabular-nums;">
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
                <div style="margin-top: 8px;">
                <div class="act-card">
                    ${imgUrl ? `<img src="${imgUrl}" width="48" height="48" style="border-radius: 6px; flex-shrink: 0; object-fit: cover;" />` : ''}
                    <div style="min-width: 0; flex: 1;">
                        <p style="font-size: 0.9rem; font-weight: 700; color: #fdfbf7;">${a.name}</p>
                        ${a.details ? `<p style="font-size: 0.8rem; color: #e8e2d2; margin-top: 2px;">${a.details}</p>` : ''}
                        ${a.state ? `<p style="font-size: 0.8rem; color: #c4a98b; margin-top: 2px;">${a.state}</p>` : ''}
                        ${a.timestamps?.start ? `<p id="act-time-${i}" style="font-size: 0.75rem; color: #c4a98b; margin-top: 4px; font-variant-numeric: tabular-nums;"></p>` : ''}
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
setInterval(fetchLanyard, 5000);