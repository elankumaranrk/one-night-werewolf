import { useDrag } from "react-dnd";

export default function useCardDrag(
  playerName: string,
  playerId: string,
  role: string,
  stack: string,
  setLocalSwap: React.Dispatch<React.SetStateAction<boolean>>,
  swap: (p1: string, r1: string, p2: string, r2: string) => void,
  setFlip: React.Dispatch<React.SetStateAction<boolean>>,
  mode: string
): any {
  return useDrag({
    item: { type: "card", playerName, playerId, role, stack },
    end: (source: any, monitor) => {
      const dest = monitor.getDropResult();
      if (dest) {
        setLocalSwap(true);
        swap(source.playerId, source.role, dest.playerId, dest.role);
      }
    },
    begin: () => {
      setFlip(false || mode === "end");
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.1 : 1
    })
  });
}
