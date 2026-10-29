// Built-in recipe library. Every recipe serves 2; the planner scales quantities.
// Ingredient: [qty, unit, name, aisle, opts]
//   opts.g / opts.d: contains gluten / dairy. A string is the swap used under that
//   filter; `true` means no swap exists and the recipe is excluded under that filter.
// Tags: el (elements), pl (planets), signs. `note` is the recipe's astrological voice.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RECIPES = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const G = (swap) => ({ g: swap || true });
  const D = (swap) => ({ d: swap || true });

  return [
    // ───────────────────────── Breakfast ─────────────────────────
    {
      id: 'shakshuka', name: 'Fiery Shakshuka', meal: 'breakfast', time: 30,
      el: ['fire'], pl: ['Mars', 'Sun'], signs: ['Aries', 'Leo'],
      note: 'Eggs poached in a bubbling chili-tomato sauce: a Mars-red start that gets you moving.',
      ing: [
        [1, 'can', 'crushed tomatoes', 'pantry'], [1, '', 'red bell pepper', 'produce'], [1, '', 'yellow onion', 'produce'],
        [2, 'clove', 'garlic', 'produce'], [4, '', 'eggs', 'dairy'], [1, 'tsp', 'smoked paprika', 'spices'],
        [1, 'tsp', 'ground cumin', 'spices'], [0.5, 'tsp', 'chili flakes', 'spices'], [2, 'tbsp', 'olive oil', 'pantry'],
        [2, 'slice', 'crusty bread', 'bakery', G('gluten-free bread')],
      ],
      steps: ['Soften sliced onion and pepper in oil, 6 minutes.', 'Add garlic and spices, then tomatoes; simmer 10 minutes.', 'Make 4 wells, crack in eggs, cover until whites set.', 'Serve with toasted bread.'],
    },
    {
      id: 'golden-oats', name: 'Golden Saffron-Honey Oats', meal: 'breakfast', time: 15,
      el: ['fire'], pl: ['Sun', 'Jupiter'], signs: ['Leo', 'Sagittarius'],
      note: 'Sun-gold oats with turmeric, honey and orange. Breakfast that shines.',
      ing: [
        [1, 'cup', 'rolled oats', 'pantry', G('certified gluten-free oats')], [2, 'cup', 'milk', 'dairy', D('oat milk')],
        [0.5, 'tsp', 'ground turmeric', 'spices'], [0.5, 'tsp', 'ground cinnamon', 'spices'], [2, 'tbsp', 'honey', 'pantry'],
        [1, '', 'orange', 'produce'], [2, 'tbsp', 'sliced almonds', 'pantry'],
      ],
      steps: ['Simmer oats in milk with turmeric and cinnamon, 5 minutes.', 'Stir in honey and orange zest.', 'Top with orange segments and almonds.'],
    },
    {
      id: 'huevos', name: 'Huevos Rancheros', meal: 'breakfast', time: 25,
      el: ['fire', 'earth'], pl: ['Mars', 'Jupiter'], signs: ['Sagittarius', 'Aries'],
      note: 'A big, adventurous plate of beans, salsa and eggs for the Sagittarian appetite.',
      ing: [
        [4, '', 'corn tortillas', 'bakery'], [1, 'can', 'black beans', 'pantry'], [4, '', 'eggs', 'dairy'],
        [1, 'cup', 'salsa', 'pantry'], [1, '', 'avocado', 'produce'], [1, '', 'lime', 'produce'],
        [0.25, 'bunch', 'cilantro', 'produce'], [0.25, 'cup', 'crumbled feta', 'dairy', D('toasted pepitas')],
        [1, 'tsp', 'ground cumin', 'spices'],
      ],
      steps: ['Warm beans with cumin and a splash of water; mash lightly.', 'Fry eggs and warm tortillas.', 'Stack tortilla, beans, egg, salsa, avocado, feta and cilantro; squeeze lime.'],
    },
    {
      id: 'sweet-potato-hash', name: 'Sweet Potato & Sausage Hash', meal: 'breakfast', time: 30,
      el: ['earth', 'fire'], pl: ['Saturn', 'Mars'], signs: ['Capricorn', 'Aries'],
      note: 'Root vegetables and a hot skillet: grounded Saturn structure with a Mars kick.',
      ing: [
        [1, '', 'sweet potato', 'produce'], [8, 'oz', 'breakfast sausage', 'protein'], [1, '', 'red bell pepper', 'produce'],
        [1, '', 'yellow onion', 'produce'], [2, '', 'eggs', 'dairy'], [1, 'tsp', 'smoked paprika', 'spices'],
        [1, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Dice sweet potato small; cook in oil, covered, 10 minutes.', 'Add sausage, onion and pepper; brown well.', 'Season with paprika, fry eggs on top.'],
    },
    {
      id: 'avocado-toast', name: 'Herbed Avocado Toast', meal: 'breakfast', time: 10,
      el: ['earth', 'air'], pl: ['Venus', 'Mercury'], signs: ['Taurus', 'Virgo'],
      note: 'Simple, sensual and green: Venus in Taurus on a slice of bread.',
      ing: [
        [2, '', 'avocado', 'produce'], [4, 'slice', 'sourdough bread', 'bakery', G('gluten-free bread')], [1, '', 'lemon', 'produce'],
        [0.5, 'tsp', 'chili flakes', 'spices'], [0.25, 'bunch', 'fresh dill', 'produce'], [2, '', 'eggs', 'dairy'],
      ],
      steps: ['Toast the bread.', 'Mash avocado with lemon juice and salt.', 'Spread, top with soft-boiled egg, dill and chili flakes.'],
    },
    {
      id: 'veggie-frittata', name: 'Garden Frittata', meal: 'breakfast', time: 30,
      el: ['earth'], pl: ['Mercury', 'Saturn'], signs: ['Virgo', 'Capricorn'],
      note: 'Methodical, wholesome and portioned for the week. Virgo would approve of the leftovers.',
      ing: [
        [6, '', 'eggs', 'dairy'], [2, 'cup', 'baby spinach', 'produce'], [1, '', 'zucchini', 'produce'], [0.5, '', 'yellow onion', 'produce'],
        [0.25, 'cup', 'grated parmesan', 'dairy', D('nutritional yeast')], [0.25, 'cup', 'milk', 'dairy', D('oat milk')],
        [1, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Heat oven to 400°F.', 'Sauté onion and zucchini, wilt in spinach.', 'Whisk eggs, milk and parmesan; pour over, cook 3 minutes.', 'Bake 12 minutes until set.'],
    },
    {
      id: 'berry-yogurt', name: 'Rose & Berry Yogurt Bowl', meal: 'breakfast', time: 5,
      el: ['earth', 'water'], pl: ['Venus', 'Moon'], signs: ['Taurus', 'Libra'],
      note: 'Pretty, sweet and soothing. Venus loves something beautiful in a bowl.',
      ing: [
        [1.5, 'cup', 'Greek yogurt', 'dairy', D('coconut yogurt')], [1, 'cup', 'mixed berries', 'produce'],
        [0.5, 'cup', 'granola', 'pantry', G('gluten-free granola')], [1, 'tbsp', 'honey', 'pantry'], [2, 'tbsp', 'pistachios', 'pantry'],
      ],
      steps: ['Spoon yogurt into bowls.', 'Top with berries, granola, pistachios and a drizzle of honey.'],
    },
    {
      id: 'buckwheat-pancakes', name: 'Buckwheat Blueberry Pancakes', meal: 'breakfast', time: 25,
      el: ['earth', 'water'], pl: ['Saturn', 'Venus'], signs: ['Capricorn', 'Taurus'],
      note: 'Earthy buckwheat, a Saturnian grain, sweetened with Venusian berries.',
      ing: [
        [1, 'cup', 'buckwheat flour', 'pantry'], [1, '', 'eggs', 'dairy'], [1, 'cup', 'milk', 'dairy', D('oat milk')],
        [1, 'tsp', 'baking powder', 'pantry'], [1, 'cup', 'blueberries', 'produce'], [2, 'tbsp', 'maple syrup', 'pantry'],
        [1, 'tbsp', 'butter', 'dairy', D('coconut oil')],
      ],
      steps: ['Whisk flour, baking powder and a pinch of salt.', 'Add egg and milk; rest 5 minutes.', 'Cook in butter, scattering berries on each pancake.', 'Serve with maple syrup.'],
    },
    {
      id: 'smoothie', name: 'Electric Green Smoothie', meal: 'breakfast', time: 5,
      el: ['air'], pl: ['Uranus', 'Mercury'], signs: ['Aquarius', 'Gemini'],
      note: 'Fast, bright, a little unusual. Spirulina for the Aquarian experimenter.',
      ing: [
        [2, '', 'banana', 'produce'], [2, 'cup', 'baby spinach', 'produce'], [1, 'cup', 'frozen mango', 'frozen'],
        [1.5, 'cup', 'almond milk', 'dairy'], [1, 'tsp', 'spirulina powder', 'pantry'], [1, 'tbsp', 'chia seeds', 'pantry'],
        [1, 'tsp', 'grated ginger', 'produce'],
      ],
      steps: ['Blend everything until smooth.', 'Pour and drink while it still hums.'],
    },
    {
      id: 'chia-pudding', name: 'Overnight Chia & Mango Pudding', meal: 'breakfast', time: 5,
      el: ['air', 'water'], pl: ['Mercury', 'Neptune'], signs: ['Gemini', 'Aquarius'],
      note: 'Prep it at night and wake up to something done. A quick-witted Mercury fix.',
      ing: [
        [0.33, 'cup', 'chia seeds', 'pantry'], [1.5, 'cup', 'coconut milk', 'pantry'], [1, 'tbsp', 'maple syrup', 'pantry'],
        [1, 'cup', 'frozen mango', 'frozen'], [1, '', 'lime', 'produce'], [2, 'tbsp', 'toasted coconut flakes', 'pantry'],
      ],
      steps: ['Stir chia, coconut milk and maple syrup; refrigerate overnight.', 'Top with thawed mango, lime zest and coconut.'],
    },
    {
      id: 'croissant-sandwich', name: 'Egg & Herb Breakfast Sandwich', meal: 'breakfast', time: 15,
      el: ['air', 'fire'], pl: ['Mercury', 'Sun'], signs: ['Gemini', 'Libra'],
      note: 'Portable and chatty. Eat it on the way to your first conversation.',
      ing: [
        [2, '', 'English muffins', 'bakery', G('gluten-free English muffins')], [2, '', 'eggs', 'dairy'],
        [2, 'slice', 'cheddar', 'dairy', D('dairy-free cheese slices')], [1, 'cup', 'arugula', 'produce'],
        [0.25, 'bunch', 'chives', 'produce'], [1, 'tbsp', 'butter', 'dairy', D('olive oil')],
      ],
      steps: ['Toast muffins.', 'Scramble eggs softly in butter with chives.', 'Stack with cheese and arugula.'],
    },
    {
      id: 'congee', name: 'Ginger Chicken Congee', meal: 'breakfast', time: 45,
      el: ['water'], pl: ['Moon'], signs: ['Cancer', 'Pisces'],
      note: 'Soft, warm rice porridge: the most Lunar breakfast there is. Food that mothers you.',
      ing: [
        [0.5, 'cup', 'jasmine rice', 'pantry'], [4, 'cup', 'chicken broth', 'pantry'], [8, 'oz', 'chicken thighs', 'protein'],
        [1, 'tbsp', 'grated ginger', 'produce'], [3, '', 'scallions', 'produce'], [1, 'tbsp', 'soy sauce', 'pantry', G('tamari')],
        [1, 'tsp', 'sesame oil', 'pantry'],
      ],
      steps: ['Simmer rice, broth, ginger and chicken, stirring now and then, 40 minutes.', 'Shred chicken back in.', 'Finish with soy, sesame oil and scallions.'],
    },
    {
      id: 'smoked-salmon', name: 'Smoked Salmon & Cucumber Plate', meal: 'breakfast', time: 10,
      el: ['water'], pl: ['Neptune', 'Moon'], signs: ['Pisces', 'Cancer'],
      note: 'Cool cucumber and salmon from the sea: a Neptunian morning.',
      ing: [
        [4, 'oz', 'smoked salmon', 'protein'], [1, '', 'cucumber', 'produce'], [2, '', 'bagels', 'bakery', G('gluten-free bagels')],
        [3, 'tbsp', 'cream cheese', 'dairy', D('dairy-free cream cheese')], [1, 'tbsp', 'capers', 'pantry'],
        [0.25, '', 'red onion', 'produce'], [0.25, 'bunch', 'fresh dill', 'produce'],
      ],
      steps: ['Toast bagels and spread with cream cheese.', 'Layer salmon, sliced cucumber, onion, capers and dill.'],
    },
    {
      id: 'black-sesame', name: 'Black Sesame Porridge', meal: 'breakfast', time: 15,
      el: ['water', 'earth'], pl: ['Pluto', 'Saturn'], signs: ['Scorpio', 'Capricorn'],
      note: 'Dark, intense and nourishing. Scorpio wants depth even at breakfast.',
      ing: [
        [3, 'tbsp', 'black sesame seeds', 'pantry'], [1, 'cup', 'rolled oats', 'pantry', G('certified gluten-free oats')],
        [2, 'cup', 'oat milk', 'dairy'], [1, 'tbsp', 'maple syrup', 'pantry'], [1, '', 'pear', 'produce'],
      ],
      steps: ['Toast and grind sesame seeds.', 'Simmer oats in oat milk with the sesame, 5 minutes.', 'Sweeten with maple; top with sliced pear.'],
    },
    {
      id: 'kimchi-eggs', name: 'Kimchi Fried Rice & Egg', meal: 'breakfast', time: 15,
      el: ['water', 'fire'], pl: ['Pluto', 'Mars'], signs: ['Scorpio', 'Aries'],
      note: 'Fermented and fiery. Pluto transforms leftovers into something potent.',
      ing: [
        [2, 'cup', 'cooked rice', 'pantry'], [1, 'cup', 'kimchi', 'produce'], [2, '', 'eggs', 'dairy'], [3, '', 'scallions', 'produce'],
        [1, 'tbsp', 'gochujang', 'pantry', G(true)], [1, 'tsp', 'sesame oil', 'pantry'],
      ],
      steps: ['Fry kimchi in sesame oil 2 minutes.', 'Add rice and gochujang; press and crisp.', 'Top with fried eggs and scallions.'],
    },
    {
      id: 'fig-toast', name: 'Fig, Ricotta & Walnut Toast', meal: 'breakfast', time: 10,
      el: ['fire', 'earth'], pl: ['Jupiter', 'Venus'], signs: ['Sagittarius', 'Pisces'],
      note: 'Figs are Jupiter’s fruit: generous, sweet and a little luxurious.',
      ing: [
        [4, 'slice', 'sourdough bread', 'bakery', G('gluten-free bread')], [0.5, 'cup', 'ricotta', 'dairy', D('dairy-free ricotta')],
        [4, '', 'fresh figs', 'produce'], [2, 'tbsp', 'walnuts', 'pantry'], [1, 'tbsp', 'honey', 'pantry'],
      ],
      steps: ['Toast bread, spread with ricotta.', 'Top with sliced figs, walnuts and honey.'],
    },

    // ───────────────────────── Lunch ─────────────────────────
    {
      id: 'chorizo-bowl', name: 'Chorizo & Charred Corn Bowl', meal: 'lunch', time: 25,
      el: ['fire'], pl: ['Mars'], signs: ['Aries', 'Leo'],
      note: 'Smoky, spicy and quick. Midday heat for a Mars-ruled day.',
      ing: [
        [6, 'oz', 'chorizo', 'protein'], [1, 'cup', 'frozen corn', 'frozen'], [1, 'can', 'black beans', 'pantry'],
        [2, 'cup', 'cooked rice', 'pantry'], [1, '', 'lime', 'produce'], [1, '', 'avocado', 'produce'],
        [0.25, 'bunch', 'cilantro', 'produce'],
      ],
      steps: ['Brown chorizo; add corn and char.', 'Warm beans.', 'Build bowls over rice with avocado, cilantro and lime.'],
    },
    {
      id: 'citrus-quinoa', name: 'Sunburst Citrus Quinoa Salad', meal: 'lunch', time: 20,
      el: ['fire', 'air'], pl: ['Sun'], signs: ['Leo', 'Sagittarius'],
      note: 'Orange, turmeric and golden quinoa. A plate that looks like noon.',
      ing: [
        [1, 'cup', 'quinoa', 'pantry'], [2, '', 'orange', 'produce'], [1, 'can', 'chickpeas', 'pantry'],
        [0.5, 'tsp', 'ground turmeric', 'spices'], [2, 'cup', 'arugula', 'produce'], [2, 'tbsp', 'olive oil', 'pantry'],
        [2, 'tbsp', 'sliced almonds', 'pantry'], [1, 'tbsp', 'honey', 'pantry'],
      ],
      steps: ['Cook quinoa with turmeric; cool.', 'Whisk orange juice, oil and honey.', 'Toss with chickpeas, orange segments, arugula and almonds.'],
    },
    {
      id: 'tom-yum', name: 'Hot & Sour Shrimp Soup', meal: 'lunch', time: 25,
      el: ['fire', 'water'], pl: ['Mars', 'Neptune'], signs: ['Aries', 'Scorpio'],
      note: 'Chili heat meets the sea: Mars and Neptune in one bowl.',
      ing: [
        [8, 'oz', 'shrimp', 'protein'], [4, 'cup', 'chicken broth', 'pantry'], [1, 'stalk', 'lemongrass', 'produce'],
        [1, 'tbsp', 'grated ginger', 'produce'], [8, 'oz', 'mushrooms', 'produce'], [2, '', 'lime', 'produce'],
        [1, 'tbsp', 'fish sauce', 'pantry'], [1, 'tsp', 'chili flakes', 'spices'], [0.25, 'bunch', 'cilantro', 'produce'],
      ],
      steps: ['Simmer broth with bruised lemongrass and ginger 10 minutes.', 'Add mushrooms and shrimp, 3 minutes.', 'Season with fish sauce, lime and chili; top with cilantro.'],
    },
    {
      id: 'lentil-soup', name: 'Red Lentil & Carrot Soup', meal: 'lunch', time: 30,
      el: ['earth'], pl: ['Saturn'], signs: ['Capricorn', 'Virgo'],
      note: 'Humble, sturdy, cheap and deeply nourishing. Saturn’s kind of lunch.',
      ing: [
        [1, 'cup', 'red lentils', 'pantry'], [2, '', 'carrots', 'produce'], [1, '', 'yellow onion', 'produce'],
        [2, 'clove', 'garlic', 'produce'], [4, 'cup', 'vegetable broth', 'pantry'], [1, 'tsp', 'ground cumin', 'spices'],
        [1, '', 'lemon', 'produce'], [1, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Sauté onion, carrot and garlic in oil.', 'Add cumin, lentils and broth; simmer 20 minutes.', 'Blend partly; finish with lemon.'],
    },
    {
      id: 'grain-bowl', name: 'Roasted Root Grain Bowl', meal: 'lunch', time: 40,
      el: ['earth'], pl: ['Saturn', 'Venus'], signs: ['Taurus', 'Capricorn'],
      note: 'Roasted beets and farro with a tahini drizzle. Earthy comfort that keeps you going.',
      ing: [
        [1, 'cup', 'farro', 'pantry', G('brown rice')], [2, '', 'beets', 'produce'], [2, '', 'carrots', 'produce'],
        [2, 'cup', 'baby spinach', 'produce'], [2, 'tbsp', 'tahini', 'pantry'], [1, '', 'lemon', 'produce'],
        [2, 'tbsp', 'olive oil', 'pantry'], [0.25, 'cup', 'crumbled feta', 'dairy', D('toasted pumpkin seeds')],
      ],
      steps: ['Roast cubed beets and carrots at 425°F for 30 minutes.', 'Cook farro.', 'Whisk tahini, lemon and water.', 'Assemble over spinach with feta.'],
    },
    {
      id: 'caprese', name: 'Peach Caprese with Basil', meal: 'lunch', time: 10,
      el: ['earth', 'air'], pl: ['Venus'], signs: ['Taurus', 'Libra'],
      note: 'Pure Venus: ripe fruit, soft cheese, arranged beautifully.',
      ing: [
        [2, '', 'peaches', 'produce'], [2, '', 'tomatoes', 'produce'], [8, 'oz', 'fresh mozzarella', 'dairy', D(true)],
        [0.5, 'bunch', 'basil', 'produce'], [2, 'tbsp', 'olive oil', 'pantry'], [1, 'tbsp', 'balsamic vinegar', 'pantry'],
        [2, 'slice', 'crusty bread', 'bakery', G('gluten-free bread')],
      ],
      steps: ['Slice peaches, tomatoes and mozzarella.', 'Arrange, layering basil.', 'Drizzle with oil and balsamic; serve with bread.'],
    },
    {
      id: 'banh-mi', name: 'Lemongrass Chicken Lettuce Wraps', meal: 'lunch', time: 25,
      el: ['air'], pl: ['Mercury', 'Uranus'], signs: ['Gemini', 'Aquarius'],
      note: 'Crisp, varied, eaten with your hands, lots of little bites. Very Gemini.',
      ing: [
        [12, 'oz', 'ground chicken', 'protein'], [1, 'stalk', 'lemongrass', 'produce'], [1, 'head', 'butter lettuce', 'produce'],
        [2, '', 'carrots', 'produce'], [1, '', 'cucumber', 'produce'], [0.25, 'bunch', 'fresh mint', 'produce'],
        [1, 'tbsp', 'fish sauce', 'pantry'], [1, '', 'lime', 'produce'], [2, 'clove', 'garlic', 'produce'],
      ],
      steps: ['Brown chicken with minced lemongrass and garlic.', 'Season with fish sauce and lime.', 'Spoon into lettuce cups with shredded carrot, cucumber and mint.'],
    },
    {
      id: 'mezze', name: 'Mezze Board', meal: 'lunch', time: 15,
      el: ['air', 'earth'], pl: ['Mercury', 'Venus'], signs: ['Libra', 'Gemini'],
      note: 'A little of everything, shared and balanced. Libra’s ideal lunch.',
      ing: [
        [1, 'cup', 'hummus', 'pantry'], [2, '', 'pita breads', 'bakery', G('gluten-free crackers')], [1, '', 'cucumber', 'produce'],
        [1, 'cup', 'cherry tomatoes', 'produce'], [0.5, 'cup', 'kalamata olives', 'pantry'],
        [0.25, 'cup', 'crumbled feta', 'dairy', D('marinated artichokes')], [1, 'tsp', "za'atar", 'spices'], [1, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Swirl hummus with oil and za’atar.', 'Arrange everything else around it.', 'Warm the pita.'],
    },
    {
      id: 'soba', name: 'Cold Sesame Soba', meal: 'lunch', time: 20,
      el: ['air', 'water'], pl: ['Mercury', 'Neptune'], signs: ['Aquarius', 'Pisces'],
      note: 'Cool, light, a bit cerebral. Noodles for the Aquarian mind.',
      ing: [
        [6, 'oz', 'soba noodles', 'pantry', G('100% buckwheat soba')], [2, 'tbsp', 'tahini', 'pantry'],
        [2, 'tbsp', 'soy sauce', 'pantry', G('tamari')], [1, 'tbsp', 'rice vinegar', 'pantry'], [1, '', 'cucumber', 'produce'],
        [1, 'cup', 'frozen edamame', 'frozen'], [3, '', 'scallions', 'produce'], [1, 'tsp', 'sesame oil', 'pantry'],
      ],
      steps: ['Cook soba; rinse cold.', 'Whisk tahini, soy, vinegar and sesame oil.', 'Toss with cucumber, edamame and scallions.'],
    },
    {
      id: 'chicken-soup', name: 'Lemony Chicken & Orzo Soup', meal: 'lunch', time: 35,
      el: ['water'], pl: ['Moon'], signs: ['Cancer'],
      note: 'The soup someone makes you when you are sad. The Moon rules it.',
      ing: [
        [8, 'oz', 'chicken thighs', 'protein'], [0.5, 'cup', 'orzo', 'pantry', G('rice')], [4, 'cup', 'chicken broth', 'pantry'],
        [2, '', 'carrots', 'produce'], [2, 'stalk', 'celery', 'produce'], [1, '', 'lemon', 'produce'],
        [0.25, 'bunch', 'fresh dill', 'produce'],
      ],
      steps: ['Simmer chicken, carrot and celery in broth 20 minutes.', 'Shred chicken; add orzo and cook 8 minutes.', 'Finish with lemon and dill.'],
    },
    {
      id: 'poke', name: 'Salmon Poke Bowl', meal: 'lunch', time: 20,
      el: ['water'], pl: ['Neptune', 'Moon'], signs: ['Pisces', 'Cancer'],
      note: 'Raw fish, seaweed and rice. Neptune pulls you out to sea at lunchtime.',
      ing: [
        [8, 'oz', 'sushi-grade salmon', 'protein'], [2, 'cup', 'cooked rice', 'pantry'], [1, '', 'avocado', 'produce'],
        [1, '', 'cucumber', 'produce'], [2, 'tbsp', 'soy sauce', 'pantry', G('tamari')], [1, 'tsp', 'sesame oil', 'pantry'],
        [2, 'sheet', 'nori', 'pantry'], [1, 'tsp', 'sesame seeds', 'pantry'],
      ],
      steps: ['Cube salmon; toss with soy and sesame oil.', 'Build bowls over rice with avocado and cucumber.', 'Top with torn nori and sesame.'],
    },
    {
      id: 'beet-borscht', name: 'Deep Ruby Borscht', meal: 'lunch', time: 45,
      el: ['water', 'earth'], pl: ['Pluto'], signs: ['Scorpio'],
      note: 'Blood-red, earthy, and better the next day. A Plutonian soup.',
      ing: [
        [3, '', 'beets', 'produce'], [0.25, 'head', 'red cabbage', 'produce'], [1, '', 'yellow onion', 'produce'], [2, '', 'carrots', 'produce'],
        [4, 'cup', 'vegetable broth', 'pantry'], [1, 'tbsp', 'apple cider vinegar', 'pantry'],
        [0.25, 'cup', 'sour cream', 'dairy', D('coconut yogurt')], [0.25, 'bunch', 'fresh dill', 'produce'],
      ],
      steps: ['Sauté onion and carrot.', 'Add grated beets, cabbage and broth; simmer 30 minutes.', 'Add vinegar; serve with sour cream and dill.'],
    },
    {
      id: 'greek-salad', name: 'Big Greek Salad with Chickpeas', meal: 'lunch', time: 15,
      el: ['fire', 'earth'], pl: ['Jupiter'], signs: ['Sagittarius', 'Pisces'],
      note: 'Olives and abundance: Jupiter’s generous Mediterranean table.',
      ing: [
        [2, '', 'tomatoes', 'produce'], [1, '', 'cucumber', 'produce'], [0.5, '', 'red onion', 'produce'],
        [0.5, 'cup', 'kalamata olives', 'pantry'], [1, 'can', 'chickpeas', 'pantry'], [4, 'oz', 'feta', 'dairy', D('marinated artichokes')],
        [3, 'tbsp', 'olive oil', 'pantry'], [1, 'tsp', 'dried oregano', 'spices'],
      ],
      steps: ['Chop vegetables into big chunks.', 'Toss with chickpeas, olives, oil and oregano.', 'Top with a slab of feta.'],
    },
    {
      id: 'mushroom-toast', name: 'Garlicky Mushroom Toast', meal: 'lunch', time: 15,
      el: ['earth', 'water'], pl: ['Saturn', 'Pluto'], signs: ['Capricorn', 'Scorpio'],
      note: 'Mushrooms grow in the dark. Saturn and Pluto like that about them.',
      ing: [
        [12, 'oz', 'mushrooms', 'produce'], [3, 'clove', 'garlic', 'produce'], [4, 'slice', 'sourdough bread', 'bakery', G('gluten-free bread')],
        [1, 'tbsp', 'butter', 'dairy', D('olive oil')], [0.25, 'bunch', 'fresh thyme', 'produce'], [2, 'cup', 'arugula', 'produce'],
      ],
      steps: ['Sear mushrooms hard in butter.', 'Add garlic and thyme for 1 minute.', 'Pile on toast with arugula.'],
    },
    {
      id: 'curried-egg', name: 'Curried Egg Salad Lettuce Cups', meal: 'lunch', time: 15,
      el: ['air', 'earth'], pl: ['Mercury'], signs: ['Virgo', 'Gemini'],
      note: 'Tidy, efficient and a bit clever. A Virgo lunch box.',
      ing: [
        [5, '', 'eggs', 'dairy'], [3, 'tbsp', 'mayonnaise', 'pantry'], [1, 'tsp', 'curry powder', 'spices'], [2, 'stalk', 'celery', 'produce'],
        [1, 'head', 'butter lettuce', 'produce'], [0.25, 'bunch', 'chives', 'produce'],
      ],
      steps: ['Hard-boil eggs, 10 minutes; cool and chop.', 'Mix with mayo, curry and diced celery.', 'Spoon into lettuce and top with chives.'],
    },
    {
      id: 'tostadas', name: 'Smoky Black Bean Tostadas', meal: 'lunch', time: 20,
      el: ['fire', 'earth'], pl: ['Mars', 'Jupiter'], signs: ['Sagittarius', 'Aries'],
      note: 'Crunchy, loud, piled high. A lunch with a sense of adventure.',
      ing: [
        [4, '', 'corn tortillas', 'bakery'], [1, 'can', 'black beans', 'pantry'], [1, 'tsp', 'smoked paprika', 'spices'],
        [1, 'cup', 'shredded red cabbage', 'produce'], [1, '', 'avocado', 'produce'], [1, '', 'lime', 'produce'],
        [0.5, 'cup', 'salsa', 'pantry'], [1, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Brush tortillas with oil and bake at 400°F until crisp, 8 minutes.', 'Mash beans with paprika.', 'Top with beans, cabbage, avocado, salsa and lime.'],
    },
    {
      id: 'coconut-dal', name: 'Coconut Spinach Dal', meal: 'lunch', time: 30,
      el: ['water', 'fire'], pl: ['Moon', 'Sun'], signs: ['Cancer', 'Leo'],
      note: 'Golden, creamy and gentle. Comfort with a little sunshine in it.',
      ing: [
        [1, 'cup', 'red lentils', 'pantry'], [1, 'can', 'coconut milk', 'pantry'], [2, 'cup', 'baby spinach', 'produce'],
        [1, 'tsp', 'ground turmeric', 'spices'], [1, 'tbsp', 'grated ginger', 'produce'], [2, 'clove', 'garlic', 'produce'],
        [2, 'cup', 'cooked rice', 'pantry'],
      ],
      steps: ['Simmer lentils in coconut milk and 2 cups water with turmeric, ginger and garlic, 20 minutes.', 'Stir in spinach.', 'Serve over rice.'],
    },

    // ───────────────────────── Dinner ─────────────────────────
    {
      id: 'steak-chimichurri', name: 'Seared Steak with Chimichurri', meal: 'dinner', time: 30,
      el: ['fire'], pl: ['Mars'], signs: ['Aries', 'Scorpio'],
      note: 'Red meat, high heat, garlic and chili. As Mars as dinner gets.',
      ing: [
        [1, 'lb', 'flank steak', 'protein'], [1, 'bunch', 'parsley', 'produce'], [3, 'clove', 'garlic', 'produce'],
        [0.5, 'tsp', 'chili flakes', 'spices'], [2, 'tbsp', 'red wine vinegar', 'pantry'], [0.33, 'cup', 'olive oil', 'pantry'],
        [1, 'lb', 'baby potatoes', 'produce'],
      ],
      steps: ['Roast halved potatoes at 425°F for 25 minutes.', 'Blitz parsley, garlic, chili, vinegar and oil.', 'Sear steak 4 minutes per side; rest and slice thin.', 'Spoon chimichurri over everything.'],
    },
    {
      id: 'saffron-paella', name: 'Saffron Chicken Paella', meal: 'dinner', time: 45,
      el: ['fire'], pl: ['Sun', 'Jupiter'], signs: ['Leo', 'Sagittarius'],
      note: 'Saffron-gold rice in one generous pan. A royal, Leonine centerpiece.',
      ing: [
        [1, 'cup', 'arborio rice', 'pantry'], [12, 'oz', 'chicken thighs', 'protein'], [0.5, 'tsp', 'saffron threads', 'spices'],
        [1, 'tsp', 'smoked paprika', 'spices'], [1, '', 'red bell pepper', 'produce'], [1, '', 'yellow onion', 'produce'],
        [3, 'cup', 'chicken broth', 'pantry'], [1, 'cup', 'frozen peas', 'frozen'], [1, '', 'lemon', 'produce'], [2, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Brown chicken pieces; remove.', 'Soften onion and pepper; stir in rice, paprika and saffron.', 'Add broth and chicken; simmer undisturbed 20 minutes.', 'Scatter peas, rest 5 minutes, serve with lemon.'],
    },
    {
      id: 'jerk-chicken', name: 'Jerk Chicken with Mango Salsa', meal: 'dinner', time: 40,
      el: ['fire', 'water'], pl: ['Mars', 'Jupiter'], signs: ['Sagittarius', 'Aries'],
      note: 'Spicy and festive, with tropical fruit. Jupiter throws a party and Mars brings the heat.',
      ing: [
        [1, 'lb', 'chicken thighs', 'protein'], [2, 'tbsp', 'jerk seasoning', 'spices'], [1, '', 'mango', 'produce'],
        [0.5, '', 'red onion', 'produce'], [1, '', 'lime', 'produce'], [0.25, 'bunch', 'cilantro', 'produce'],
        [1, 'cup', 'jasmine rice', 'pantry'], [1, 'can', 'black beans', 'pantry'],
      ],
      steps: ['Rub chicken with jerk seasoning; roast at 425°F for 30 minutes.', 'Cook rice with drained beans.', 'Dice mango, onion and cilantro with lime.', 'Serve chicken over rice and peas with salsa.'],
    },
    {
      id: 'lamb-tagine', name: 'Lamb & Apricot Tagine', meal: 'dinner', time: 90,
      el: ['fire', 'earth'], pl: ['Mars', 'Saturn'], signs: ['Aries', 'Capricorn'],
      note: 'Slow and spiced, patient and rich. Mars is tempered by Saturn’s long simmer.',
      ing: [
        [1, 'lb', 'lamb shoulder', 'protein'], [0.5, 'cup', 'dried apricots', 'pantry'], [1, 'can', 'chickpeas', 'pantry'],
        [1, '', 'yellow onion', 'produce'], [2, 'tsp', 'ras el hanout', 'spices'], [1, 'tsp', 'ground cinnamon', 'spices'],
        [2, 'cup', 'chicken broth', 'pantry'], [1, 'cup', 'couscous', 'pantry', G('quinoa')], [0.25, 'bunch', 'cilantro', 'produce'],
      ],
      steps: ['Brown cubed lamb; add onion and spices.', 'Add broth, apricots and chickpeas; cover and simmer 75 minutes.', 'Prepare couscous.', 'Serve topped with cilantro.'],
    },
    {
      id: 'shepherds-pie', name: 'Mushroom & Lentil Shepherd’s Pie', meal: 'dinner', time: 60,
      el: ['earth'], pl: ['Saturn'], signs: ['Capricorn', 'Taurus'],
      note: 'Layered, hearty and built to last. Saturn’s comfort food.',
      ing: [
        [1, 'lb', 'russet potatoes', 'produce'], [1, 'cup', 'green lentils', 'pantry'], [8, 'oz', 'mushrooms', 'produce'],
        [2, '', 'carrots', 'produce'], [1, '', 'yellow onion', 'produce'], [2, 'cup', 'vegetable broth', 'pantry'],
        [1, 'tbsp', 'tomato paste', 'pantry'], [2, 'tbsp', 'butter', 'dairy', D('olive oil')], [0.25, 'bunch', 'fresh thyme', 'produce'],
      ],
      steps: ['Boil and mash potatoes with butter.', 'Simmer lentils, mushrooms, carrots, onion, tomato paste, thyme and broth 25 minutes.', 'Spread filling in a dish, top with mash.', 'Bake at 400°F until golden, 20 minutes.'],
    },
    {
      id: 'roast-chicken', name: 'Herb Roast Chicken & Root Vegetables', meal: 'dinner', time: 75,
      el: ['earth'], pl: ['Saturn', 'Venus'], signs: ['Taurus', 'Virgo'],
      note: 'Unhurried and reliably delicious. Taurus wants exactly this on a Sunday.',
      ing: [
        [2, 'lb', 'chicken thighs', 'protein'], [1, 'lb', 'baby potatoes', 'produce'], [3, '', 'carrots', 'produce'],
        [1, '', 'yellow onion', 'produce'], [1, '', 'lemon', 'produce'], [4, 'clove', 'garlic', 'produce'],
        [0.25, 'bunch', 'fresh rosemary', 'produce'], [2, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Toss vegetables with oil, garlic and rosemary in a roasting pan.', 'Nestle chicken on top, add lemon halves.', 'Roast at 425°F for 45 minutes until crisp.'],
    },
    {
      id: 'risotto', name: 'Butternut Squash & Sage Risotto', meal: 'dinner', time: 45,
      el: ['earth', 'water'], pl: ['Venus', 'Jupiter'], signs: ['Taurus', 'Libra'],
      note: 'Silky and sweet, stirred with attention. A Venusian love letter in rice.',
      ing: [
        [1, 'cup', 'arborio rice', 'pantry'], [2, 'cup', 'butternut squash', 'produce'], [4, 'cup', 'vegetable broth', 'pantry'],
        [0.5, '', 'yellow onion', 'produce'], [0.25, 'bunch', 'fresh sage', 'produce'],
        [0.33, 'cup', 'grated parmesan', 'dairy', D('nutritional yeast')], [2, 'tbsp', 'butter', 'dairy', D('olive oil')],
      ],
      steps: ['Roast cubed squash at 425°F for 25 minutes.', 'Sauté onion in butter; toast rice.', 'Add warm broth a ladle at a time, stirring, 20 minutes.', 'Fold in squash, parmesan and crisped sage.'],
    },
    {
      id: 'pasta-pomodoro', name: 'Pasta Pomodoro with Burrata', meal: 'dinner', time: 25,
      el: ['earth', 'fire'], pl: ['Venus'], signs: ['Libra', 'Taurus'],
      note: 'Simple, elegant and indulgent. Libra and Taurus agree on this one.',
      ing: [
        [8, 'oz', 'spaghetti', 'pantry', G('gluten-free spaghetti')], [1, 'can', 'crushed tomatoes', 'pantry'],
        [3, 'clove', 'garlic', 'produce'], [0.5, 'bunch', 'basil', 'produce'], [8, 'oz', 'burrata', 'dairy', D('toasted gluten-free breadcrumbs')],
        [3, 'tbsp', 'olive oil', 'pantry'], [0.25, 'tsp', 'chili flakes', 'spices'],
      ],
      steps: ['Cook pasta.', 'Warm garlic and chili in oil; add tomatoes and simmer 12 minutes.', 'Toss pasta with sauce and torn basil.', 'Crown with burrata.'],
    },
    {
      id: 'salmon-dill', name: 'Lemon-Dill Baked Salmon', meal: 'dinner', time: 25,
      el: ['water'], pl: ['Moon', 'Neptune'], signs: ['Cancer', 'Pisces'],
      note: 'Gentle, clean and from the water. Dinner for a sensitive Moon.',
      ing: [
        [12, 'oz', 'salmon fillets', 'protein'], [1, '', 'lemon', 'produce'], [0.25, 'bunch', 'fresh dill', 'produce'],
        [1, 'lb', 'asparagus', 'produce'], [1, 'cup', 'jasmine rice', 'pantry'], [2, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Cook rice.', 'Lay salmon and asparagus on a sheet pan; oil, lemon slices and dill.', 'Bake at 400°F for 12–15 minutes.'],
    },
    {
      id: 'mac-cheese', name: 'Baked Mac & Cheese with Greens', meal: 'dinner', time: 40,
      el: ['water', 'earth'], pl: ['Moon'], signs: ['Cancer', 'Taurus'],
      note: 'Childhood comfort, baked golden. The Moon remembers.',
      ing: [
        [8, 'oz', 'elbow macaroni', 'pantry', G('gluten-free pasta')], [8, 'oz', 'sharp cheddar', 'dairy', D(true)],
        [1.5, 'cup', 'milk', 'dairy', D(true)], [2, 'tbsp', 'butter', 'dairy', D(true)], [2, 'tbsp', 'all-purpose flour', 'pantry', G('cornstarch')],
        [2, 'cup', 'broccoli florets', 'produce'],
      ],
      steps: ['Cook pasta with broccoli for the last 3 minutes.', 'Make a roux with butter and flour; whisk in milk, then cheese.', 'Combine, pour into a dish, bake at 375°F for 15 minutes.'],
    },
    {
      id: 'coconut-curry', name: 'Coconut Fish Curry', meal: 'dinner', time: 30,
      el: ['water', 'fire'], pl: ['Neptune', 'Moon'], signs: ['Pisces', 'Cancer'],
      note: 'Coconut, sea and spice: warm, dreamy and a little mystical. Neptune’s favorite.',
      ing: [
        [12, 'oz', 'white fish fillets', 'protein'], [1, 'can', 'coconut milk', 'pantry'], [2, 'tbsp', 'Thai red curry paste', 'pantry'],
        [1, '', 'red bell pepper', 'produce'], [2, 'cup', 'baby spinach', 'produce'], [1, '', 'lime', 'produce'],
        [1, 'cup', 'jasmine rice', 'pantry'], [0.5, 'bunch', 'basil', 'produce'],
      ],
      steps: ['Cook rice.', 'Fry curry paste 1 minute; add coconut milk and sliced pepper.', 'Poach fish chunks 5 minutes; wilt in spinach.', 'Finish with lime and basil.'],
    },
    {
      id: 'mussels', name: 'White Wine Mussels', meal: 'dinner', time: 25,
      el: ['water'], pl: ['Neptune'], signs: ['Pisces', 'Scorpio'],
      note: 'A bowl of the ocean to share by candlelight. Pisces would set the table.',
      ing: [
        [2, 'lb', 'mussels', 'protein'], [1, 'cup', 'dry white wine', 'pantry'], [3, 'clove', 'garlic', 'produce'],
        [2, '', 'shallots', 'produce'], [2, 'tbsp', 'butter', 'dairy', D('olive oil')], [0.5, 'bunch', 'parsley', 'produce'],
        [1, '', 'baguette', 'bakery', G('gluten-free baguette')],
      ],
      steps: ['Soften shallots and garlic in butter.', 'Add wine, bring to a boil, add mussels; cover 6 minutes until open.', 'Shower with parsley; dunk bread.'],
    },
    {
      id: 'short-ribs', name: 'Black Garlic Braised Short Ribs', meal: 'dinner', time: 180,
      el: ['water', 'earth'], pl: ['Pluto', 'Saturn'], signs: ['Scorpio', 'Capricorn'],
      note: 'Dark, slow and transformative: hours of heat turn something tough tender. Pluto’s alchemy.',
      ing: [
        [2, 'lb', 'beef short ribs', 'protein'], [6, 'clove', 'black garlic', 'produce'], [1, '', 'yellow onion', 'produce'],
        [2, '', 'carrots', 'produce'], [1, 'cup', 'red wine', 'pantry'], [2, 'cup', 'beef broth', 'pantry'],
        [1, 'tbsp', 'tomato paste', 'pantry'], [1, 'lb', 'russet potatoes', 'produce'],
      ],
      steps: ['Sear ribs hard; remove.', 'Soften onion and carrot with tomato paste and black garlic.', 'Add wine, broth and ribs; cover and braise at 325°F for 2.5 hours.', 'Serve over mashed potatoes.'],
    },
    {
      id: 'mole', name: 'Quick Chicken Mole', meal: 'dinner', time: 50,
      el: ['water', 'fire'], pl: ['Pluto', 'Mars'], signs: ['Scorpio', 'Aries'],
      note: 'Chili and dark chocolate: complex, secretive and intense. A Scorpio dinner.',
      ing: [
        [1, 'lb', 'chicken thighs', 'protein'], [2, 'tbsp', 'chili powder', 'spices'], [1, 'oz', 'dark chocolate', 'pantry'],
        [1, 'can', 'crushed tomatoes', 'pantry'], [1, '', 'yellow onion', 'produce'], [2, 'clove', 'garlic', 'produce'],
        [2, 'tbsp', 'almond butter', 'pantry'], [1, 'tsp', 'ground cinnamon', 'spices'], [1, 'cup', 'jasmine rice', 'pantry'],
        [4, '', 'corn tortillas', 'bakery'],
      ],
      steps: ['Brown chicken; set aside.', 'Cook onion, garlic and spices; add tomatoes, almond butter and chocolate; blend smooth.', 'Simmer chicken in sauce 25 minutes.', 'Serve with rice and warm tortillas.'],
    },
    {
      id: 'stir-fry', name: 'Ginger-Garlic Tofu Stir-Fry', meal: 'dinner', time: 25,
      el: ['air', 'fire'], pl: ['Mercury', 'Mars'], signs: ['Gemini', 'Virgo'],
      note: 'Fast, varied, everything chopped just so. Mercury moves quickly in the wok.',
      ing: [
        [14, 'oz', 'firm tofu', 'protein'], [2, 'cup', 'broccoli florets', 'produce'], [1, '', 'red bell pepper', 'produce'],
        [1, 'tbsp', 'grated ginger', 'produce'], [3, 'clove', 'garlic', 'produce'], [3, 'tbsp', 'soy sauce', 'pantry', G('tamari')],
        [1, 'tbsp', 'rice vinegar', 'pantry'], [1, 'cup', 'jasmine rice', 'pantry'], [3, '', 'scallions', 'produce'],
      ],
      steps: ['Cook rice.', 'Crisp cubed tofu in a hot pan; remove.', 'Stir-fry broccoli and pepper, then ginger and garlic.', 'Return tofu; toss with soy and vinegar; top with scallions.'],
    },
    {
      id: 'fusion-tacos', name: 'Korean BBQ Tacos', meal: 'dinner', time: 30,
      el: ['air', 'fire'], pl: ['Uranus', 'Mars'], signs: ['Aquarius', 'Gemini'],
      note: 'Two cuisines colliding in a tortilla. Uranus loves a rule broken well.',
      ing: [
        [1, 'lb', 'flank steak', 'protein'], [3, 'tbsp', 'soy sauce', 'pantry', G('tamari')], [1, 'tbsp', 'gochujang', 'pantry', G(true)],
        [1, 'tbsp', 'brown sugar', 'pantry'], [8, '', 'corn tortillas', 'bakery'], [1, 'cup', 'kimchi', 'produce'],
        [3, '', 'scallions', 'produce'], [1, '', 'lime', 'produce'], [1, 'tsp', 'sesame seeds', 'pantry'],
      ],
      steps: ['Marinate thin-sliced steak in soy, gochujang and sugar 15 minutes.', 'Sear in a very hot pan.', 'Fill tortillas with steak, chopped kimchi, scallions and sesame; squeeze lime.'],
    },
    {
      id: 'pho', name: 'Weeknight Chicken Pho', meal: 'dinner', time: 40,
      el: ['air', 'water'], pl: ['Mercury', 'Moon'], signs: ['Gemini', 'Aquarius'],
      note: 'Aromatic broth and fresh herbs you add as you go. Interactive dinner for a curious mind.',
      ing: [
        [6, 'cup', 'chicken broth', 'pantry'], [12, 'oz', 'chicken thighs', 'protein'], [6, 'oz', 'rice noodles', 'pantry'],
        [1, '', 'yellow onion', 'produce'], [2, 'tbsp', 'grated ginger', 'produce'], [2, '', 'star anise', 'spices'],
        [1, 'tbsp', 'fish sauce', 'pantry'], [0.5, 'bunch', 'basil', 'produce'], [1, 'cup', 'bean sprouts', 'produce'], [1, '', 'lime', 'produce'],
      ],
      steps: ['Char halved onion and ginger in a dry pot.', 'Add broth, star anise and chicken; simmer 25 minutes.', 'Shred chicken; season with fish sauce.', 'Pour over noodles; top with herbs, sprouts and lime.'],
    },
    {
      id: 'grain-salad-feast', name: 'Herby Lemon Chicken Souvlaki', meal: 'dinner', time: 35,
      el: ['air', 'fire'], pl: ['Venus', 'Jupiter'], signs: ['Libra', 'Sagittarius'],
      note: 'Bright, social, best shared with friends. Libra’s dinner party.',
      ing: [
        [1, 'lb', 'chicken breast', 'protein'], [2, '', 'lemon', 'produce'], [1, 'tsp', 'dried oregano', 'spices'], [3, 'clove', 'garlic', 'produce'],
        [1, 'cup', 'Greek yogurt', 'dairy', D('tahini sauce')], [1, '', 'cucumber', 'produce'], [2, '', 'pita breads', 'bakery', G('gluten-free wraps')],
        [1, 'cup', 'cherry tomatoes', 'produce'], [2, 'tbsp', 'olive oil', 'pantry'],
      ],
      steps: ['Marinate chicken cubes in lemon, garlic, oregano and oil.', 'Grill or broil 10 minutes.', 'Grate cucumber into yogurt for tzatziki.', 'Serve in warm pita with tomatoes.'],
    },
    {
      id: 'stuffed-peppers', name: 'Quinoa-Stuffed Peppers', meal: 'dinner', time: 50,
      el: ['earth', 'air'], pl: ['Mercury', 'Saturn'], signs: ['Virgo', 'Capricorn'],
      note: 'Neat, balanced little packages. Virgo appreciates the portion control.',
      ing: [
        [4, '', 'red bell pepper', 'produce'], [1, 'cup', 'quinoa', 'pantry'], [1, 'can', 'black beans', 'pantry'],
        [1, 'cup', 'frozen corn', 'frozen'], [1, 'cup', 'salsa', 'pantry'], [1, 'tsp', 'ground cumin', 'spices'],
        [0.5, 'cup', 'shredded cheddar', 'dairy', D('dairy-free cheese shreds')],
      ],
      steps: ['Cook quinoa; mix with beans, corn, salsa and cumin.', 'Halve and seed peppers; stuff.', 'Top with cheese; bake at 375°F for 30 minutes.'],
    },
    {
      id: 'gnocchi', name: 'Brown Butter Gnocchi with Sage', meal: 'dinner', time: 20,
      el: ['earth', 'water'], pl: ['Venus', 'Moon'], signs: ['Taurus', 'Cancer'],
      note: 'Soft pillows in nutty butter: pure sensory pleasure for Venus in Taurus.',
      ing: [
        [1, 'lb', 'potato gnocchi', 'pantry', G('gluten-free gnocchi')], [3, 'tbsp', 'butter', 'dairy', D('olive oil')],
        [0.25, 'bunch', 'fresh sage', 'produce'], [4, 'cup', 'baby spinach', 'produce'],
        [0.33, 'cup', 'grated parmesan', 'dairy', D('toasted walnuts')], [1, '', 'lemon', 'produce'],
      ],
      steps: ['Boil gnocchi until they float.', 'Brown butter with sage leaves.', 'Toss gnocchi and spinach in the butter; finish with lemon and parmesan.'],
    },
    {
      id: 'ramen', name: 'Miso Mushroom Ramen', meal: 'dinner', time: 30,
      el: ['water', 'air'], pl: ['Pluto', 'Uranus'], signs: ['Scorpio', 'Aquarius'],
      note: 'Fermented miso depth with a jammy egg on top. Pluto goes to the noodle bar.',
      ing: [
        [2, 'tbsp', 'white miso', 'pantry'], [4, 'cup', 'vegetable broth', 'pantry'], [6, 'oz', 'ramen noodles', 'pantry', G('rice noodles')],
        [8, 'oz', 'mushrooms', 'produce'], [2, '', 'eggs', 'dairy'], [2, 'cup', 'baby bok choy', 'produce'],
        [3, '', 'scallions', 'produce'], [1, 'tsp', 'sesame oil', 'pantry'], [1, 'tbsp', 'soy sauce', 'pantry', G('tamari')],
      ],
      steps: ['Soft-boil eggs 6.5 minutes; peel.', 'Sauté mushrooms in sesame oil; add broth and bok choy.', 'Whisk in miso and soy off the boil.', 'Pour over cooked noodles; top with egg and scallions.'],
    },
    {
      id: 'eggplant', name: 'Roasted Eggplant with Pomegranate', meal: 'dinner', time: 45,
      el: ['fire', 'water'], pl: ['Jupiter', 'Venus'], signs: ['Sagittarius', 'Pisces'],
      note: 'Jewel-toned and lavish. Jupiter likes a table that feels like a feast.',
      ing: [
        [2, '', 'eggplant', 'produce'], [1, '', 'pomegranate', 'produce'], [0.5, 'cup', 'Greek yogurt', 'dairy', D('tahini sauce')],
        [1, 'cup', 'couscous', 'pantry', G('quinoa')], [0.25, 'bunch', 'fresh mint', 'produce'], [3, 'tbsp', 'olive oil', 'pantry'],
        [1, 'tsp', "za'atar", 'spices'],
      ],
      steps: ['Halve eggplant, score, oil and roast at 425°F for 35 minutes.', 'Prepare couscous.', 'Spoon yogurt over eggplant; scatter pomegranate, mint and za’atar.'],
    },
  ];
});
