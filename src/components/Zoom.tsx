import React from "react";

interface ZoomProps {
  size: number;
  onChange: (size: number) => void;
}

const defaultSize = 80;
const maxSize = 300;

const Zoom: React.FC<ZoomProps> = ({ size, onChange }) => {
  const [value, setValue] = React.useState(size ?? defaultSize);
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };
  const id = React.useId();

  return (
    <div className="space-x-2 m-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-100"
      >
        Zoom:
      </label>
      <input
        id={id}
        type="range"
        value={value}
        onChange={onChangeHandler}
        min={10}
        max={maxSize}
        className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default Zoom;
