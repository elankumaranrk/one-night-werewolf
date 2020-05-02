import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { DndProvider } from "react-dnd";
import MultiBackend, { Preview } from "react-dnd-multi-backend";
import "./App.css";
import { UserContext } from "./Authentication";
import Card from "./Card";
import CreateGame from "./CreateGame";
import { generatePreview, HTML5toTouch } from "./Dnd";
import useRemoteData from "./useRemoteData";
import Timer from "./Timer";

const defaultActions = {
  clicks: {
    self: 0,
    others: 0,
  },
  swaps: {
    self: 0,
    others: 0,
  },
};

export interface User {
  [key: string]: any;
}

function App() {
  const [canVote, setCanVote] = React.useState(false);
  const [timer, setTimer] = React.useState<Date | null>(null);
  const currentUser = React.useContext(UserContext);
  const { game, fns, cards, users, isAdmin } = useRemoteData(currentUser);

  React.useEffect(() => {
    if (game.mode === "morning" && !timer) {
      let fiveFromNow = new Date();
      const fiveMins = fiveFromNow.getMinutes() + 5;
      fiveFromNow.setMinutes(fiveMins);
      setTimer(fiveFromNow);
    } else if (game.mode !== "morning") {
      setTimer(null);
    }
  }, [game.mode, timer]);

  const { withMe } = cards;
  const { clicks, swaps } = withMe ? withMe : defaultActions;
  const cStatus  = clicks.others + clicks.self > 0 ? (clicks.others + clicks.self ) + ' revels' : undefined;
  const sStatus = swaps.self + swaps.others > 0 ? (swaps.self + swaps.others ) + ' swaps' : undefined;
  const stats = [cStatus, sStatus].filter(Boolean).join(' & ')
  

  return (
    <div className="flex-center" style={{ flexDirection: "column" }}>
      <div className="flex-wrap">
        <div className="flex-wrap" style={{ flexWrap: "nowrap" }}>
          <Button
            disabled={!isAdmin}
            style={{ margin: "8px", width: 80 }}
            color="secondary"
            variant={game.mode === "night" ? "contained" : "outlined"}
            onClick={() => fns.setGameStatus("night")}>
            Sleep
          </Button>
          <Button
            disabled={!isAdmin}
            style={{ margin: "8px", width: 120 }}
            variant={game.mode === "morning" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => fns.setGameStatus("morning")}>
            Wake Up
          </Button>
          <Button
            disabled={!isAdmin}
            style={{ margin: "8px", width: 90 }}
            color="secondary"
            variant={game.mode === "end" ? "contained" : "outlined"}
            onClick={() => fns.setGameStatus("end")}>
            End
          </Button>
          {isAdmin && <CreateGame onCreate={fns.createGame} />}
          <div className="timer">
            {timer && !canVote && (
              <Timer onEnd={() => setCanVote(true)} from={timer} />
            )}
            {canVote && game.mode === "morning" && <span>Vote Now!</span>}
          </div>
        </div>
      </div>
      {game.id && (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <Preview generator={generatePreview} />
          <div key={game.id} style={{ display: "flex", flexWrap: "wrap" }}>
            <div
              className="flex-center"
              style={{
                marginTop: "32px",
                flexDirection: "column",
              }}>
              <h2>Players</h2>
              
              <div className="flex-center">
                {cards.withMe && (
                  <Card
                    votes={cards.withMe.votes || 0}
                    selected={false}
                    order={1}
                    canVote={true}
                    swaps={swaps}
                    onRevel={fns.handleRevels("self", clicks.self, 1)}
                    mode={game.mode}
                    gameId={game.id}
                    playerId={cards.withMe.player}
                    swap={fns.swapRoles}
                    stack="owned"
                    disabled={
                      !(
                        game.mode === "evening" ||
                        (game.mode === "night" && clicks.self > 0)
                      )
                    }
                    key={currentUser?.uid}
                    token={cards.withMe?.token}
                    setToken={fns.setToken}
                    playerName={game.mode === "night" ? stats : 'You'}
                    role={cards.withMe.role}
                  />
                )}
                {cards.withFriends.map((card, idx) => (
                  <Card
                    canVote={true}
                    votes={card.votes || 0}
                    selected={cards.withMe?.suspected === card.player}
                    onVote={fns.castVote}
                    order={idx + 1}
                    swaps={swaps}
                    onRevel={fns.handleRevels("others", clicks.others, 2)}
                    mode={game.mode}
                    stack="friends"
                    gameId={game.id}
                    playerId={card.player}
                    swap={fns.swapRoles}
                    disabled={!(game.mode === "night" && clicks.others > 1)}
                    key={card.player}
                    token={card.token}
                    setToken={() => {}}
                    playerName={users[card.player].name}
                    role={card.role}></Card>
                ))}
              </div>
            </div>
          </div>

          <div
            className="flex-center"
            style={{
              marginTop: "32px",
              flexDirection: "column",
            }}>
            <div key={game.id + "onboard"} className="flex-center">
              <h2>On Board</h2>
              <div className="flex-center">
                {cards.inCenter.map((card, idx) => (
                  <Card
                    order={1 + cards.withFriends.length + idx}
                    swaps={swaps}
                    onRevel={fns.handleRevels("others", clicks.others, 1)}
                    disabled={!(game.mode === "night" && clicks.others > 0)}
                    gameId={game.id}
                    playerId={card.player}
                    swap={fns.swapRoles}
                    key={card.player}
                    token={card.token}
                    stack="center"
                    mode={game.mode}
                    setToken={() => {}}
                    playerName={card.player}
                    role={card.role}></Card>
                ))}
              </div>
            </div>
            <div
              className="flex-center"
              style={{
                flexDirection: "column",
                marginTop: "64px",
              }}>
              <h2>Game Cards</h2>
              <div>
                <List dense>
                  {Object.entries(cards.onGame).map(([key, value]) => (
                    <ListItem key={key} alignItems="center">
                      <ListItemAvatar>
                        <Avatar src={`images/cards/${key.toLowerCase()}.png`}>
                          --
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={`${key}`} />
                      <ListItemSecondaryAction>{value}</ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </DndProvider>
      )}
    </div>
  );
}

export default App;
