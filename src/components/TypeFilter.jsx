const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const typeColors = {
  normal: "bg-gray-400 text-white hover:bg-gray-500",
  fire: "bg-red-500 text-white hover:bg-red-600",
  water: "bg-blue-500 text-white hover:bg-blue-600",
  electric: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
  grass: "bg-green-500 text-white hover:bg-green-600",
  ice: "bg-cyan-400 text-gray-900 hover:bg-cyan-500",
  fighting: "bg-red-700 text-white hover:bg-red-800",
  poison: "bg-purple-500 text-white hover:bg-purple-600",
  ground: "bg-yellow-600 text-white hover:bg-yellow-700",
  flying: "bg-indigo-400 text-white hover:bg-indigo-500",
  psychic: "bg-pink-500 text-white hover:bg-pink-600",
  bug: "bg-lime-500 text-white hover:bg-lime-600",
  rock: "bg-yellow-700 text-white hover:bg-yellow-800",
  ghost: "bg-purple-700 text-white hover:bg-purple-800",
  dragon: "bg-indigo-700 text-white hover:bg-indigo-800",
  dark: "bg-gray-700 text-white hover:bg-gray-800",
  steel: "bg-gray-500 text-white hover:bg-gray-600",
  fairy: "bg-pink-300 text-gray-900 hover:bg-pink-400",
};

export const TypeFilter = ({
  selectedTypes = [],
  onTypeToggle = () => {},
  onClearFilters = () => {},
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter by Type</h2>

        {selectedTypes.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <div
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`cursor-pointer capitalize px-3 py-1 rounded-full text-sm font-medium transition ${
                isSelected
                  ? typeColors[type]
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type}
            </div>
          );
        })}
      </div>
    </div>
  );
};
