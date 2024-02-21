"use client";

import { ChangeEventHandler, useEffect, useState } from "react";

interface InputProps {
  className: string;
  value: string;
  placeholder: string;
  dropDownData: { value: number; text: string }[];
  selectData(path: string): void;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function DropDownInput({
  onChange,
  className,
  value,
  placeholder,
  dropDownData,
  selectData,
}: InputProps) {
  const [inFocus, setInFocus] = useState(false);
  const [data, setData] = useState(dropDownData);

  useEffect(() => {
    if (value) {
      setData(() =>
        dropDownData.filter((d) =>
          d.text
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(value.toLowerCase().replaceAll(" ", "")),
        ),
      );
    }
  }, [value]);

  const handleSelectData = (text: string) => {
    selectData(text);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={`p-1 text-white bg-mantle border-2 border-mantle t rounded outline-0 text-sm  focus:border-2 focus:border-crust  ${className}`}
        onChange={onChange}
        value={value}
        onFocus={() => setInFocus(true)}
        onBlur={() => setTimeout(() => setInFocus(false), 100)}
        placeholder={placeholder}
      />
      {inFocus && value && (
        <div className="absolute w-full top-full z-10 left- text-white bg-mantle border-2 border-mantle flex flex-col">
          {data.slice(0, 5).map((d) => (
            <span
              key={d.text}
              className="hover:bg-surface transition-colors duration-300 cursor-pointer p-1 text-sm text-white"
              onClick={() => handleSelectData(d.text)}
            >
              {d.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
