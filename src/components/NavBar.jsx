function Navbar({
  searchTerm,
  setSearchTerm,
  setShowFavorites,
}) {
  return (
    <nav className="w-full bg-gray-900 shadow-md py-4 top-0 fixed z-50">
      <div className="max-w-3xl px-4 mx-auto text-center">
        <h1 className="text-2xl font-bold mb-3">Pokédex</h1>

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
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;