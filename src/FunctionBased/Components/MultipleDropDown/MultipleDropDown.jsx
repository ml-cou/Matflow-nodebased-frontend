import React, { useEffect, useRef, useState } from "react";

const MultipleDropDown = ({
  columnNames,
  setSelectedColumns,
  curInd = 0,
  disabled = false,
  defaultValue,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultValue) setSelectedItems(defaultValue);
    // console.log('first')
  }, [defaultValue]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = columnNames.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);

    // setDropdownOpen(false); // Close the dropdown when input value changes
  };

  const handleItemSelect = (name) => {
    if (!selectedItems.includes(name)) {
      setSelectedItems([...selectedItems, name]);
      setSelectedColumns([...selectedItems, name], curInd);
      setInputValue("");
    }
  };

  const handleItemDelete = (name) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== name
    );
    setSelectedItems(updatedItems);
    setSelectedColumns(updatedItems);
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilteredItems([]);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="w-full mx-auto mt-1 " ref={dropdownRef}>
      <div
        className={`relative border-2 border-gray-300 px-2 pr-2 py-1 rounded-xl hover:border-primary-btn ${
          disabled && "hover:border-transparent border-transparent bg-gray-200"
        }`}
      >
        <div className="flex gap-2 w-full flex-wrap">
          {selectedItems.length > 0 &&
            selectedItems.map((name) => (
              <button
                key={name}
                onClick={() => handleItemDelete(name)}
                className="px-2 flex items-center text-xs text-white bg-primary-btn rounded"
              >
                {name} <span className="ml-1">×</span>
              </button>
            ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputChange}
            className={`flex-1 min-w-[30px] p-2 py-1 ${
              disabled ? "cursor-not-allowed" : ""
            }`}
            placeholder="Choose an option"
            disabled={disabled}
          />
        </div>

        {filteredItems.length > 0 && (
          <div className="absolute h-64 overflow-y-auto z-[1000] w-full bg-white border border-gray-300 rounded mt-2">
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
      {selectedItems.length > 0 && (
        <button
          className="text-xs float-right mt-1 underline text-red-600"
          onClick={() => {
            setSelectedItems([]);
            setSelectedColumns([], curInd);
          }}
        >
          Delete All
        </button>
      )}
    </div>
  );
};

export default MultipleDropDown;
