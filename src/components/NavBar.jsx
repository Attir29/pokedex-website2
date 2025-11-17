export default function Navbar({ searchTerm, setSearchTerm, setShowFavorites }) {
  return (
    <nav className="w-full bg-gray-900 shadow-md py-4 top-0 fixed z-50">
      <div className="max-w-[768px] px-4 mx-auto text-center">
        <h1 className="text-2xl font-bold mb-3 text-red-600">Pokédex</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-black text-black"
          />

          <button
            onClick={() => setShowFavorites(true)}
            className="px-4 py-2 bg-white border-1 text-white rounded-lg cursor-pointer"
          >
            ❤️
          </button>
        </div>
      </div>
    </nav>
  );
}
