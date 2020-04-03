import React from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  isOver: boolean;
  canDrop: boolean;
  isDragging: boolean;
  from: string;
  to: string;
};

export default function Overlay({
  from,
  to,
  isOver,
  isDragging,
  canDrop
}: Props) {
  return (
    <div
      className={clsx("overlay", {
        allow: isOver && !isDragging && canDrop,
        disallow: isOver && !isDragging && !canDrop,
      })}>
      {canDrop ? (
        <div style={{color:"#0B332D"}}>
          Swap {from} and {to} cards
        </div>
      ) : (
        <div style={{color:"#971500"}}>
          Swap not allowed
          </div>
      )}
    </div>
  );
}
