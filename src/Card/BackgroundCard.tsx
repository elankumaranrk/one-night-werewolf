import React from "react";
import { DragElementWrapper } from "react-dnd";

type Props = {
  width?: number;
  height?: number;
  disabled?: boolean;
  picRef?:  DragElementWrapper<any>;
  onFlip: (flip: boolean) => void;
};

export default function BackgroundCard({
  disabled = false,
  picRef,
  onFlip,
  ...others
}: Props) {
  return (
    <span className="card-image" ref={picRef} onClick={() => !disabled && onFlip(true)}>
      <img
        {...others}
        src={`images/cards/background.png`}
        alt={"Card is hidden"}
      />
    </span>
  );
}
