import React, { useState, useEffect } from "react";

const calculateTimeLeft = (from: Date) => {
  const difference = +from - +new Date();
  let timeLeft = {
    minutes: '00',
    seconds: '00',
  };

  if (difference > 0) {
    timeLeft = {
      minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
      seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
    };
  }

  return timeLeft;
};

type Props = {
  from: Date;
  onEnd: () => void;
};

export default function Timer(props: Props) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(props.from));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(props.from));
      if (timeLeft.minutes === '00' && timeLeft.seconds === '00') {
        props.onEnd();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  });


  return (
    <div>
      <span className="seperator"> Voting in </span>
      <span className="digit">{timeLeft.minutes}</span>
      <span className="seperator">m</span>
      <span className="digit">{timeLeft.seconds}</span>
      <span className="seperator">s</span>
    </div>
  );
}
