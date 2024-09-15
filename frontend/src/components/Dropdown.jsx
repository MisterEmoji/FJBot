import { useState } from "react";
import { Button, ButtonWrapper } from "./Button";

export default function Dropdown({
  expandButtonProps,
  wrapperClass,
  items,
  itemsPosition,
}) {
  const [dropDownExpanded, setDropDownExpanded] = useState(false);

  if (!items) {
    return;
  }

  return (
    <div className={`relative flex flex-col ${wrapperClass ?? ""}`}>
      <ButtonWrapper className={"w-full"}>
        <Button
          {...expandButtonProps}
          onClick={() => {
            setDropDownExpanded(!dropDownExpanded);
          }}
        ></Button>
      </ButtonWrapper>
      <div
        className={`${!dropDownExpanded ? "hidden" : ""} ${itemsPosition ?? "absolute"} top-full w-full flex-col hover:flex`}
      >
        {items.map((item, i) => (
          <ButtonWrapper key={i}>{item}</ButtonWrapper>
        ))}
      </div>
    </div>
  );
}
