const test = require('node:test');
const assert = require('node:assert');
const A = require('astronomy-engine');
const Astro = require('../src/astro.js');
const Planner = require('../src/planner.js');
const RECIPES = require('../src/recipes.js');

const J2000 = new Date(Date.UTC(2000, 0, 1, 12));
const NYC = [40.7128, -74.006];

test('planet positions match J2000 reference values', () => {
  const c = Astro.computeChart(J2000, ...NYC);
  const lon = Object.fromEntries(c.planets.map((p) => [p.name, p.lon]));
  // Reference: Sun 280.4°, Moon ~223.3°, Jupiter ~25.2° Aries, Saturn ~40.4° (retrograde)
  assert.ok(Math.abs(lon.Sun - 280.37) < 0.2, `Sun ${lon.Sun}`);
  assert.ok(Math.abs(lon.Moon - 223.32) < 0.5, `Moon ${lon.Moon}`);
  assert.strictEqual(c.planets.find((p) => p.name === 'Jupiter').sign.name, 'Aries');
  assert.ok(c.planets.find((p) => p.name === 'Saturn').retrograde);
});

test('Ascendant lies on the eastern horizon across latitudes', () => {
  for (const [lat, lon] of [NYC, [51.5, -0.12], [-33.9, 151.2], [0, 0], [64.1, -21.9]]) {
    for (let h = 0; h < 24; h += 5) {
      const d = new Date(Date.UTC(1993, 5, 12, h, 17));
      const { asc } = Astro.angles(d, lat, lon);
      const eps = (Astro.obliquity(d) * Math.PI) / 180;
      const L = (asc * Math.PI) / 180;
      const ra = ((Math.atan2(Math.sin(L) * Math.cos(eps), Math.cos(L)) * 12) / Math.PI + 24) % 24;
      const dec = (Math.asin(Math.sin(eps) * Math.sin(L)) * 180) / Math.PI;
      const hor = A.Horizon(A.MakeTime(d), new A.Observer(lat, lon, 0), ra, dec);
      assert.ok(Math.abs(hor.altitude) < 0.05, `alt ${hor.altitude} at ${lat},${lon} ${h}h`);
      assert.ok(hor.azimuth > 0 && hor.azimuth < 180, `az ${hor.azimuth} should be east`);
    }
  }
});

test('local time converts to UTC with DST', () => {
  assert.strictEqual(Astro.localToUtc(1990, 7, 15, 14, 30, 'America/New_York').toISOString(), '1990-07-15T18:30:00.000Z');
  assert.strictEqual(Astro.localToUtc(1990, 1, 15, 14, 30, 'America/New_York').toISOString(), '1990-01-15T19:30:00.000Z');
  assert.strictEqual(Astro.localToUtc(1985, 3, 2, 8, 0, 'Asia/Kolkata').toISOString(), '1985-03-02T02:30:00.000Z');
});

test('whole-sign houses start at the Ascendant sign', () => {
  const c = Astro.computeChart(J2000, ...NYC);
  assert.strictEqual(c.houses[0].sign.name, c.asc.sign.name);
  const sun = c.planets.find((p) => p.name === 'Sun');
  assert.strictEqual(sun.house, ((sun.sign.index - c.asc.sign.index + 12) % 12) + 1);
});

test('unknown birth time skips angles and houses but still plans', () => {
  const c = Astro.computeChart(J2000, ...NYC, false);
  assert.strictEqual(c.asc, null);
  assert.strictEqual(c.houses, null);
  const days = Planner.planWeek(c, { startDate: new Date(2026, 10, 2) });
  assert.strictEqual(days.length, 7);
  assert.ok(days.every((d) => Planner.MEALS.every((m) => d.meals[m])));
});

function allMeals(days) {
  return days.flatMap((d) => Planner.MEALS.map((m) => d.meals[m]));
}

test('plans 21 unique meals in the right slots', () => {
  const c = Astro.computeChart(J2000, ...NYC);
  const days = Planner.planWeek(c, { startDate: new Date(2026, 10, 2), seed: 'a' });
  const meals = allMeals(days);
  assert.strictEqual(meals.length, 21);
  assert.strictEqual(new Set(meals.map((m) => m.recipe.id)).size, 21);
  for (const d of days) for (const m of Planner.MEALS) assert.strictEqual(d.meals[m].recipe.meal, m);
  assert.ok(meals.every((m) => m.reason.length > 20));
  assert.strictEqual(days[0].name, 'Monday');
  assert.strictEqual(days[0].ruler, 'Moon');
});

