import React from "react";
import BackgroundCard from "../Card/BackgroundCard";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import { TouchTransition } from "react-dnd-multi-backend";

export const generatePreview = ({ item, style }: any) => {
  return (
    <div
      style={{
        ...style,
        zIndex: 11
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}>
        <BackgroundCard width={70} onFlip={() => {}} disabled></BackgroundCard>
      </div>
    </div>
  );
};

export const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend, // Note that you can call your backends with options
      preview: true,
      transition: TouchTransition,
      options: {
        enableMouseEvents: true,
        scrollAngleRanges: [
          { start: 30, end: 150 },
          { start: 210, end: 330 }
        ]
      }
    }
  ]
};

export {default as useCardDrop} from './useCardDrop';
export {default as useCardDrag} from './useCardDrag'