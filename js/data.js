// Built-in recipes. Recipes added from the admin panel are stored in
// localStorage and merged in by getAllRecipes().
const DEFAULT_RECIPES = [
  {
    slug: "mediterranean-chickpea-salad",
    title: "Mediterranean Chickpea Salad",
    overview: "A refreshing, protein-packed salad tossed in a lemon-olive oil dressing.",
    servings: 2, prepMinutes: 10, cookMinutes: 0,
    image: "assets/images/chickpea-salad.jpg",
    ingredients: [
      "1 can (400 g) chickpeas, drained & rinsed",
      "1 small cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red bell pepper, diced",
      "1/4 red onion, finely chopped",
      "2 Tbsp fresh parsley, chopped",
      "2 Tbsp extra-virgin olive oil",
      "1 Tbsp fresh lemon juice",
      "Sea salt & black pepper to taste"
    ],
    instructions: [
      "In a large bowl combine chickpeas, cucumber, tomatoes, bell pepper, red onion and parsley.",
      "Drizzle with olive oil and lemon juice.",
      "Season with salt and pepper; toss to coat.",
      "Serve immediately or chill up to 2 days."
    ]
  },
  {
    slug: "avocado-tomato-wholegrain-toast",
    title: "Avocado & Tomato Wholegrain Toast",
    overview: "Creamy avocado spread over toasted wholegrain bread, topped with juicy tomatoes.",
    servings: 1, prepMinutes: 5, cookMinutes: 5,
    image: "assets/images/avocado-toast.jpg",
    ingredients: [
      "2 slices wholegrain bread",
      "1 ripe avocado",
      "6 cherry tomatoes, halved",
      "1 tsp lemon juice",
      "Pinch of chilli flakes",
      "Sea salt & black pepper to taste"
    ],
    instructions: [
      "Toast the bread until golden and crisp.",
      "Mash the avocado with lemon juice, salt and pepper.",
      "Spread the avocado over the toast.",
      "Top with tomatoes and a pinch of chilli flakes."
    ]
  },
  {
    slug: "one-pan-lemon-garlic-salmon-with-asparagus",
    title: "One-Pan Lemon Garlic Salmon with Asparagus",
    overview: "A 15-minute weeknight dinner of flaky salmon and tender asparagus.",
    servings: 2, prepMinutes: 5, cookMinutes: 12,
    image: "assets/images/salmon-asparagus.jpg",
    ingredients: [
      "2 salmon fillets (150 g each)",
      "1 bunch asparagus, trimmed",
      "2 cloves garlic, minced",
      "1 lemon, sliced",
      "1 Tbsp olive oil",
      "Sea salt & black pepper to taste"
    ],
    instructions: [
      "Heat the olive oil in a large pan over medium-high heat.",
      "Season the salmon and place skin-side down; add the asparagus around it.",
      "Add the garlic and lemon slices; cook 5–6 minutes per side.",
      "Squeeze over the remaining lemon and serve."
    ]
  },
  {
    slug: "quinoa-veggie-power-bowl",
    title: "Quinoa Veggie Power Bowl",
    overview: "A balanced bowl of fluffy quinoa, roasted veggies and healthy fats.",
    servings: 2, prepMinutes: 10, cookMinutes: 15,
    image: "assets/images/quinoa-bowl.jpg",
    ingredients: [
      "1 cup quinoa, rinsed",
      "1 medium sweet potato, cubed",
      "1 cup chickpeas, drained",
      "2 handfuls baby spinach",
      "1 avocado, sliced",
      "2 Tbsp pumpkin seeds",
      "1 Tbsp olive oil",
      "1 lemon, cut into wedges"
    ],
    instructions: [
      "Cook the quinoa according to package directions.",
      "Roast the sweet potato and chickpeas with olive oil at 200 °C for 15 minutes.",
      "Divide the quinoa between bowls and add spinach, roasted veggies and avocado.",
      "Sprinkle with pumpkin seeds and serve with lemon wedges."
    ]
  },
  {
    slug: "sweet-potato-black-bean-tacos",
    title: "Sweet Potato Black Bean Tacos",
    overview: "Smoky roasted sweet potatoes and black beans tucked into warm tortillas.",
    servings: 3, prepMinutes: 10, cookMinutes: 15,
    image: "assets/images/sweet-potato-tacos.jpg",
    ingredients: [
      "2 medium sweet potatoes, diced",
      "1 can (400 g) black beans, drained",
      "6 small corn tortillas",
      "1 tsp smoked paprika",
      "1 tsp ground cumin",
      "1 lime, cut into wedges",
      "Fresh coriander to serve"
    ],
    instructions: [
      "Toss the sweet potatoes with paprika, cumin and a little oil; roast 15 minutes.",
      "Warm the black beans in a small pan.",
      "Heat the tortillas in a dry pan.",
      "Fill each tortilla with sweet potato and beans; top with coriander and lime."
    ]
  },
  {
    slug: "greek-yogurt-berry-parfait",
    title: "Greek Yogurt Berry Parfait",
    overview: "Layers of creamy yogurt, fresh berries and crunchy oats for a high-protein snack.",
    servings: 1, prepMinutes: 5, cookMinutes: 0,
    image: "assets/images/yogurt-parfait.jpg",
    ingredients: [
      "200 g Greek yogurt",
      "1/2 cup mixed berries",
      "3 Tbsp rolled oats or granola",
      "1 tsp honey"
    ],
    instructions: [
      "Spoon a layer of yogurt into a glass.",
      "Add a layer of berries and oats.",
      "Repeat the layers.",
      "Drizzle with honey and serve."
    ]
  },
  {
    slug: "lentil-spinach-soup",
    title: "Lentil & Spinach Soup",
    overview: "A hearty 30-minute soup rich in plant protein and iron.",
    servings: 4, prepMinutes: 10, cookMinutes: 20,
    image: "assets/images/lentil-soup.jpg",
    ingredients: [
      "1 cup red lentils, rinsed",
      "1 onion, diced",
      "2 carrots, diced",
      "2 cloves garlic, minced",
      "1 can (400 g) chopped tomatoes",
      "1 litre vegetable stock",
      "2 handfuls spinach",
      "1 tsp ground cumin"
    ],
    instructions: [
      "Sauté the onion, carrot and garlic until soft.",
      "Add cumin, lentils, tomatoes and stock; bring to a boil.",
      "Simmer for 20 minutes until the lentils are tender.",
      "Stir in the spinach until wilted and season to taste."
    ]
  },
  {
    slug: "banana-oat-pancakes",
    title: "Banana Oat Pancakes",
    overview: "Flour-free pancakes sweetened naturally with ripe bananas.",
    servings: 2, prepMinutes: 5, cookMinutes: 10,
    image: "assets/images/banana-pancakes.jpg",
    ingredients: [
      "2 ripe bananas",
      "2 eggs",
      "1 cup rolled oats",
      "1/2 tsp baking powder",
      "Pinch of cinnamon",
      "Fresh berries to serve"
    ],
    instructions: [
      "Blend the bananas, eggs, oats, baking powder and cinnamon until smooth.",
      "Heat a lightly oiled pan over medium heat.",
      "Pour in small rounds of batter and cook 2 minutes per side.",
      "Serve topped with banana slices and berries."
    ]
  }
];

const CUSTOM_KEY = "hrf_custom_recipes";

function getCustomRecipes() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCustomRecipes(list) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}

function getAllRecipes() {
  return [...getCustomRecipes(), ...DEFAULT_RECIPES];
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
