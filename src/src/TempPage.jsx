import React, { useEffect, useState } from "react";

const FilterableList = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const names = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Daniel",
    "Olivia",
    "Matthew",
    "Emma",
  ];

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = names.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleItemSelect = (name) => {
    if (!selectedItems.includes(name)) {
      setSelectedItems([...selectedItems, name]);
      setInputValue("");
    }
  };

  const handleItemDelete = (name) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== name
    );
    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    const handleWindowClick = () => {
      setFilteredItems([]);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="w-full mx-auto mt-8">
      <div className="relative">
        <div className="flex gap-2 w-full bg-slate-300 flex-wrap">
          {selectedItems.length > 0 &&
            selectedItems.map((name) => (
              <button
                key={name}
                onClick={() => handleItemDelete(name)}
                className="px-2 py-1 flex text-sm text-white bg-blue-500 rounded"
              >
                {name} <span className="ml-1">×</span>
              </button>
            ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setFilteredItems([])}
            className="flex-1 min-w-[20px] px-4 py-2 border border-blue-500 rounded focus:outline-none"
          />
        </div>

        {filteredItems.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-2">
            {filteredItems.map((name) => (
              <div
                key={name}
                onClick={() => handleItemSelect(name)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterableList;