test('gluten-free and dairy-free filters are respected', () => {
  const c = Astro.computeChart(J2000, ...NYC);
  const diet = { glutenFree: true, dairyFree: true };
  for (const seed of ['x', 'y', 'z']) {
    const days = Planner.planWeek(c, { diet, seed, startDate: new Date(2026, 10, 2) });
    const meals = allMeals(days);
    assert.strictEqual(meals.length, 21);
    for (const m of meals) {
      const src = RECIPES.find((r) => r.id === m.recipe.id);
      for (const [, , name, , opts = {}] of src.ing) {
        if (opts.g || opts.d) assert.ok(!m.recipe.ing.some((x) => x.name === name), `${name} left in ${src.id}`);
      }
      for (const x of m.recipe.ing) {
        if (/bread|flour|pasta|spaghetti|soy sauce/i.test(x.name)) assert.ok(/gluten-free|buckwheat|rice flour|almond flour/i.test(x.name), `${x.name} in ${src.id}`);
      }
    }
  }
});

test('different charts produce different plans; seeds reshuffle', () => {
  const a = Planner.planWeek(Astro.computeChart(J2000, ...NYC), { seed: 's', startDate: new Date(2026, 10, 2) });
  const b = Planner.planWeek(Astro.computeChart(new Date(Date.UTC(1988, 6, 20, 3)), -33.9, 151.2), { seed: 's', startDate: new Date(2026, 10, 2) });
  const c = Planner.planWeek(Astro.computeChart(J2000, ...NYC), { seed: 't', startDate: new Date(2026, 10, 2) });
  const ids = (d) => allMeals(d).map((m) => m.recipe.id).join();
  assert.notStrictEqual(ids(a), ids(b));
  assert.notStrictEqual(ids(a), ids(c));
});

test('shopping list merges and scales quantities', () => {
  const c = Astro.computeChart(J2000, ...NYC);
  const days = Planner.planWeek(c, { seed: 'q', startDate: new Date(2026, 10, 2) });
  const two = Planner.shoppingList(days, 2).flatMap((g) => g.items);
  const four = Planner.shoppingList(days, 4).flatMap((g) => g.items);
  const keys = two.map((i) => `${i.name}|${i.unit}`);
  assert.strictEqual(new Set(keys).size, keys.length, 'no duplicate lines');
  const expectedEggs = allMeals(days).flatMap((m) => m.recipe.ing).filter((x) => x.name === 'eggs').reduce((s, x) => s + x.qty, 0);
  const eggs = two.find((i) => i.name === 'eggs');
  assert.strictEqual(eggs ? eggs.qty : 0, expectedEggs);
  const anyItem = two.find((i) => i.qty > 0);
  assert.strictEqual(four.find((i) => i.name === anyItem.name && i.unit === anyItem.unit).qty, anyItem.qty * 2);
  assert.ok(!two.some((i) => i.name === 'cooked rice'), 'cooked rice converted to dry');
});

test('quantity formatting', () => {
  assert.strictEqual(Planner.formatQty(1.5, 'cup'), '1½ cups');
  assert.strictEqual(Planner.formatQty(0.333, 'cup'), '⅓ cup');
  assert.strictEqual(Planner.formatQty(2.5, ''), '3');
  assert.strictEqual(Planner.formatQty(5, 'clove'), '5 cloves');
  assert.strictEqual(Planner.formatQty(12, 'oz'), '12 oz');
});

test('every recipe is well-formed', () => {
  const ids = new Set();
  const aisles = new Set(['produce', 'protein', 'dairy', 'bakery', 'pantry', 'spices', 'frozen']);
  const signs = new Set(Astro.SIGNS.map((s) => s.name));
  const planets = new Set(Astro.PLANETS.map((p) => p.name));
  for (const r of RECIPES) {
    assert.ok(!ids.has(r.id), `duplicate id ${r.id}`);
    ids.add(r.id);
    assert.ok(Planner.MEALS.includes(r.meal), r.id);
    assert.ok(r.signs.every((s) => signs.has(s)), r.id);
    assert.ok(r.pl.every((p) => planets.has(p)), r.id);
    assert.ok(r.ing.every(([q, , n, a]) => q > 0 && n && aisles.has(a)), r.id);
    assert.ok(r.steps.length && r.note);
  }
});
