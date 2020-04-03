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

const defaultActions = {
  clicks: {
    self: 0,
    others: 0
  },
  swaps: {
    self: 0,
    others: 0
  }
};

export interface User {
  [key: string]: any;
}

function App() {
  const currentUser = React.useContext(UserContext);
  const { game, fns, cards, users, isAdmin } = useRemoteData(currentUser);

  const { withMe } = cards;
  const { clicks, swaps } = withMe ? withMe : defaultActions;

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
        </div>
      </div>
      {game.id && (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <Preview generator={generatePreview} />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div
              className="flex-center"
              style={{
                marginTop: "32px",
                flexDirection: "column"
              }}>
              <h2>Players</h2>
              <div className="flex-center">
                {cards.withMe && (
                  <Card
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
                    playerName={users[cards.withMe?.player].name}
                    role={cards.withMe.role}
                  />
                )}
                {cards.withFriends.map(card => (
                  <Card
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
              flexDirection: "column"
            }}>
            <div className="flex-center">
              <h2>On Board</h2>
              <div className="flex-center">
                {cards.inCenter.map(card => (
                  <Card
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
                marginTop: "64px"
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
