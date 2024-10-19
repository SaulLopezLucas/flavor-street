import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const apiKey = "4e1ac4897a2e46f99dd243ad2b6ad90e";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=20&addRecipeInformation=true`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecipes(data.results);
      } catch (error) {
        console.error("Failed to fetch recipes:", error); // Log the error to the console
      }
    };
    fetchRecipes();
  }, [apiKey]);

  const totalRecipes = recipes.length;
  const cuisineTypes = [...new Set(recipes.map(recipe => recipe.cuisines).flat())];
  const tags = [...new Set(recipes.map(recipe => recipe.dishTypes).flat())];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCuisine =
      selectedCuisines.length === 0 ||
      selectedCuisines.some((cuisine) => recipe.cuisines.includes(cuisine));
    const matchesTag =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => recipe.dishTypes.includes(tag));

    return (
      matchesCuisine &&
      matchesTag &&
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCuisineChange = (event) => {
    const value = event.target.value;
    setSelectedCuisines((prev) =>
      prev.includes(value) ? prev.filter((cuisine) => cuisine !== value) : [...prev, value]
    );
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((tag) => tag !== value) : [...prev, value]
    );
  };

  return (
    <div className="recipe-container">
      <h1 className="header">Flavor Street</h1>
      <h2 className="subheader">From Pantry to Plate, Made Simple</h2>
      <div className="summary-statistics">
        <h3>Summary Statistics</h3>
        <ul>
          <li>Total Number of Recipes: {totalRecipes}</li>
          <li>Types of Cuisine: {cuisineTypes.join(", ") || "None"}</li>
          <li>Tags: {tags.join(", ") || "None"}</li>
        </ul>
      </div>
      <div className="filter-container">
        <h3>Filter by Cuisine</h3>
        {cuisineTypes.map((cuisine) => (
          <label key={cuisine}>
            <input
              type="checkbox"
              value={cuisine}
              checked={selectedCuisines.includes(cuisine)}
              onChange={handleCuisineChange} // Ensure this function is defined
            />
            {cuisine}
          </label>
        ))}
        
        <h3>Filter by Tags</h3>
        {tags.map((tag) => (
          <label key={tag}>
            <input
              type="checkbox"
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={handleTagChange}
            />
            {tag}
          </label>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search for a recipe"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="search-bar"
      />
      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
            />
            <h3 className="recipe-title">{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
