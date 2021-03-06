import React from "react";
import Flip from "./Flip";
import Avatar from "@material-ui/core/Avatar";
import { useCardDrag, useCardDrop } from "../Dnd";
import BackgroundCard from "./BackgroundCard";
import RoleCard from "./RoleCard";
import RolePicker from "./RolePicker";
import Overlay from "./Overlay";
import clsx from "clsx";
import "./styles.scss";
import SwapSuccess from "./SwapSuccess";
import useWindowSize from "../useWindowSize";
import Roles from "../Roles";
import Zoom from "@material-ui/core/Slide";

export type Props = {
  order: number;
  playerName: string;
  playerId: string;
  selected?: boolean;
  votes?: number;
  role: string;
  disabled?: boolean;
  token: string;
  gameId: string;
  mode?: "evening" | "night" | "morning" | "end";
  stack: "owned" | "friends" | "center";
  setToken: (token: string) => void;
  onRevel: () => void;
  swap: (p1: string, r1: string, p2: string, r2: string) => void;
  swaps: { self: number; others: number };
  userPhoto?: string;
  onVote?: (id: string) => void;
  canVote?: boolean;
};

export default function Card({
  role,
  userPhoto,
  selected = false,
  votes = 0,
  disabled = false,
  playerName,
  playerId,
  token,
  setToken,
  swap,
  stack,
  onRevel,
  mode = "evening",
  gameId,
  swaps,
  order,
  canVote= false,
  onVote = () => {},
}: Props) {
  const [flip, setFlip] = React.useState(false || mode === "end");
  const [localSwap, setLocalSwap] = React.useState(false);
  const windowsWidth = useWindowSize();
  const showVotes = mode === "end" || (canVote && mode === "morning")

  const cardSize = {
    width: windowsWidth.width ? Math.max(116, windowsWidth.width / 10) : 150,
  };

  const [{ opacity, isDragging }, dragRef] = useCardDrag(
    playerName,
    playerId,
    role,
    stack,
    setLocalSwap,
    swap,
    setFlip,
    mode
  );
  const [{ isOver, canDrop, source }, dropRef] = useCardDrop(
    mode,
    stack,
    swaps,
    role,
    playerId,
    playerName
  );

  React.useEffect(() => {
    setFlip(false || mode === "end");
  }, [role, gameId, mode]);

  return (
    <Zoom direction="up" in timeout={order * 150}>
      <div className="card-wrapper" ref={dropRef}>
        <div className={clsx("card", stack)} style={{ opacity }}>
          <span style={{maxWidth: cardSize.width}} className="name">{playerName ? playerName : 'You'}</span>
          <Flip
            isFlipped={flip}
            cardRef={dragRef}
            containerStyle={{ ...cardSize, cursor: "pointer" }}
            flipDirection="vertical">
            <BackgroundCard
              disabled={disabled}
              onFlip={(val) => {
                setFlip(val);
                if (mode === "night") {
                  onRevel();
                }
              }}
              {...cardSize}
            />
            <RoleCard role={role} onFlip={setFlip} {...cardSize} />
          </Flip>
          <div className="info">
            {stack === "friends" && (
              <Avatar
                className="avatar"
                src={
                  token === Roles.None
                    ? ""
                    : `images/cards/${token.toLowerCase()}.png`
                }
                style={{
                  width: cardSize.width / 2.5,
                  height: cardSize.width / 2.5,
                }}>
                --
              </Avatar>
            )}

            {stack === "owned" && (
              <RolePicker
                onSelect={(selected) => setToken(selected)}
                selected={token}>
                <Avatar
                  className="avatar"
                  src={
                    token === Roles.None
                      ? ""
                      : `images/cards/${token.toLowerCase()}.png`
                  }
                  style={{
                    width: cardSize.width / 2.5,
                    height: cardSize.width / 2.5,
                  }}>
                  --
                </Avatar>
              </RolePicker>
            )}
          </div>

          <Overlay
            from={source}
            to={
              stack === "center"
                ? "Center"
                : stack === "owned"
                ? "Your"
                : playerName + "'s"
            }
            isDragging={isDragging}
            isOver={isOver}
            canDrop={canDrop}
          />
          { showVotes && (
            <div
              onClick={() => stack === "friends" && mode === "morning" && onVote(selected ? '' : playerId)}
              className={clsx("vote", mode, { selected })}>
              {votes > 0 ? votes: ''}
            </div>
          )}
        </div>
        <SwapSuccess open={localSwap} setOpen={setLocalSwap} />
      </div>
    </Zoom>
  );
}
