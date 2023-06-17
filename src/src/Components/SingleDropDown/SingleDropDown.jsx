import { Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

function SingleDropDown({ columnNames, onValueChange }) {
  const [filter1, setFilter1] = useState("");
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef1 = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsOpen1(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange1 = (event) => {
    const newFilter = event.target.value;
    setFilter1(newFilter);
    setIsOpen1(true);
  };

  const filteredItems1 = columnNames.filter((item) =>
    item.toLowerCase().includes(filter1.toLowerCase())
  );

  return (
    <div ref={dropdownRef1} className="relative mt-2">
      <Input
        type="text"
        bordered
        color="success"
        fullWidth
        placeholder="Column Name"
        value={filter1}
        onChange={handleInputChange1}
        onFocus={() => setIsOpen1(true)}
      />

      {isOpen1 && (
        <ul className="border border-gray-300 shadow-md rounded-md absolute max-h-60 overflow-y-auto w-full top-full p-2 px-4 z-[1000] bg-white">
          {filteredItems1.map((item, ind) => (
            <li
              key={ind}
              onClick={() => {
                setFilter1(item);
                onValueChange(item);
                setIsOpen1(false);
              }}
              className="text-lg tracking-wider cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SingleDropDown;
