// src/components/GlobalSearch.jsx

const GlobalSearch = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
      />
    </div>
  );
};

export default GlobalSearch;
