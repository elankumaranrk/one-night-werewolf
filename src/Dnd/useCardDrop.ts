import { useDrop } from "react-dnd";

export default function useCardDrop(
  mode: string,
  stack: string,
  swaps: { self: number; others: number },
  role: string,
  playerId: string,
  playerName: string
): [{ isOver: any; canDrop: any; source: any }, any] {
  return useDrop({
    accept: "card",
    canDrop: (item: any) => {
      if (mode !== "night") return false;
      if (stack === "owned" || item.stack === "owned") {
        return swaps.self > 0;
      }
      return swaps.others > 0;
    },
    drop: () => ({ role, playerId, playerName, stack }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      source:
        monitor.getItem() &&
        (monitor.getItem().stack === "center"
          ? "Center"
          : monitor.getItem().stack === "owned"
          ? "Your"
          : monitor.getItem().playerName + "'s")
    })
  });
}
