// Natal chart math: planet longitudes, Ascendant/MC, whole-sign houses.
// Works in the browser (window.Astro) and in Node (module.exports) for tests.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('astronomy-engine'));
  } else {
    root.Astro = factory(root.Astronomy);
  }
})(typeof self !== 'undefined' ? self : this, function (A) {
  const SIGNS = [
    { name: 'Aries', glyph: '♈', element: 'fire', mode: 'cardinal', ruler: 'Mars' },
    { name: 'Taurus', glyph: '♉', element: 'earth', mode: 'fixed', ruler: 'Venus' },
    { name: 'Gemini', glyph: '♊', element: 'air', mode: 'mutable', ruler: 'Mercury' },
    { name: 'Cancer', glyph: '♋', element: 'water', mode: 'cardinal', ruler: 'Moon' },
    { name: 'Leo', glyph: '♌', element: 'fire', mode: 'fixed', ruler: 'Sun' },
    { name: 'Virgo', glyph: '♍', element: 'earth', mode: 'mutable', ruler: 'Mercury' },
    { name: 'Libra', glyph: '♎', element: 'air', mode: 'cardinal', ruler: 'Venus' },
    { name: 'Scorpio', glyph: '♏', element: 'water', mode: 'fixed', ruler: 'Mars' },
    { name: 'Sagittarius', glyph: '♐', element: 'fire', mode: 'mutable', ruler: 'Jupiter' },
    { name: 'Capricorn', glyph: '♑', element: 'earth', mode: 'cardinal', ruler: 'Saturn' },
    { name: 'Aquarius', glyph: '♒', element: 'air', mode: 'fixed', ruler: 'Saturn' },
    { name: 'Pisces', glyph: '♓', element: 'water', mode: 'mutable', ruler: 'Jupiter' },
  ];

  const PLANETS = [
    { name: 'Sun', glyph: '☉' },
    { name: 'Moon', glyph: '☽' },
    { name: 'Mercury', glyph: '☿' },
    { name: 'Venus', glyph: '♀' },
    { name: 'Mars', glyph: '♂' },
    { name: 'Jupiter', glyph: '♃' },
    { name: 'Saturn', glyph: '♄' },
    { name: 'Uranus', glyph: '♅' },
    { name: 'Neptune', glyph: '♆' },
    { name: 'Pluto', glyph: '♇' },
  ];

  const norm = (d) => ((d % 360) + 360) % 360;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;

  function signOf(lon) {
    const i = Math.floor(norm(lon) / 30);
    return { index: i, ...SIGNS[i], degree: norm(lon) - i * 30 };
  }

  function formatDegree(lon) {
    const s = signOf(lon);
    const d = Math.floor(s.degree);
    const m = Math.floor((s.degree - d) * 60);
    return `${d}°${String(m).padStart(2, '0')}′ ${s.name}`;
  }

  // Offset (ms) of an IANA zone from UTC at a given UTC instant.
  function zoneOffsetMs(utcMs, timeZone) {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const p = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return asUtc - Math.floor(utcMs / 1000) * 1000;
  }

  // Convert a wall-clock time in an IANA zone to a UTC Date (handles DST).
  function localToUtc(year, month, day, hour, minute, timeZone) {
    const wall = Date.UTC(year, month - 1, day, hour, minute);
    let utc = wall - zoneOffsetMs(wall, timeZone);
    utc = wall - zoneOffsetMs(utc, timeZone);
    return new Date(utc);
  }

  function planetLongitude(name, date) {
    if (name === 'Moon') return norm(A.EclipticGeoMoon(date).lon);
    return norm(A.Ecliptic(A.GeoVector(A.Body[name], date, true)).elon);
  }

  function obliquity(date) {
    const t = A.MakeTime(date).tt / 36525; // Julian centuries from J2000
    return 23.4392911 - 0.0130042 * t - 1.64e-7 * t * t + 5.04e-7 * t * t * t;
  }

  // Ascendant and Midheaven from local sidereal time and latitude.
  function angles(date, lat, lon) {
    const ramc = rad(norm(A.SiderealTime(date) * 15 + lon));
    const eps = rad(obliquity(date));
    const phi = rad(lat);
    const asc = norm(deg(Math.atan2(Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)))));
    const mc = norm(deg(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps))));
    return { asc, mc };
  }

  // date: UTC Date. lat/lon in degrees (east positive). timeKnown: false skips angles/houses.
  function computeChart(date, lat, lon, timeKnown = true) {
    const later = new Date(date.getTime() + 86400000);
    const ang = timeKnown ? angles(date, lat, lon) : null;
    const ascSign = ang ? signOf(ang.asc).index : null;

    const planets = PLANETS.map((p) => {
      const lonNow = planetLongitude(p.name, date);
      const delta = norm(planetLongitude(p.name, later) - lonNow + 180) - 180;
      const sign = signOf(lonNow);
      return {
        ...p,
        lon: lonNow,
        sign,
        retrograde: p.name !== 'Sun' && p.name !== 'Moon' && delta < 0,
        house: ascSign === null ? null : ((sign.index - ascSign + 12) % 12) + 1,
      };
    });

    const houses = ascSign === null ? null
      : Array.from({ length: 12 }, (_, i) => ({ number: i + 1, sign: SIGNS[(ascSign + i) % 12] }));

    const weights = { Sun: 3, Moon: 3, Mercury: 1.5, Venus: 2, Mars: 1.5, Jupiter: 1, Saturn: 1, Uranus: 0.5, Neptune: 0.5, Pluto: 0.5 };
    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    const modes = { cardinal: 0, fixed: 0, mutable: 0 };
    for (const p of planets) {
      elements[p.sign.element] += weights[p.name];
      modes[p.sign.mode] += weights[p.name];
    }
    if (ang) {
      const a = signOf(ang.asc);
      elements[a.element] += 2.5;
      modes[a.mode] += 2.5;
    }

    return {
      date, lat, lon, timeKnown, planets, houses,
      asc: ang ? { lon: ang.asc, sign: signOf(ang.asc) } : null,
      mc: ang ? { lon: ang.mc, sign: signOf(ang.mc) } : null,
      elements, modes,
    };
  }

  // Sign of the transiting Moon at local noon for each of the next 7 days.
  function weekMoons(startDate) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      d.setHours(12, 0, 0, 0);
      return { date: d, sign: signOf(planetLongitude('Moon', d)) };
    });
  }

  return { SIGNS, PLANETS, signOf, formatDegree, localToUtc, zoneOffsetMs, computeChart, weekMoons, angles, planetLongitude, obliquity };
});
