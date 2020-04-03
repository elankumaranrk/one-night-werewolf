import React from "react";

type Props = {
  role: string;
  width?: number;
  height?: number;
  picRef?: React.Ref<HTMLElement>;
  onFlip: (flip: boolean) => void;
};

export default function RoleCard({
  role,
  picRef,
  onFlip,
  ...others
}: Props) {
  return (
    <span className="card-image" ref={picRef} onClick={() => onFlip(false)}>
    <img
      {...others}
      src={`images/cards/${role.toLowerCase()}.png`}
      alt={"Card is hidden"}
    />
  </span>

  );
}
