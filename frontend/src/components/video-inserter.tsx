import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function VideoInserter() {
  const [inputValue, setInputValue] = React.useState(
    "https://youtu.be/bZQun8Y4L2A"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStart = async () => {
    console.log(inputValue);
  };

  return (
    <>
      <div className="flex w-full max-w-xl flex-wrap gap-2 lg:flex-nowrap">
        <Input value={inputValue} onChange={handleInputChange} />
        <Button onClick={handleStart} className="w-full px-4 lg:w-auto">
          Insert
        </Button>
      </div>
    </>
  );
}
