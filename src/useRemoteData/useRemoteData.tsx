import React from "react";
import Roles from "../Roles";
import { firebaseApp } from "../Firebase";
import { firestore } from "firebase";

const roles = Object.values(Roles);
type Role = typeof roles[number];

interface Card {
  player: string;
  role: Role;
  token: Role;
  previous: Role;
  clicks: {
    self: number;
    others: number;
  };
  swaps: {
    self: number;
    others: number;
  };
}

export interface Game {
  id: string;
  mode?: "evening" | "night" | "morning" | "end";
  roles?: {
    [key: string]: Card;
  };
}

export interface User {
  [key: string]: {
    name: string;
    active: boolean;
    admin?: boolean;
  };
}

type DocumentType = firestore.QueryDocumentSnapshot<firestore.DocumentData>;
const userReducer = (obj: User, item: DocumentType) => ({
  ...obj,
  [item.id]: {
    name: item.data().name,
    active: true,
    admin: item.data().admin
  }
});

function shuffle(array: Card[]) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default function useFetch(currentUser: firebase.User | undefined) {
  const [game, setGame] = React.useState<Game>({ id: "" });
  const [users, setUsers] = React.useState<User>({});

  React.useEffect(() => {
    firebaseApp
      .firestore()
      .collection("users")
      .onSnapshot(snapshot => setUsers(snapshot.docs.reduce(userReducer, {})));
  }, []);

  React.useEffect(() => {
    firebaseApp
      .firestore()
      .collection("games")
      .orderBy("time", "desc")
      .limit(1)
      .onSnapshot(snapshot => {
        const game = snapshot.docs[0];
        setGame({ id: game.id, ...game.data() });
      });
  }, []);

  const setToken = (token: string) => {
    if (!currentUser?.uid) return;
    const withNewToken = {
      roles: {
        [currentUser?.uid]: {
          token
        }
      }
    };
    updateGame(withNewToken);
  };

  const swapRoles = (p1: string, r1: Role, p2: string, r2: Role) => {
    if (!p1 || !p2 || !currentUser?.uid) return;
    const swapType =
      p1 === currentUser?.uid || p2 === currentUser?.uid ? "self" : "others";
    console.log({ swapType });
    if (swapType === "others") {
      return updateGame({
        roles: {
          [currentUser.uid]: {
            swaps: {
              others: 0
            }
          },
          [p1]: {
            previous: r1,
            role: r2
          },
          [p2]: {
            previous: r2,
            role: r1
          }
        }
      });
    }

    const withSwapedRoles = {
      roles: {
        [p1]: {
          previous: r1,
          role: r2
        },
        [p2]: {
          previous: r2,
          role: r1
        }
      }
    };
    const withSwaps = {
      ...withSwapedRoles,
      roles: {
        ...withSwapedRoles.roles,
        [currentUser.uid]: {
          ...withSwapedRoles.roles[currentUser.uid],
          swaps: { self: 0 }
        }
      }
    };
    updateGame(withSwaps);
  };
  const setGameStatus = (mode: "evening" | "night" | "morning" | "end") => {
    updateGame({ mode });
  };

  const updateGame = (obj: object) => {
    firebaseApp
      .firestore()
      .collection("games")
      .doc(game.id)
      .set(obj, { merge: true });
  };

  const createGame = async (playerIds: string[]) => {
    await firebaseApp
      .firestore()
      .collection("games")
      .add({
        players: playerIds
      });
  };

  const players = () => (game.roles ? Object.values(game.roles) : []);
  const cardWithMe = players().find(
    ({ player }) => player === currentUser?.uid
  );
  const myRole = cardWithMe ? cardWithMe.role : Roles.None;
  const cardsInCenter = players().filter(
    ({ player }) => player && player.indexOf("board") >= 0
  );
  const cardsWithFriends = players().filter(
    ({ player }) =>
      player && player.indexOf("board") < 0 && player !== currentUser?.uid
  );
  const cardsOnGame = shuffle(players().slice()).reduce(
    (prev: { [key: string]: number }, cur) => {
      prev[cur.role] = (prev[cur.role] || 0) + 1;
      return prev;
    },
    {}
  );

  const handleRevels = (
    type: "self" | "others",
    current: number,
    delta: number
  ) => () => {
    if (!currentUser?.uid) return;
    const withUpdates = {
      roles: {
        [currentUser.uid]: {
          clicks: {
            [type]: current - delta
          }
        }
      }
    };
    updateGame(withUpdates);
  };

  const handleSwaps = (type: "self" | "others", current: number) => () => {
    if (!currentUser?.uid) return;
    const withUpdates = {
      roles: {
        [currentUser.uid]: {
          swaps: {
            [type]: current - 1
          }
        }
      }
    };
    updateGame(withUpdates);
  };

  const isAdmin =
    currentUser && users[currentUser?.uid] && users[currentUser?.uid].admin;

  return {
    users,
    game,
    myRole,
    isAdmin,
    cards: {
      withMe: cardWithMe,
      withFriends: cardsWithFriends,
      inCenter: cardsInCenter,
      onGame: cardsOnGame
    },
    fns: {
      setToken,
      swapRoles,
      createGame,
      setGameStatus,
      handleRevels,
      handleSwaps
    }
  };
}
