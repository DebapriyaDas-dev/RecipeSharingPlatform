// Demo content for local development. Every account is fictional and uses the
// shared demo password in seed/ACCOUNTS.md.

export const PASSWORD = "Recipe#2026";

export const COOKS = [
  { key: "aarav", name: "Aarav Mehta", email: "aarav.mehta@recipeclub.test" },
  { key: "sofia", name: "Sofia Rossi", email: "sofia.rossi@recipeclub.test" },
  { key: "kenji", name: "Kenji Tanaka", email: "kenji.tanaka@recipeclub.test" },
  { key: "leila", name: "Leila Haddad", email: "leila.haddad@recipeclub.test" },
  { key: "maya", name: "Maya Fernandes", email: "maya.fernandes@recipeclub.test" },
  { key: "lucas", name: "Lucas Martin", email: "lucas.martin@recipeclub.test" },
  { key: "ananya", name: "Ananya Iyer", email: "ananya.iyer@recipeclub.test" },
  { key: "diego", name: "Diego Alvarez", email: "diego.alvarez@recipeclub.test" },
];

// `art` drives the generated photo: kind = how the food is drawn, vessel = what it sits in,
// colors = the dish palette (main, deep, accent, garnish)
export const RECIPES = [
  // ---- Aarav: North Indian classics
  {
    cook: "aarav", name: "Butter Chicken", time: "01:00:00", kcal: 520,
    description: "Smoky tandoori chicken simmered in a silky tomato, butter and cream gravy with a whisper of fenugreek. Mop it up with naan.",
    ingredients: [["Chicken thighs", "600 g"], ["Yogurt", "1/2 cup"], ["Tomato purée", "2 cups"], ["Butter", "3 tbsp"], ["Fresh cream", "1/2 cup"], ["Kasuri methi", "1 tsp"], ["Garam masala", "1 tsp"], ["Ginger-garlic paste", "1 tbsp"]],
    art: { kind: "curry", vessel: "bowl", bowl: "#2b2f3a", colors: ["#f08a2c", "#b8441c", "#f6c08a", "#3f7d3a"], chunks: "#f3b27a", cream: true, side: "#f3ead8", hot: true },
  },
  {
    cook: "aarav", name: "Dal Makhani", time: "01:30:00", kcal: 430,
    description: "Black lentils and kidney beans slow-cooked overnight-style until velvety, finished with butter, cream and a smoky tadka.",
    ingredients: [["Whole black urad dal", "1 cup"], ["Kidney beans", "1/4 cup"], ["Tomato purée", "1 cup"], ["Butter", "3 tbsp"], ["Cream", "1/3 cup"], ["Cumin seeds", "1 tsp"], ["Kashmiri chilli", "1 tsp"]],
    art: { kind: "curry", vessel: "bowl", bowl: "#7a3b22", colors: ["#7a3a20", "#3e1a0c", "#a65a32", "#3f7d3a"], cream: true, hot: true },
  },
  {
    cook: "aarav", name: "Paneer Tikka Masala", time: "00:50:00", kcal: 480,
    description: "Charred paneer cubes and peppers folded into a spiced onion-tomato masala. Vegetarian comfort with a restaurant-style finish.",
    ingredients: [["Paneer", "400 g"], ["Bell peppers", "2"], ["Onions", "2"], ["Tomatoes", "3"], ["Yogurt", "1/2 cup"], ["Tikka masala spice", "2 tbsp"], ["Cream", "1/4 cup"]],
    art: { kind: "curry", vessel: "bowl", bowl: "#e9e2d4", colors: ["#e0702a", "#9c3416", "#f7e6c4", "#3f7d3a"], chunks: "#f7e6c4", hot: true },
  },
  {
    cook: "aarav", name: "Masala Chai", time: "00:10:00", kcal: 120,
    description: "Strong Assam tea boiled with milk, crushed cardamom, ginger and cinnamon. The way it's poured at every street corner.",
    ingredients: [["Assam tea leaves", "2 tsp"], ["Milk", "1 cup"], ["Water", "1/2 cup"], ["Green cardamom", "3 pods"], ["Fresh ginger", "1 inch"], ["Cinnamon", "1 small stick"], ["Sugar", "2 tsp"]],
    art: { kind: "drink", vessel: "glass", colors: ["#b07a4a", "#6b3f1f", "#e8c9a0", "#7a5230"], foam: "#e8d2b4", hot: true },
  },

  // ---- Sofia: Italian
  {
    cook: "sofia", name: "Spaghetti Carbonara", time: "00:25:00", kcal: 610,
    description: "The Roman way: guanciale, egg yolks, Pecorino and black pepper emulsified into a glossy sauce. No cream, ever.",
    ingredients: [["Spaghetti", "320 g"], ["Guanciale", "150 g"], ["Egg yolks", "4"], ["Whole egg", "1"], ["Pecorino Romano", "60 g"], ["Black pepper", "1 tsp"]],
    art: { kind: "noodles", vessel: "plate", bowl: "#f2ede4", colors: ["#f1d38a", "#c99a3f", "#7a3a2a", "#2f2a24"], pepper: true, hot: true },
  },
  {
    cook: "sofia", name: "Margherita Pizza", time: "01:20:00", kcal: 780,
    description: "Blistered Neapolitan-style crust, San Marzano tomatoes, fior di latte and fresh basil. Simple, perfect, gone in minutes.",
    ingredients: [["Pizza dough", "1 ball"], ["San Marzano tomatoes", "200 g"], ["Fior di latte", "125 g"], ["Fresh basil", "8 leaves"], ["Olive oil", "1 tbsp"], ["Sea salt", "1 pinch"]],
    art: { kind: "pizza", vessel: "board", colors: ["#d9a25c", "#c0361f", "#f7f0dc", "#2f7a32"] },
  },
  {
    cook: "sofia", name: "Classic Tiramisu", time: "00:40:00", kcal: 450,
    description: "Espresso-soaked savoiardi layered with whipped mascarpone and a heavy dusting of cocoa. Better after a night in the fridge.",
    ingredients: [["Savoiardi biscuits", "200 g"], ["Mascarpone", "250 g"], ["Eggs", "3"], ["Sugar", "80 g"], ["Espresso", "1 cup"], ["Cocoa powder", "2 tbsp"]],
    art: { kind: "cake", vessel: "plate", bowl: "#f2ede4", colors: ["#6b4128", "#3b2112", "#f4e8d3", "#8a5a3a"], dust: "#5a3420" },
  },
  {
    cook: "sofia", name: "Wild Mushroom Risotto", time: "00:45:00", kcal: 540,
    description: "Carnaroli rice stirred slowly with porcini stock, sautéed wild mushrooms, butter and Parmigiano until it waves on the plate.",
    ingredients: [["Carnaroli rice", "300 g"], ["Mixed mushrooms", "300 g"], ["Dried porcini", "20 g"], ["Shallots", "2"], ["White wine", "1/2 cup"], ["Parmigiano", "60 g"], ["Butter", "2 tbsp"]],
    art: { kind: "rice", vessel: "plate", bowl: "#2b2f3a", colors: ["#e8dcc0", "#c9b48a", "#7a5634", "#3f7d3a"], creamy: true, hot: true },
  },

  // ---- Kenji: Japanese
  {
    cook: "kenji", name: "Shoyu Chicken Ramen", time: "02:00:00", kcal: 690,
    description: "Clear soy-seasoned chicken broth, springy noodles, a jammy marinated egg, chashu, nori and spring onions.",
    ingredients: [["Ramen noodles", "2 portions"], ["Chicken stock", "1.5 L"], ["Soy sauce", "4 tbsp"], ["Mirin", "2 tbsp"], ["Eggs", "2"], ["Chicken thigh chashu", "200 g"], ["Nori", "2 sheets"], ["Spring onions", "3"]],
    art: { kind: "ramen", vessel: "bowl", bowl: "#1d1d22", colors: ["#c98a3e", "#8a5422", "#f2d48a", "#3f8a3a"], hot: true },
  },
  {
    cook: "kenji", name: "Salmon Teriyaki Bowl", time: "00:30:00", kcal: 620,
    description: "Glazed salmon over steamed rice with edamame, avocado, pickled ginger and toasted sesame.",
    ingredients: [["Salmon fillets", "2"], ["Sushi rice", "1.5 cups"], ["Soy sauce", "3 tbsp"], ["Mirin", "2 tbsp"], ["Avocado", "1"], ["Edamame", "1/2 cup"], ["Sesame seeds", "1 tsp"]],
    art: { kind: "rice", vessel: "bowl", bowl: "#e9e2d4", colors: ["#f5f1e6", "#d8d0bd", "#e46a3c", "#5a9a3a"], toppings: ["#e46a3c", "#e46a3c", "#7fae4c", "#9cc26a"], hot: true },
  },
  {
    cook: "kenji", name: "Vegetable Gyoza", time: "00:50:00", kcal: 310,
    description: "Crisp-bottomed dumplings filled with cabbage, shiitake and ginger, steamed then pan-fried. Dip in chilli-soy.",
    ingredients: [["Gyoza wrappers", "24"], ["Napa cabbage", "2 cups"], ["Shiitake", "6"], ["Ginger", "1 tbsp"], ["Garlic", "2 cloves"], ["Soy sauce", "2 tbsp"], ["Sesame oil", "1 tsp"]],
    art: { kind: "dumplings", vessel: "steamer", colors: ["#f1e3c4", "#c99a5a", "#3a2418", "#3f8a3a"] },
  },
  {
    cook: "kenji", name: "Matcha Soufflé Pancakes", time: "00:35:00", kcal: 380,
    description: "Jiggly, cloud-soft pancakes flavoured with matcha, served with whipped cream and a drizzle of honey.",
    ingredients: [["Eggs", "2"], ["Cake flour", "30 g"], ["Milk", "2 tbsp"], ["Matcha powder", "1 tsp"], ["Sugar", "30 g"], ["Whipped cream", "1/2 cup"]],
    art: { kind: "pancakes", vessel: "plate", bowl: "#f2ede4", colors: ["#a9c46a", "#6e8f3a", "#f7f1dc", "#d94a5a"] },
  },

  // ---- Leila: Levantine
  {
    cook: "leila", name: "Silky Hummus", time: "00:20:00", kcal: 290,
    description: "Whipped chickpeas, tahini and lemon blended until impossibly smooth, finished with olive oil, paprika and whole chickpeas.",
    ingredients: [["Cooked chickpeas", "2 cups"], ["Tahini", "1/3 cup"], ["Lemon juice", "3 tbsp"], ["Garlic", "1 clove"], ["Ice water", "4 tbsp"], ["Olive oil", "2 tbsp"], ["Smoked paprika", "1/2 tsp"]],
    art: { kind: "dip", vessel: "bowl", bowl: "#2f5a7a", colors: ["#ead8b0", "#c9b07a", "#c9952a", "#c0361f"] },
  },
  {
    cook: "leila", name: "Chicken Shawarma Wraps", time: "00:45:00", kcal: 560,
    description: "Spiced chicken roasted until charred at the edges, wrapped in warm flatbread with garlic toum, pickles and tomatoes.",
    ingredients: [["Chicken thighs", "700 g"], ["Shawarma spice", "2 tbsp"], ["Flatbreads", "4"], ["Garlic toum", "1/2 cup"], ["Pickled turnips", "1/2 cup"], ["Tomatoes", "2"], ["Parsley", "1 bunch"]],
    art: { kind: "flatbread", vessel: "board", colors: ["#e2b878", "#9a5a2a", "#f5efe2", "#3f8a3a"], fillings: ["#9a5a2a", "#3f8a3a", "#d0402a", "#f5efe2"] },
  },
  {
    cook: "leila", name: "Fattoush Salad", time: "00:20:00", kcal: 260,
    description: "Crunchy toasted pita, cucumber, radish, tomato and herbs tossed with a tangy sumac and pomegranate dressing.",
    ingredients: [["Pita bread", "2"], ["Romaine", "1 head"], ["Cucumbers", "2"], ["Tomatoes", "3"], ["Radishes", "6"], ["Sumac", "1 tbsp"], ["Pomegranate molasses", "1 tbsp"]],
    art: { kind: "salad", vessel: "bowl", bowl: "#e9e2d4", colors: ["#6aa84a", "#3f7a2a", "#d0402a", "#c9a46a"], extras: ["#d0402a", "#c9e3a0", "#c9a46a", "#b4234a"] },
  },
  {
    cook: "leila", name: "Shakshuka", time: "00:35:00", kcal: 340,
    description: "Eggs poached in a bubbling pepper and tomato sauce spiced with cumin and paprika, topped with feta and parsley.",
    ingredients: [["Eggs", "5"], ["Crushed tomatoes", "800 g"], ["Red peppers", "2"], ["Onion", "1"], ["Cumin", "1 tsp"], ["Paprika", "2 tsp"], ["Feta", "80 g"]],
    art: { kind: "shakshuka", vessel: "pan", colors: ["#c8381c", "#8a1f0f", "#f5f0e4", "#3f8a3a"], hot: true },
  },

  // ---- Maya: Goan & coastal
  {
    cook: "maya", name: "Goan Fish Curry", time: "00:45:00", kcal: 410,
    description: "Kingfish simmered in a fiery red coconut gravy soured with kokum and tamarind. Serve with steamed rice.",
    ingredients: [["Kingfish steaks", "500 g"], ["Grated coconut", "1 cup"], ["Kashmiri chillies", "8"], ["Tamarind", "1 tbsp"], ["Kokum", "4"], ["Turmeric", "1/2 tsp"], ["Coconut oil", "2 tbsp"]],
    art: { kind: "curry", vessel: "bowl", bowl: "#7a3b22", colors: ["#d4471f", "#8a1f0f", "#f4dcc0", "#3f7d3a"], chunks: "#f1e4cf", hot: true },
  },
  {
    cook: "maya", name: "Coconut Prawn Pulao", time: "00:40:00", kcal: 530,
    description: "Fragrant basmati cooked in coconut milk with prawns, whole spices and curry leaves. One pot, big flavour.",
    ingredients: [["Basmati rice", "1.5 cups"], ["Prawns", "400 g"], ["Coconut milk", "1 can"], ["Onion", "1"], ["Curry leaves", "1 sprig"], ["Whole garam masala", "1 tbsp"], ["Green chillies", "2"]],
    art: { kind: "rice", vessel: "bowl", bowl: "#2b2f3a", colors: ["#f2e2b8", "#d9b878", "#f08050", "#3f8a3a"], toppings: ["#f08050", "#f29a6a", "#3f8a3a"], hot: true },
  },
  {
    cook: "maya", name: "Mango Lassi", time: "00:05:00", kcal: 210,
    description: "Alphonso mango blended with chilled yogurt, a pinch of cardamom and saffron. Summer in a glass.",
    ingredients: [["Mango pulp", "1 cup"], ["Yogurt", "1 cup"], ["Milk", "1/2 cup"], ["Sugar", "1 tbsp"], ["Cardamom", "1 pinch"], ["Saffron", "a few strands"]],
    art: { kind: "drink", vessel: "glass", colors: ["#f6a623", "#e07a10", "#fbe3a8", "#e05a20"], foam: "#fbe7b8" },
  },
  {
    cook: "maya", name: "Banana Walnut Pancakes", time: "00:25:00", kcal: 470,
    description: "Fluffy buttermilk pancakes studded with ripe banana and toasted walnuts, drowned in maple syrup.",
    ingredients: [["Flour", "1.5 cups"], ["Buttermilk", "1.25 cups"], ["Ripe bananas", "2"], ["Walnuts", "1/2 cup"], ["Egg", "1"], ["Baking powder", "2 tsp"], ["Maple syrup", "to serve"]],
    art: { kind: "pancakes", vessel: "plate", bowl: "#2b2f3a", colors: ["#d99a4a", "#9a5a1f", "#f7e9b8", "#f2e6a0"] },
  },

  // ---- Lucas: French
  {
    cook: "lucas", name: "French Onion Soup", time: "01:30:00", kcal: 450,
    description: "Onions caramelised low and slow for an hour, simmered in beef stock and topped with a bubbling Gruyère crouton.",
    ingredients: [["Yellow onions", "1 kg"], ["Butter", "3 tbsp"], ["Beef stock", "1.5 L"], ["Dry white wine", "1/2 cup"], ["Thyme", "4 sprigs"], ["Baguette", "4 slices"], ["Gruyère", "150 g"]],
    art: { kind: "soup", vessel: "bowl", bowl: "#7a3b22", colors: ["#a8642a", "#5a2e10", "#f2c96a", "#3f8a3a"], cheese: true, hot: true },
  },
  {
    cook: "lucas", name: "Provençal Ratatouille", time: "01:15:00", kcal: 230,
    description: "Thin rounds of courgette, aubergine, tomato and pepper baked in a spiral over a garlicky pepper sauce.",
    ingredients: [["Courgettes", "2"], ["Aubergine", "1"], ["Roma tomatoes", "4"], ["Red pepper", "1"], ["Garlic", "3 cloves"], ["Herbes de Provence", "1 tsp"], ["Olive oil", "3 tbsp"]],
    art: { kind: "spiral", vessel: "pan", colors: ["#c8381c", "#7a2a6a", "#d9c24a", "#5a9a3a"], hot: true },
  },
  {
    cook: "lucas", name: "Crêpes with Berries", time: "00:30:00", kcal: 350,
    description: "Paper-thin crêpes folded around vanilla cream, piled with fresh berries and a dusting of icing sugar.",
    ingredients: [["Flour", "1 cup"], ["Milk", "1.25 cups"], ["Eggs", "2"], ["Butter", "2 tbsp"], ["Mixed berries", "2 cups"], ["Vanilla cream", "1/2 cup"]],
    art: { kind: "pancakes", vessel: "plate", bowl: "#f2ede4", colors: ["#efc77a", "#c9903a", "#f7f1e4", "#b4234a"], berries: true, flat: true },
  },
  {
    cook: "lucas", name: "Chocolate Lava Cake", time: "00:25:00", kcal: 520,
    description: "Dark chocolate cakes with a molten centre that spills out at the first spoonful. Served warm with raspberries.",
    ingredients: [["Dark chocolate", "150 g"], ["Butter", "100 g"], ["Eggs", "2"], ["Egg yolks", "2"], ["Sugar", "60 g"], ["Flour", "2 tbsp"], ["Raspberries", "to serve"]],
    art: { kind: "cake", vessel: "plate", bowl: "#e9e2d4", colors: ["#4a2414", "#22100a", "#f7f1e4", "#c0263a"], berries: true, molten: true },
  },

  // ---- Ananya: South Indian
  {
    cook: "ananya", name: "Masala Dosa", time: "00:40:00", kcal: 420,
    description: "A crisp, golden fermented rice crêpe wrapped around spiced potato, served with coconut chutney and sambar.",
    ingredients: [["Dosa batter", "2 cups"], ["Potatoes", "4"], ["Onion", "1"], ["Mustard seeds", "1 tsp"], ["Curry leaves", "1 sprig"], ["Turmeric", "1/2 tsp"], ["Ghee", "2 tbsp"]],
    art: { kind: "roll", vessel: "plate", bowl: "#3a6a3a", colors: ["#e0a24a", "#a8641f", "#f3ead8", "#d4471f"], hot: true },
  },
  {
    cook: "ananya", name: "Hyderabadi Veg Biryani", time: "01:10:00", kcal: 560,
    description: "Layers of saffron basmati and spiced vegetables sealed and cooked dum-style, topped with fried onions and mint.",
    ingredients: [["Basmati rice", "2 cups"], ["Mixed vegetables", "3 cups"], ["Yogurt", "1/2 cup"], ["Fried onions", "1 cup"], ["Saffron milk", "3 tbsp"], ["Mint", "1/2 cup"], ["Biryani masala", "2 tbsp"]],
    art: { kind: "rice", vessel: "bowl", bowl: "#7a3b22", colors: ["#f4d58a", "#e8a23a", "#d9642a", "#3f8a3a"], toppings: ["#d9642a", "#f2c04a", "#7a4a2a", "#3f8a3a"], onions: true, hot: true },
  },
  {
    cook: "ananya", name: "Lemon Rice", time: "00:20:00", kcal: 330,
    description: "Turmeric-bright rice tempered with mustard seeds, curry leaves, peanuts and a generous squeeze of lemon.",
    ingredients: [["Cooked rice", "3 cups"], ["Lemons", "2"], ["Peanuts", "1/4 cup"], ["Mustard seeds", "1 tsp"], ["Chana dal", "1 tbsp"], ["Curry leaves", "1 sprig"], ["Turmeric", "1/2 tsp"]],
    art: { kind: "rice", vessel: "plate", bowl: "#2b2f3a", colors: ["#f2d04a", "#d9a81f", "#a8642a", "#3f8a3a"], toppings: ["#a8642a", "#c9843a", "#3f8a3a", "#2a2a2a"] },
  },
  {
    cook: "ananya", name: "Gulab Jamun", time: "00:50:00", kcal: 380,
    description: "Soft milk-dough dumplings fried golden and soaked in rose and cardamom syrup. Best served warm.",
    ingredients: [["Milk powder", "1 cup"], ["Flour", "3 tbsp"], ["Ghee", "1 tbsp"], ["Milk", "1/4 cup"], ["Sugar", "1.5 cups"], ["Rose water", "1 tsp"], ["Cardamom", "4 pods"]],
    art: { kind: "balls", vessel: "bowl", bowl: "#e9e2d4", colors: ["#6a2a10", "#3a1406", "#e0a03a", "#7aa84a"] },
  },

  // ---- Diego: Mexican
  {
    cook: "diego", name: "Chicken Tinga Tacos", time: "00:40:00", kcal: 490,
    description: "Shredded chicken in a smoky chipotle-tomato sauce on warm corn tortillas with onion, coriander and lime.",
    ingredients: [["Chicken breast", "500 g"], ["Chipotles in adobo", "2"], ["Tomatoes", "3"], ["Onion", "1"], ["Corn tortillas", "8"], ["Coriander", "1 bunch"], ["Limes", "2"]],
    art: { kind: "flatbread", vessel: "board", colors: ["#e8c47a", "#b8441c", "#f5efe2", "#3f8a3a"], fillings: ["#b8441c", "#3f8a3a", "#f5efe2", "#7a2a6a"], tacos: true },
  },
  {
    cook: "diego", name: "Chunky Guacamole", time: "00:10:00", kcal: 240,
    description: "Ripe avocados mashed with lime, white onion, jalapeño, tomato and coriander. Chunky, never smooth.",
    ingredients: [["Avocados", "3"], ["Lime", "1"], ["White onion", "1/4"], ["Jalapeño", "1"], ["Tomato", "1"], ["Coriander", "1/4 cup"], ["Salt", "to taste"]],
    art: { kind: "dip", vessel: "bowl", bowl: "#3a3a3a", colors: ["#8ab84a", "#5a8a2a", "#d0402a", "#f5f0e4"], chunky: true },
  },
  {
    cook: "diego", name: "Esquites Street Corn Salad", time: "00:20:00", kcal: 310,
    description: "Charred corn tossed with lime mayo, chilli, cotija and coriander. Mexico's favourite street snack in a bowl.",
    ingredients: [["Corn kernels", "3 cups"], ["Mayonnaise", "2 tbsp"], ["Lime", "1"], ["Chilli powder", "1 tsp"], ["Cotija cheese", "1/2 cup"], ["Coriander", "1/4 cup"]],
    art: { kind: "salad", vessel: "bowl", bowl: "#2f5a7a", colors: ["#f2c84a", "#d9a01f", "#c0361f", "#3f8a3a"], corn: true },
  },
  {
    cook: "diego", name: "Churros with Chocolate", time: "00:35:00", kcal: 540,
    description: "Crisp ridged churros rolled in cinnamon sugar with a thick, glossy hot chocolate for dipping.",
    ingredients: [["Water", "1 cup"], ["Flour", "1 cup"], ["Butter", "2 tbsp"], ["Eggs", "2"], ["Cinnamon sugar", "1/2 cup"], ["Dark chocolate", "120 g"], ["Cream", "1/2 cup"]],
    art: { kind: "sticks", vessel: "board", colors: ["#d99a4a", "#9a5a1f", "#f7ecd0", "#3a1a0c"] },
  },
];

