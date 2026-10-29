// UI wiring: birth form, place search, chart wheel, week plan, shopping list.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const PROFILE_KEY = 'starfood.profile';
  const EL_COLOR = { fire: 'var(--fire)', earth: 'var(--earth)', air: 'var(--air)', water: 'var(--water)' };
  const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
  const PLANET_GLYPH = Object.fromEntries(Astro.PLANETS.map((p) => [p.name, p.glyph]));

  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } },
  };

  let state = { profile: null, chart: null, days: null, place: null };

  // ── Kitchen reading copy ──────────────────────────────────
  const KITCHEN = {
    fire: 'You cook hot and fast: open flame, chili, citrus and bold, celebratory flavors.',
    earth: 'You want real, hearty food: roasted roots, whole grains, slow braises and good bread.',
    air: 'You graze and experiment: many small plates, fresh herbs, crunch and global mash-ups.',
    water: 'You cook to feel cared for: soups, broths, seafood, creamy textures and nostalgic dishes.',
  };
  const MOON = {
    fire: 'comfort means something sizzling and spicy',
    earth: 'comfort means a full plate of something simple and familiar',
    air: 'comfort means variety, snacks and a meal shared with good conversation',
    water: 'comfort means a warm bowl that tastes like home',
  };
  const VENUS = {
    fire: 'smoky, charred and golden flavors',
    earth: 'butter, ripe fruit and rich, earthy sweetness',
    air: 'bright, herby, beautifully arranged plates',
    water: 'coconut, sea salt and silky, delicate textures',
  };
  const MARS = {
    fire: 'High spice tolerance. Bring the heat.',
    earth: 'You like steady heat: slow-cooked, peppery warmth over fireworks.',
    air: 'You like a zing over a burn: ginger, lime and chili flakes.',
    water: 'Your heat runs deep: fermented, smoky, complex chilies.',
  };

  // ── Place search (Open-Meteo geocoding, no key) ──────────
  let searchTimer = null;
  let searchSeq = 0;
  let suggestions = [];
  let activeIdx = -1;

  async function searchPlaces(q) {
    const seq = ++searchSeq;
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (seq !== searchSeq) return;
      suggestions = (data.results || []).map((r) => ({
        label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
        lat: r.latitude, lon: r.longitude, tz: r.timezone,
      }));
      renderSuggestions();
    } catch {
      if (seq !== searchSeq) return;
      suggestions = [];
      $('place-results').hidden = true;
      $('place-chosen').textContent = 'Couldn’t reach the place search. Enter coordinates manually below.';
    }
  }

  function renderSuggestions() {
    const ul = $('place-results');
    activeIdx = -1;
    if (!suggestions.length) {
      ul.innerHTML = '<li aria-disabled="true"><small>No matches. Try a nearby larger city.</small></li>';
    } else {
      ul.innerHTML = suggestions.map((s, i) =>
        `<li role="option" data-i="${i}">${esc(s.label.split(', ')[0])}<small>${esc(s.label.split(', ').slice(1).join(', '))} · ${esc(s.tz || '')}</small></li>`).join('');
    }
    ul.hidden = false;
  }

  function choosePlace(p) {
    state.place = p;
    $('place').value = p.label;
    $('lat').value = (+p.lat).toFixed(4);
    $('lon').value = (+p.lon).toFixed(4);
    if (p.tz) setTz(p.tz);
    $('place-results').hidden = true;
    showChosen();
  }

  function showChosen() {
    const lat = parseFloat($('lat').value);
    const lon = parseFloat($('lon').value);
    $('place-chosen').textContent = Number.isFinite(lat) && Number.isFinite(lon)
      ? `✶ ${lat.toFixed(2)}°, ${lon.toFixed(2)}° · ${$('tz').value}` : '';
  }

  function initPlaceSearch() {
    const input = $('place');
    input.addEventListener('input', () => {
      state.place = null;
      clearTimeout(searchTimer);
      const q = input.value.trim();
      if (q.length < 2) { $('place-results').hidden = true; return; }
      searchTimer = setTimeout(() => searchPlaces(q), 280);
    });
    input.addEventListener('keydown', (e) => {
      const ul = $('place-results');
      if (ul.hidden || !suggestions.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = (activeIdx + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
        [...ul.children].forEach((li, i) => li.setAttribute('aria-selected', i === activeIdx));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        choosePlace(suggestions[Math.max(activeIdx, 0)]);
      } else if (e.key === 'Escape') {
        ul.hidden = true;
      }
    });
    $('place-results').addEventListener('mousedown', (e) => {
      const li = e.target.closest('li[data-i]');
      if (li) { e.preventDefault(); choosePlace(suggestions[+li.dataset.i]); }
    });
    input.addEventListener('blur', () => setTimeout(() => ($('place-results').hidden = true), 150));
    for (const id of ['lat', 'lon', 'tz']) $(id).addEventListener('change', showChosen);
  }

  function initTimezones() {
    const zones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC'];
    if (!zones.includes('UTC')) zones.unshift('UTC');
    $('tz').innerHTML = zones.map((z) => `<option>${esc(z)}</option>`).join('');
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  }

  // The geocoder returns current IANA names (Asia/Kolkata) that the browser's list may
  // only know by an older alias (Asia/Calcutta), so add any missing zone as an option.
  function setTz(tz) {
    const sel = $('tz');
    if (![...sel.options].some((o) => o.value === tz)) sel.add(new Option(tz));
    sel.value = tz;
  }

  function validTz(tz) {
    try { new Intl.DateTimeFormat('en', { timeZone: tz }); return !!tz; } catch { return false; }
  }

  // ── Form ─────────────────────────────────────────────────
  function readForm() {
    const lat = parseFloat($('lat').value);
    const lon = parseFloat($('lon').value);
    const date = $('date').value;
    if (!date) return { error: 'Please enter your birth date.' };
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return { error: 'Please choose your birth place from the list, or enter coordinates manually.' };
    }
    if (!validTz($('tz').value)) return { error: 'Please choose a valid time zone.' };
    return {
      name: $('name').value.trim(),
      date,
      time: $('time').value || '12:00',
      timeUnknown: $('time-unknown').checked,
      place: { label: $('place').value.trim() || `${lat.toFixed(2)}, ${lon.toFixed(2)}`, lat, lon, tz: $('tz').value },
      gf: $('gf').checked,
      df: $('df').checked,
      servings: +$('servings').value,
      seed: state.profile ? state.profile.seed : 1,
      weekStart: state.profile ? state.profile.weekStart : undefined,
    };
  }

  function fillForm(p) {
    $('name').value = p.name || '';
    $('date').value = p.date;
    $('time').value = p.time;
    $('time-unknown').checked = !!p.timeUnknown;
    $('time').disabled = !!p.timeUnknown;
    $('place').value = p.place.label;
    $('lat').value = p.place.lat;
    $('lon').value = p.place.lon;
    setTz(p.place.tz);
    $('gf').checked = p.gf;
    $('df').checked = p.df;
    $('servings').value = p.servings;
    showChosen();
  }

  function computeFromProfile(p) {
    const [y, m, d] = p.date.split('-').map(Number);
    const [hh, mm] = (p.timeUnknown ? '12:00' : p.time).split(':').map(Number);
    const utc = Astro.localToUtc(y, m, d, hh, mm, p.place.tz);
    return Astro.computeChart(utc, p.place.lat, p.place.lon, !p.timeUnknown);
  }

  function run(profile, { scroll } = {}) {
    // Compute first so a profile that can't be charted is never saved.
    state.chart = computeFromProfile(profile);
    state.profile = profile;
    replan();
    renderChart();
    $('results').hidden = false;
    if (scroll) $('chart').scrollIntoView({ behavior: 'smooth' });
  }

  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Keep the same week (meals and checkmarks) until 7 days have passed, then start a new one.
  function weekStart(p) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = (p.weekStart || '').split('-').map(Number);
    const start = p.weekStart ? new Date(y, m - 1, d) : null;
    if (start && today - start >= 0 && today - start < 7 * 864e5) return start;
    p.weekStart = ymd(today);
    pruneChecked();
    return today;
  }

  function pruneChecked() {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith('starfood.checked.')) localStorage.removeItem(k);
    } catch { /* storage unavailable */ }
  }

  function replan() {
    const p = state.profile;
    state.days = Planner.planWeek(state.chart, {
      diet: { glutenFree: p.gf, dairyFree: p.df },
      seed: `${p.date}|${p.time}|${p.place.lat}|${p.seed}`,
      startDate: weekStart(p),
    });
    store.set(PROFILE_KEY, p);
    renderWeek();
    renderList();
  }

  // ── Chart wheel ──────────────────────────────────────────
  function renderWheel(chart) {
    const C = 200;
    const ref = chart.asc ? chart.asc.lon : 0;
    const ang = (lon) => ((180 + lon - ref) * Math.PI) / 180;
    const pt = (r, lon) => [C + r * Math.cos(ang(lon)), C - r * Math.sin(ang(lon))];
    const f = (n) => n.toFixed(1);
    let svg = `<svg viewBox="0 0 400 400" role="img" aria-label="Natal chart wheel">`;
    svg += `<circle cx="${C}" cy="${C}" r="195" fill="rgba(255,255,255,0.02)" stroke="var(--line)"/>`;

    Astro.SIGNS.forEach((s, i) => {
      const a0 = i * 30, a1 = a0 + 30;
      const [x0, y0] = pt(195, a0), [x1, y1] = pt(195, a1), [x2, y2] = pt(160, a1), [x3, y3] = pt(160, a0);
      svg += `<path d="M${f(x0)},${f(y0)} A195,195 0 0 0 ${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A160,160 0 0 1 ${f(x3)},${f(y3)}Z" fill="${EL_COLOR[s.element]}" fill-opacity="0.16" stroke="var(--line)"/>`;
      const [gx, gy] = pt(177.5, a0 + 15);
      svg += `<text x="${f(gx)}" y="${f(gy)}" fill="${EL_COLOR[s.element]}" font-size="17" text-anchor="middle" dominant-baseline="central">${s.glyph}&#xFE0E;</text>`;
      const [lx0, ly0] = pt(160, a0), [lx1, ly1] = pt(70, a0);
      svg += `<line x1="${f(lx0)}" y1="${f(ly0)}" x2="${f(lx1)}" y2="${f(ly1)}" stroke="var(--line)"/>`;
      if (chart.houses) {
        const house = ((i - chart.asc.sign.index + 12) % 12) + 1;
        const [hx, hy] = pt(82, a0 + 15);
        svg += `<text x="${f(hx)}" y="${f(hy)}" fill="var(--muted)" font-size="10" text-anchor="middle" dominant-baseline="central">${house}</text>`;
      }
    });
    svg += `<circle cx="${C}" cy="${C}" r="160" fill="none" stroke="var(--line)"/><circle cx="${C}" cy="${C}" r="70" fill="var(--bg)" stroke="var(--line)"/>`;

    if (chart.asc) {
      for (const [lon, label] of [[chart.asc.lon, 'ASC'], [chart.mc.lon, 'MC']]) {
        const [x0, y0] = pt(195, lon), [x1, y1] = pt(195, lon + 180), [tx, ty] = pt(208, lon);
        svg += `<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" stroke="var(--gold)" stroke-opacity="0.55" stroke-dasharray="3 4"/>`;
        svg += `<text x="${f(tx)}" y="${f(ty)}" fill="var(--gold)" font-size="9" text-anchor="middle" dominant-baseline="central">${label}</text>`;
      }
    }

    // Spread clustered planets so glyphs don't overlap.
    const ps = [...chart.planets].sort((a, b) => a.lon - b.lon).map((p) => ({ p, d: p.lon }));
    for (let pass = 0; pass < 30; pass++) {
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i], b = ps[(i + 1) % ps.length];
        const gap = ((b.d - a.d + 360) % 360);
        if (gap < 10 && ps.length > 1) { a.d -= (10 - gap) / 2; b.d += (10 - gap) / 2; }
      }
    }
    for (const { p, d } of ps) {
      const [tx0, ty0] = pt(160, p.lon), [tx1, ty1] = pt(150, p.lon), [gx, gy] = pt(132, d);
      svg += `<line x1="${f(tx0)}" y1="${f(ty0)}" x2="${f(tx1)}" y2="${f(ty1)}" stroke="var(--text)" stroke-width="1.5"/>`;
      svg += `<text x="${f(gx)}" y="${f(gy)}" fill="var(--text)" font-size="17" text-anchor="middle" dominant-baseline="central"><title>${p.name} ${Astro.formatDegree(p.lon)}</title>${p.glyph}&#xFE0E;</text>`;
    }
    svg += `<text x="${C}" y="${C}" fill="var(--gold)" font-size="26" text-anchor="middle" dominant-baseline="central" font-family="var(--display)">✶</text></svg>`;
    return svg;
  }

  function renderChart() {
    const { chart, profile } = state;
    const sun = chart.planets[0], moon = chart.planets[1];
    $('chart-title').textContent = profile.name ? `${profile.name}’s natal chart` : 'Your natal chart';
    const when = new Date(`${profile.date}T00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    $('chart-sub').innerHTML = `${esc(when)}${profile.timeUnknown ? '' : ` at ${esc(profile.time)}`} · ${esc(profile.place.label)}<br>`
      + `<b>${sun.sign.glyph}&#xFE0E; ${sun.sign.name} Sun</b> · <b>${moon.sign.glyph}&#xFE0E; ${moon.sign.name} Moon</b>`
      + (chart.asc ? ` · <b>${chart.asc.sign.glyph}&#xFE0E; ${chart.asc.sign.name} Rising</b>` : ' · <em>Rising unknown without a birth time. Your Moon could be off by a sign.</em>');

    $('wheel').innerHTML = renderWheel(chart);

    let rows = chart.planets.map((p) => `<tr><td>${p.glyph}&#xFE0E;</td><td>${p.name}${p.retrograde ? '<span class="rx">℞</span>' : ''}</td>`
      + `<td>${Astro.formatDegree(p.lon)}</td><td class="house">${p.house ? `House ${p.house}` : ''}</td></tr>`).join('');
    if (chart.asc) {
      rows = `<tr class="angle"><td>↑</td><td>Ascendant</td><td>${Astro.formatDegree(chart.asc.lon)}</td><td class="house">House 1</td></tr>`
        + `<tr class="angle"><td>⌃</td><td>Midheaven</td><td>${Astro.formatDegree(chart.mc.lon)}</td><td class="house"></td></tr>` + rows;
    }
    $('placements').innerHTML = rows;

    const total = Object.values(chart.elements).reduce((a, b) => a + b, 0);
    $('elements').innerHTML = Object.entries(chart.elements).map(([el, v]) => `<div class="el"><strong>${el}</strong>${Math.round((v / total) * 100)}%`
      + `<div class="bar"><i style="width:${(v / total) * 100}%;background:${EL_COLOR[el]}"></i></div></div>`).join('');

    const dominant = Object.entries(chart.elements).sort((a, b) => b[1] - a[1])[0][0];
    const venus = chart.planets[3], mars = chart.planets[4];
    const sixth = chart.houses ? chart.houses[5].sign : null;
    $('reading').innerHTML = [
      [`A ${dominant} kitchen`, KITCHEN[dominant]],
      [`Moon in ${moon.sign.name}`, `Your Moon rules appetite: ${MOON[moon.sign.element]}.`],
      [`Venus in ${venus.sign.name}`, `Your palate leans toward ${VENUS[venus.sign.element]}.`],
      [`Mars in ${mars.sign.name}`, MARS[mars.sign.element]],
      sixth ? [`6th house in ${sixth.name}`, `Your daily-health house is ${sixth.element}, so ${KITCHEN[sixth.element].replace('You ', 'everyday meals work best when you ').replace(/^./, (c) => c.toLowerCase())}`] : null,
    ].filter(Boolean).map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('');
  }

  // ── Week ─────────────────────────────────────────────────
  function renderWeek() {
    $('days').innerHTML = state.days.map((day, di) => {
      const meals = Planner.MEALS.map((m) => {
        const meal = day.meals[m];
        if (!meal) return `<div class="meal empty"><small>${MEAL_LABEL[m]}</small><strong>Leftovers night</strong></div>`;
        const r = meal.recipe;
        return `<button type="button" class="meal" data-day="${di}" data-meal="${m}" style="--accent:${EL_COLOR[r.el[0]]}">`
          + `<small>${MEAL_LABEL[m]} · ${r.time} min</small><strong>${esc(r.name)}</strong><span class="why">${esc(meal.reason)}</span></button>`;
      }).join('');
      const date = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return `<article class="day"><header><h3>${day.name}</h3><span class="date">${date}</span></header>`
        + `<div class="omens"><span>${PLANET_GLYPH[day.ruler]}&#xFE0E; <b>${day.ruler}</b> day</span><span>☽ transit in <b>${day.transitMoon.name}</b></span></div>${meals}</article>`;
    }).join('');
  }

  function openRecipe(di, m) {
    const day = state.days[di];
    const { recipe: r, reason } = day.meals[m];
    const scale = state.profile.servings / Planner.BASE_SERVINGS;
    const ing = r.ing.map((x) => `<li><span class="qty">${esc(Planner.formatQty(x.qty * scale, x.unit))}</span> ${esc(x.name)}${x.swapped ? '<span class="swap">swap</span>' : ''}</li>`).join('');
    $('recipe-body').innerHTML = `<h2>${esc(r.name)}</h2>`
      + `<p class="meta">${day.name} ${MEAL_LABEL[m].toLowerCase()} · ${r.time} min · serves ${state.profile.servings}</p>`
      + `<div class="astro"><p>${esc(reason)}</p><p>${esc(r.note)}</p></div>`
      + `<div class="tags">${[...r.el, ...r.pl, ...r.signs].map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`
      + `<h3>Ingredients</h3><ul>${ing}</ul><p class="meta">Plus salt and pepper to taste.</p>`
      + `<h3>Method</h3><ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`;
    $('recipe-dialog').showModal();
  }

  // ── Shopping list ────────────────────────────────────────
  function listKey() {
    const p = state.profile;
    return `starfood.checked.${p.date}|${p.time}|${p.place.lat}|${p.seed}|${p.gf}|${p.df}|${p.weekStart}`;
  }

  function renderList() {
    const groups = Planner.shoppingList(state.days, state.profile.servings);
    const checked = new Set(store.get(listKey()) || []);
    const count = groups.reduce((n, g) => n + g.items.length, 0);
    const diet = [state.profile.gf && 'gluten-free', state.profile.df && 'dairy-free'].filter(Boolean).join(', ');
    $('shop-sub').textContent = `${count} items for 21 meals · serves ${state.profile.servings}${diet ? ` · ${diet}` : ''}`;
    $('list').innerHTML = groups.map((g) => `<div class="aisle"><h3>${esc(g.label)}</h3>${g.items.map((i) => {
      const key = `${i.name}|${i.unit}`;
      const done = checked.has(key);
      const uses = i.uses.length ? `<span class="uses">${esc(i.uses.join(', '))}</span>` : '';
      return `<label class="item${done ? ' done' : ''}"><input type="checkbox" data-key="${esc(key)}"${done ? ' checked' : ''}>`
        + `<span><span class="qty">${esc(Planner.formatQty(i.qty, i.unit))}</span> <span class="name">${esc(i.name)}</span>${uses}</span></label>`;
    }).join('')}</div>`).join('');
    state.listText = groups.map((g) => `${g.label}\n${g.items.map((i) => `- ${[Planner.formatQty(i.qty, i.unit), i.name].filter(Boolean).join(' ')}`).join('\n')}`).join('\n\n');
  }

  // ── Events ───────────────────────────────────────────────
  function init() {
    initTimezones();
    initPlaceSearch();

    $('time-unknown').addEventListener('change', (e) => ($('time').disabled = e.target.checked));

    $('birth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = readForm();
      $('form-error').hidden = !p.error;
      if (p.error) { $('form-error').textContent = p.error; return; }
      run(p, { scroll: true });
    });

    // Diet and servings update the plan live once there's a chart.
    for (const id of ['gf', 'df', 'servings']) {
      $(id).addEventListener('change', () => {
        if (!state.chart) return;
        Object.assign(state.profile, { gf: $('gf').checked, df: $('df').checked, servings: +$('servings').value });
        store.set(PROFILE_KEY, state.profile);
        id === 'servings' ? renderList() : replan();
      });
    }

    $('reshuffle').addEventListener('click', () => {
      state.profile.seed += 1;
      replan();
    });

    $('days').addEventListener('click', (e) => {
      const btn = e.target.closest('.meal[data-day]');
      if (btn) openRecipe(+btn.dataset.day, btn.dataset.meal);
    });
    $('recipe-dialog').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

    $('list').addEventListener('change', (e) => {
      if (!e.target.dataset.key) return;
      const checked = new Set(store.get(listKey()) || []);
      e.target.checked ? checked.add(e.target.dataset.key) : checked.delete(e.target.dataset.key);
      e.target.closest('.item').classList.toggle('done', e.target.checked);
      store.set(listKey(), [...checked]);
    });

    $('copy-list').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(state.listText);
        $('copy-list').textContent = 'Copied ✓';
      } catch {
        $('copy-list').textContent = 'Copy failed';
      }
      setTimeout(() => ($('copy-list').textContent = 'Copy'), 1600);
    });
    $('print-list').addEventListener('click', () => window.print());

    const saved = store.get(PROFILE_KEY);
    if (saved && saved.date && saved.place) {
      fillForm(saved);
      try { run(saved); } catch { /* bad saved data: leave the form for the user */ }
    }
  }

  init();
})();
