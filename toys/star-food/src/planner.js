// Turns a natal chart into a 21-meal week plan and a merged shopping list.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./astro.js'), require('./recipes.js'));
  else root.Planner = factory(root.Astro, root.RECIPES);
})(typeof self !== 'undefined' ? self : this, function (Astro, RECIPES) {
  const BASE_SERVINGS = 2;
  const MEALS = ['breakfast', 'lunch', 'dinner'];
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAY_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const AISLES = [
    ['produce', 'Produce'], ['protein', 'Meat & Seafood'], ['dairy', 'Dairy, Eggs & Milks'], ['bakery', 'Bakery & Tortillas'],
    ['pantry', 'Pantry'], ['spices', 'Spices'], ['frozen', 'Frozen'], ['staples', 'Staples (check you have)'],
  ];
  const STAPLES = new Set(['olive oil', 'salt', 'black pepper']);
  // Ingredients bought in a different form than the recipe lists them.
  const BUY_AS = {
    'cooked rice': ['jasmine rice', 'cup', 1 / 3],
    rice: ['jasmine rice', 'cup', 1],
    'shredded red cabbage': ['red cabbage', 'head', 0.25],
    'chicken broth': ['chicken broth (32 oz)', 'carton', 0.25],
    'vegetable broth': ['vegetable broth (32 oz)', 'carton', 0.25],
    'beef broth': ['beef broth (32 oz)', 'carton', 0.25],
  };
  // Merge units that measure the same thing.
  const CANONICAL_UNIT = { lb: ['oz', 16] };

  function seededRandom(seed) {
    let h = 1779033703 ^ String(seed).length;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 3432918353), h = (h << 13) | (h >>> 19);
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  const ordinal = (n) => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');

  // Apply diet swaps. Returns null when a recipe can't be made under the filters.
  function adaptRecipe(recipe, diet = {}) {
    const ing = [];
    for (const [q, u, n, a, opts = {}] of recipe.ing) {
      let name = n;
      let swapped = false;
      for (const key of ['g', 'd']) {
        const active = key === 'g' ? diet.glutenFree : diet.dairyFree;
        if (!active || !opts[key]) continue;
        if (opts[key] === true) return null;
        name = opts[key];
        swapped = true;
      }
      ing.push({ qty: q, unit: u, name, aisle: aisleFor(name, a, swapped), swapped });
    }
    return { ...recipe, ing };
  }

  function aisleFor(name, aisle, swapped) {
    if (!swapped) return aisle;
    if (/oil|tahini|nutritional yeast|seeds|pepitas|walnuts|breadcrumbs|artichoke|cornstarch|pasta|spaghetti|noodles|rice|quinoa|tamari|soba|gnocchi|crackers|oats|granola/i.test(name)) return 'pantry';
    if (/bread|bagel|muffin|baguette|wraps/i.test(name)) return 'bakery';
    if (/avocado/i.test(name)) return 'produce';
    return 'dairy';
  }

  function placement(chart, planetName) {
    return chart.planets.find((p) => p.name === planetName);
  }

  // The chart factors that steer one meal slot.
  function influencesFor(chart, meal, date, transitMoon) {
    const inf = [];
    const add = (label, sign, weight, planet, house) =>
      inf.push({ label, sign, weight, planet, house, verb: planet || label.includes('Moon') ? 'is in' : label.includes('house') ? 'falls in' : 'is' });
    const p = (name) => placement(chart, name);
    const houseSign = (n) => (chart.houses ? chart.houses[n - 1].sign : null);

    if (meal === 'breakfast') {
      if (chart.asc) {
        add('your Rising sign', chart.asc.sign, 3);
        const ruler = p(chart.asc.sign.ruler);
        add(`your chart ruler ${ruler.name}`, ruler.sign, 1.5, ruler.name, ruler.house);
      } else {
        add('your Sun', p('Sun').sign, 2, 'Sun');
      }
      add('your Mars (morning drive)', p('Mars').sign, 1, 'Mars', p('Mars').house);
    } else if (meal === 'lunch') {
      add('your Sun', p('Sun').sign, 3, 'Sun', p('Sun').house);
      add('your Mercury', p('Mercury').sign, 2, 'Mercury', p('Mercury').house);
      if (chart.houses) add('your 6th house of daily health', houseSign(6), 1.25);
    } else {
      const rulerName = DAY_RULERS[date.getDay()];
      const ruler = p(rulerName);
      add(`${DAY_NAMES[date.getDay()]}'s ruler ${rulerName}`, ruler.sign, 3, rulerName, ruler.house);
      add('your Venus (taste & pleasure)', p('Venus').sign, 1.5, 'Venus', p('Venus').house);
      if (chart.houses) add('your 4th house of home', houseSign(4), 1.25);
    }
    add('your Moon (appetite & comfort)', p('Moon').sign, 2, 'Moon', p('Moon').house);
    if (chart.houses && meal !== 'lunch') add('your 2nd house of the senses', houseSign(2), 0.75);
    add("today's transiting Moon", transitMoon, 0.75);
    return inf;
  }

  function scoreRecipe(recipe, influences, chart) {
    let score = 0;
    const hits = [];
    for (const inf of influences) {
      let s = 0;
      let kind = null;
      if (recipe.signs.includes(inf.sign.name)) (s += 3 * inf.weight), (kind = 'sign');
      else if (recipe.el.includes(inf.sign.element)) (s += 1.5 * inf.weight), (kind = 'element');
      if (inf.planet && recipe.pl.includes(inf.planet)) (s += 1.5 * inf.weight), (kind = kind ? kind + '+planet' : 'planet');
      if (s) hits.push({ inf, s, kind });
      score += s;
    }
    const total = Object.values(chart.elements).reduce((a, b) => a + b, 0) || 1;
    for (const el of recipe.el) score += (chart.elements[el] / total) * 4;
    hits.sort((a, b) => b.s - a.s);
    return { score, hits };
  }

  const the = (planet) => (planet === 'Sun' || planet === 'Moon' ? `the ${planet}` : planet);

  function explain(hits) {
    if (!hits.length) return 'A balancing dish to round out the week.';
    const { inf, kind } = hits[0];
    const where = inf.house ? ` (${ordinal(inf.house)} house)` : '';
    const subject = `${inf.label[0].toUpperCase()}${inf.label.slice(1)} ${inf.verb} ${inf.sign.name}${where}.`;
    let why;
    if (kind.startsWith('sign')) why = `This dish is pure ${inf.sign.name}`;
    else if (kind.startsWith('element')) why = `This ${inf.sign.element} dish matches that element`;
    else why = `This is a dish ruled by ${the(inf.planet)}`;
    if (kind.endsWith('+planet')) why += `, and ${the(inf.planet)} rules it too`;
    const next = hits.find((h) => h.inf.label !== inf.label && (!h.inf.planet || h.inf.planet !== inf.planet));
    const second = next ? ` It also suits ${next.inf.label} in ${next.inf.sign.name}.` : '';
    return `${subject} ${why}.${second}`;
  }

  // chart: from Astro.computeChart. opts: { diet, startDate, seed }
  function planWeek(chart, opts = {}) {
    const rand = seededRandom(opts.seed ?? 'star-food');
    const start = new Date(opts.startDate || Date.now());
    start.setHours(12, 0, 0, 0);
    const moons = Astro.weekMoons(start);
    const pool = RECIPES.map((r) => adaptRecipe(r, opts.diet)).filter(Boolean);
    const used = new Set();
    const bought = new Set();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = moons[i].date;
      const day = { date, name: DAY_NAMES[date.getDay()], ruler: DAY_RULERS[date.getDay()], transitMoon: moons[i].sign, meals: {} };
      for (const meal of MEALS) {
        const influences = influencesFor(chart, meal, date, moons[i].sign);
        const candidates = pool.filter((r) => r.meal === meal && !used.has(r.id));
        if (!candidates.length) { day.meals[meal] = null; continue; }
        const ranked = candidates.map((r) => {
          const { score, hits } = scoreRecipe(r, influences, chart);
          const overlap = r.ing.filter((x) => !STAPLES.has(x.name) && bought.has(x.name)).length;
          return { r, hits, total: score + overlap * 0.6 + rand() * 3 };
        }).sort((a, b) => b.total - a.total);
        const pick = ranked[0];
        used.add(pick.r.id);
        pick.r.ing.forEach((x) => bought.add(x.name));
        day.meals[meal] = { recipe: pick.r, reason: explain(pick.hits) };
      }
      days.push(day);
    }
    return days;
  }

  function shoppingList(days, servings = BASE_SERVINGS) {
    const scale = servings / BASE_SERVINGS;
    const items = new Map();
    for (const day of days) {
      for (const meal of MEALS) {
        const m = day.meals[meal];
        if (!m) continue;
        for (const x of m.recipe.ing) {
          let { name, unit, qty, aisle } = x;
          if (BUY_AS[name]) {
            const [n, u, f] = BUY_AS[name];
            name = n; unit = u; qty = qty * f; aisle = 'pantry';
          }
          if (CANONICAL_UNIT[unit]) [unit, qty] = [CANONICAL_UNIT[unit][0], qty * CANONICAL_UNIT[unit][1]];
          if (STAPLES.has(name)) aisle = 'staples';
          const key = `${name}|${unit}`;
          const cur = items.get(key) || { name, unit, qty: 0, aisle, uses: [] };
          cur.qty += qty * scale;
          if (!cur.uses.includes(m.recipe.name)) cur.uses.push(m.recipe.name);
          items.set(key, cur);
        }
      }
    }
    const groups = AISLES.map(([id, label]) => ({
      id, label,
      items: [...items.values()].filter((i) => i.aisle === id).sort((a, b) => a.name.localeCompare(b.name)),
    })).filter((g) => g.items.length);
    const staples = groups.find((g) => g.id === 'staples');
    if (staples) {
      for (const n of ['salt', 'black pepper']) staples.items.push({ name: n, unit: '', qty: 0, aisle: 'staples', uses: [] });
    } else {
      groups.push({ id: 'staples', label: 'Staples (check you have)', items: ['salt', 'black pepper'].map((n) => ({ name: n, unit: '', qty: 0, aisle: 'staples', uses: [] })) });
    }
    return groups;
  }

  const FRACTIONS = [[0, ''], [0.125, '⅛'], [0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.667, '⅔'], [0.75, '¾'], [1, '']];

  function formatQty(qty, unit) {
    if (!qty) return '';
    if (unit === 'oz' && qty >= 16) return formatQty(qty / 16, 'lb');
    if (unit === 'tsp' && qty >= 6) return formatQty(qty / 3, 'tbsp');
    if (unit === 'tbsp' && qty >= 8) return formatQty(qty / 16, 'cup');
    if (!unit || unit === 'clove' || unit === 'slice' || unit === 'can' || unit === 'sheet' || unit === 'stalk' || unit === 'carton') {
      const n = unit === 'clove' || unit === 'slice' ? Math.ceil(qty) : Math.ceil(qty - 0.01);
      return unit ? `${n} ${unit}${n === 1 ? '' : 's'}` : String(n);
    }
    let whole = Math.floor(qty);
    const frac = qty - whole;
    let best = FRACTIONS[0];
    for (const f of FRACTIONS) if (Math.abs(f[0] - frac) < Math.abs(best[0] - frac)) best = f;
    if (best[0] === 1) whole += 1;
    const num = `${whole || ''}${best[1]}` || '¼';
    const plural = qty > 1 && ['cup', 'lb', 'bunch', 'head'].includes(unit) ? (unit === 'bunch' ? 'bunches' : unit + 's') : unit;
    return `${num} ${plural}`;
  }

  return { planWeek, shoppingList, formatQty, adaptRecipe, influencesFor, scoreRecipe, MEALS, DAY_RULERS, BASE_SERVINGS, seededRandom };
});
