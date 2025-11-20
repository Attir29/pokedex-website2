import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/NavBar.jsx";
import { TypeFilter } from "./components/TypeFilter";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 20;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  const fetchAllPokemons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1300"
      );

      const detailData = await Promise.all(
        res.data.results.map((p) => axios.get(p.url))
      );

      setAllPokemons(detailData.map((r) => r.data));
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // FILTER
  const filtered = allPokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const pokemonTypes = pokemon.types.map((t) => t.type.name);
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => pokemonTypes.includes(type));

    return matchesSearch && matchesType;
  });

  // PAGINATION fallback jika tidak search
  const paginated = searchTerm
    ? filtered
    : filtered.slice((page - 1) * perPage, page * perPage);

  const toggleFavorite = (pokemon) => {
    const exists = favorites.find((f) => f.id === pokemon.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== pokemon.id));
    } else {
      setFavorites([...favorites, pokemon]);
    }
  };

  const isFavorite = (pokemon) => {
    return favorites.some((f) => f.id === pokemon.id);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-gray-100">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowFavorites={setShowFavorites}
      />

      {/* LIST SECTION */}
      <section className="pb-11 pt-24 sm:pt-36 flex flex-col justify-center items-center">
        {loading ? (
          <p>Loading Pokémon...</p>
        ) : (
          <>
            <div className="w-full overflow-x-auto px-3 mt-10 md:mt-0">
              <TypeFilter
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="w-full max-w-[736px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {paginated.length > 0 ? (
                paginated.map((p) => (
                  <div
                    key={p.id}
                    className="w-full bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all hover:bg-gray-700"
                    onClick={() => setSelectedPokemon(p)}
                  >
                    <img
                      src={p.sprites.other["official-artwork"].front_default}
                      alt={p.name}
                      width="120"
                      className="mx-auto"
                    />
                    <div className="flex flex-col items-start">
                      <p>{p.id.toString().padStart(3, "0")}</p>
                      <h3 className="capitalize font-bold text-lg mb-2 text-white">
                        {p.name}
                      </h3>
                      <p className="text-gray-300 capitalize">
                        {p.types.map((t) => t.type.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Pokémon found</p>
              )}
            </div>

            {/* PAGINATION (hanya tampil jika tidak search) */}
            {!searchTerm && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50 text-gray-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="bg-gray-700 px-3 py-1 rounded text-gray-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* DETAIL POPUP */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm mx-auto relative text-gray-200">
            <button
              className="absolute top-2 right-2 text-gray-300 cursor-pointer"
              onClick={() => setSelectedPokemon(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold capitalize text-center mb-4">
              {selectedPokemon.name}
            </h2>

            <img
              src={
                selectedPokemon.sprites.other["official-artwork"].front_default
              }
              width="180"
              className="mx-auto mb-4"
            />

            <p>
              <strong>Types:</strong>{" "}
              {selectedPokemon.types.map((t) => t.type.name).join(", ")}
            </p>
            <p>
              <strong>Height:</strong> {selectedPokemon.height}
            </p>
            <p>
              <strong>Weight:</strong> {selectedPokemon.weight}
            </p>
            <p>
              <strong>Abilities:</strong>{" "}
              {selectedPokemon.abilities.map((a) => a.ability.name).join(", ")}
            </p>
            <p className="mb-4">
              <strong>Base Exp:</strong> {selectedPokemon.base_experience}
            </p>

            <button
              onClick={() => toggleFavorite(selectedPokemon)}
              className={`px-4 py-2 rounded-lg w-full cursor-pointer hover:scale-102 transition-transform active:scale-98 ${
                isFavorite(selectedPokemon)
                  ? "bg-gray-200 text-black"
                  : "bg-red-700"
              }`}
            >
              {isFavorite(selectedPokemon)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>
        </div>
      )}

      {/* FAVORITE POPUP */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative text-gray-200 max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-300 cursor-pointer"
              onClick={() => setShowFavorites(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">
              Favorite Pokémon
            </h2>

            {favorites.length === 0 ? (
              <p className="text-center text-gray-400">No favorites added.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {favorites.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex gap-3 cursor-pointer"
                    onClick={() => {
                      setSelectedPokemon(p);
                      setShowFavorites(false);
                    }}
                  >
                    <img
                      src={p.sprites.other["official-artwork"].front_default}
                      width="70"
                    />
                    <div className="flex items-center justify-between w-full">
                      <h3 className="capitalize text-lg font-bold">{p.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p);
                        }}
                        className="bg-red-600 hover:bg-red-400 px-4 py-2 rounded-lg text-white cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
