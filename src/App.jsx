import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/navBar";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchPokemons();
  }, [page]);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`
      );

      const details = await Promise.all(
        response.data.results.map((pokemon) => axios.get(pokemon.url))
      );

      setPokemons(details.map((res) => res.data));
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    }
    setLoading(false);
  };

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-900 text-gray-100">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowFavorites={setShowFavorites}
      />

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : (
        <>
          <section className="pb-11 pt-36 flex flex-col justify-center items-center">
            <div className="grid grid-cols-4 gap-4 p-4">
              {filteredPokemons.length > 0 ? (
                filteredPokemons.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-800 p-3 rounded-lg shadow-md text-center cursor-pointer"
                    onClick={() => setSelectedPokemon(p)}
                  >
                    <h3 className="capitalize font-bold text-lg mb-2 text-white">
                      {p.name}
                    </h3>
                    <img
                      src={p.sprites.other["official-artwork"].front_default}
                      alt={p.name}
                      width="120"
                      className="mx-auto"
                    />
                    <p className="text-gray-300">
                      <strong>Types:</strong>{" "}
                      {p.types.map((t) => t.type.name).join(", ")}
                    </p>
                  </div>
                ))
              ) : (
                <p>No Pokémon found 😢</p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50 text-gray-200"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-gray-700 px-3 py-1 rounded text-gray-200"
              >
                Next
              </button>
            </div>
          </section>
        </>
      )}

      {/* DETAIL CARD POPUP */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative text-gray-200">
            <button
              className="absolute top-2 right-2 text-gray-300"
              onClick={() => setSelectedPokemon(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold capitalize text-center mb-4 text-white">
              {selectedPokemon.name}
            </h2>

            <img
              src={
                selectedPokemon.sprites.other["official-artwork"].front_default
              }
              alt={selectedPokemon.name}
              className="mx-auto mb-4"
              width="180"
            />

            <p className="mb-2">
              <strong>Types:</strong>{" "}
              {selectedPokemon.types.map((t) => t.type.name).join(", ")}
            </p>

            <p className="mb-2">
              <strong>Height:</strong> {selectedPokemon.height}
            </p>

            <p className="mb-2">
              <strong>Weight:</strong> {selectedPokemon.weight}
            </p>

            <p className="mb-2">
              <strong>Abilities:</strong>{" "}
              {selectedPokemon.abilities.map((a) => a.ability.name).join(", ")}
            </p>

            <p className="mb-4">
              <strong>Base Experience:</strong>{" "}
              {selectedPokemon.base_experience}
            </p>

            <button
              onClick={() => toggleFavorite(selectedPokemon)}
              className={`px-4 py-2 rounded-lg w-full ${
                isFavorite(selectedPokemon)
                  ? "bg-red-500"
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
      {/* END DETAIL CARD POPUP */}

      {/* FAVORITE CARD POPUP */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative text-gray-200 max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-300"
              onClick={() => setShowFavorites(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">Favorite Pokémon</h2>

            {favorites.length === 0 ? (
              <p className="text-center text-gray-400">No favorites added.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {favorites.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-700 p-3 rounded-lg flex gap-3 cursor-pointer"
                    onClick={() => {
                      setSelectedPokemon(p);
                      setShowFavorites(false);
                    }}
                  >
                    <img
                      src={
                        p.sprites.other["official-artwork"].front_default
                      }
                      width="70"
                      alt={p.name}
                    />
                    <div>
                      <h3 className="capitalize text-lg font-bold">{p.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p);
                        }}
                        className="text-red-400 underline"
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
      {/* END FAVORITE CARD POPUP */}
    </div>
  );
}

export default App;