// Reviews: [recipe name, cook key, score out of 10, comment]
export const REVIEWS = [
  ["Butter Chicken", "sofia", 10, "Restaurant quality. The kasuri methi really makes it."],
  ["Butter Chicken", "lucas", 9, "Rich and balanced. I halved the cream and it was still lovely."],
  ["Butter Chicken", "diego", 9, "My family asked for seconds before I sat down."],
  ["Butter Chicken", "kenji", 8, "Great sauce. I charred the chicken under the grill first."],
  ["Dal Makhani", "ananya", 9, "Creamy and smoky, exactly like the dhaba version."],
  ["Dal Makhani", "leila", 8, "Worth every minute of simmering."],
  ["Paneer Tikka Masala", "maya", 9, "The charred peppers add so much. Perfect weeknight dinner."],
  ["Paneer Tikka Masala", "lucas", 8, "Tasty! Would add a little more chilli next time."],
  ["Paneer Tikka Masala", "kenji", 9, "Best paneer dish I've cooked at home."],
  ["Masala Chai", "maya", 10, "This is the one. Crushing the cardamom fresh matters."],
  ["Masala Chai", "sofia", 8, "Cozy and spicy. My new afternoon ritual."],
  ["Spaghetti Carbonara", "aarav", 10, "Finally got a silky sauce without scrambling the eggs."],
  ["Spaghetti Carbonara", "diego", 9, "Simple and perfect. Guanciale is non-negotiable."],
  ["Spaghetti Carbonara", "leila", 9, "Took two tries to get the timing, then it was magic."],
  ["Margherita Pizza", "kenji", 9, "Blistered crust in a home oven. Use the hottest setting."],
  ["Margherita Pizza", "ananya", 8, "Classic and delicious. The dough tip was helpful."],
  ["Margherita Pizza", "lucas", 10, "Tastes like Naples."],
  ["Classic Tiramisu", "aarav", 10, "Made it for a birthday. Everyone wanted the recipe."],
  ["Classic Tiramisu", "maya", 9, "Light and creamy. Definitely rest it overnight."],
  ["Classic Tiramisu", "diego", 9, "Dangerously good."],
  ["Wild Mushroom Risotto", "leila", 9, "Earthy and rich. The porcini stock is the secret."],
  ["Wild Mushroom Risotto", "lucas", 8, "Lovely texture. I finished it with a little truffle oil."],
  ["Shoyu Chicken Ramen", "sofia", 10, "The broth is clean and deep. The eggs were perfect."],
  ["Shoyu Chicken Ramen", "diego", 9, "Long cook, but so worth it on a rainy day."],
  ["Shoyu Chicken Ramen", "aarav", 9, "Better than my local ramen shop."],
  ["Salmon Teriyaki Bowl", "maya", 9, "Quick, healthy and the glaze is addictive."],
  ["Salmon Teriyaki Bowl", "leila", 8, "Great lunch bowl. Added some cucumber."],
  ["Vegetable Gyoza", "ananya", 9, "Crispy bottoms, juicy filling. Froze a batch for later."],
  ["Vegetable Gyoza", "lucas", 8, "Fun to fold with the kids."],
  ["Matcha Soufflé Pancakes", "sofia", 9, "So jiggly! Keep the heat really low."],
  ["Matcha Soufflé Pancakes", "maya", 8, "Gorgeous and light. Mine deflated a little but still tasty."],
  ["Silky Hummus", "aarav", 10, "Ice water trick works. Smoothest hummus I've made."],
  ["Silky Hummus", "diego", 9, "Way better than store-bought."],
  ["Silky Hummus", "kenji", 9, "Bright and creamy. Great with warm pita."],
  ["Chicken Shawarma Wraps", "sofia", 9, "That toum! Garlic heaven."],
  ["Chicken Shawarma Wraps", "ananya", 9, "Perfect char on the chicken. Party favourite."],
  ["Fattoush Salad", "lucas", 8, "Fresh and crunchy. The sumac dressing is great."],
  ["Fattoush Salad", "maya", 9, "My go-to summer salad now."],
  ["Shakshuka", "kenji", 9, "Perfect brunch. Runny yolks every time."],
  ["Shakshuka", "aarav", 9, "Smoky, spicy and comforting."],
  ["Shakshuka", "diego", 10, "Added chorizo once. Incredible both ways."],
  ["Goan Fish Curry", "ananya", 10, "Tastes like a beach shack in Goa."],
  ["Goan Fish Curry", "aarav", 9, "That tang from the kokum is fantastic."],
  ["Coconut Prawn Pulao", "leila", 9, "Fragrant and so easy. One-pot wins."],
  ["Coconut Prawn Pulao", "kenji", 8, "Lovely flavour. I used basmati soaked for 30 min."],
  ["Mango Lassi", "diego", 10, "Thick, cold and perfect after spicy food."],
  ["Mango Lassi", "lucas", 9, "The saffron is a beautiful touch."],
  ["Banana Walnut Pancakes", "sofia", 8, "Fluffy and nutty. Great Sunday breakfast."],
  ["Banana Walnut Pancakes", "ananya", 9, "Kids loved these."],
  ["French Onion Soup", "aarav", 9, "Patience with the onions pays off. So rich."],
  ["French Onion Soup", "kenji", 10, "That cheesy crouton!"],
  ["French Onion Soup", "maya", 9, "Perfect winter soup."],
  ["Provençal Ratatouille", "sofia", 9, "Beautiful to serve and tastes like summer."],
  ["Provençal Ratatouille", "leila", 8, "Took time to slice but looked stunning."],
  ["Crêpes with Berries", "diego", 9, "Thin and delicate. Made a big stack."],
  ["Crêpes with Berries", "ananya", 8, "Lovely with lemon and sugar too."],
  ["Chocolate Lava Cake", "maya", 10, "Molten centre every time at 12 minutes."],
  ["Chocolate Lava Cake", "aarav", 10, "Date-night dessert sorted."],
  ["Chocolate Lava Cake", "leila", 9, "Rich and gooey. Raspberries cut through nicely."],
  ["Masala Dosa", "lucas", 9, "Crisp and golden. The potato filling is so good."],
  ["Masala Dosa", "maya", 10, "Just like home. The chutney is spot on."],
  ["Masala Dosa", "sofia", 8, "Getting the spread right took practice, but delicious."],
  ["Hyderabadi Veg Biryani", "aarav", 9, "Layers of flavour. The fried onions are key."],
  ["Hyderabadi Veg Biryani", "kenji", 9, "Smells incredible when you open the pot."],
  ["Lemon Rice", "diego", 8, "Bright and zesty. Great with yogurt."],
  ["Lemon Rice", "leila", 9, "So quick and the peanuts add great crunch."],
  ["Gulab Jamun", "sofia", 10, "Soft, syrupy perfection."],
  ["Gulab Jamun", "maya", 9, "Warm with a scoop of vanilla ice cream. Wow."],
  ["Chicken Tinga Tacos", "aarav", 9, "Smoky and saucy. Taco Tuesday upgraded."],
  ["Chicken Tinga Tacos", "kenji", 9, "That chipotle sauce is amazing."],
  ["Chicken Tinga Tacos", "lucas", 8, "Great flavour, a little spicy for me."],
  ["Chunky Guacamole", "leila", 9, "Chunky is the way. Lime is key."],
  ["Chunky Guacamole", "ananya", 9, "Made it three times this week."],
  ["Esquites Street Corn Salad", "sofia", 9, "Charring the corn makes all the difference."],
  ["Esquites Street Corn Salad", "maya", 8, "Creamy, tangy, spicy. Loved it."],
  ["Churros with Chocolate", "kenji", 10, "Crispy outside, soft inside. The chocolate is thick and glossy."],
  ["Churros with Chocolate", "ananya", 9, "Better than the fairground."],
];
