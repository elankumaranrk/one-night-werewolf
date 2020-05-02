"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");

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
const allRoles = {
  Villager: {
    name: "Villager",
    ...defaultActions
  },
  Werewolf: {
    name: "Werewolf",
    ...defaultActions
  },
  Seer: {
    name: "Seer",
    ...defaultActions,
    clicks: {
      ...defaultActions.clicks,
      others: 2
    }
  },
  Robber: {
    name: "Robber",
    ...defaultActions,
    swaps: {
      ...defaultActions.swaps,
      self: 1
    },
    clicks: {
      ...defaultActions.clicks,
      self: 1
    }
  },
  Troublemaker: {
    name: "Troublemaker",
    ...defaultActions,
    swaps: {
      ...defaultActions.swaps,
      others: 1
    }
  },
  Tanner: {
    name: "Tanner",
    ...defaultActions
  },
  Drunk: {
    name: "Drunk",
    ...defaultActions,
    swaps: {
      ...defaultActions.swaps,
      self: 1
    }
  },
  Hunter: {
    name: "Hunter",
    ...defaultActions
  },
  Mason: {
    name: "Mason",
    ...defaultActions
  },
  Insomniac: {
    name: "Insomniac",
    ...defaultActions,
    clicks: {
      ...defaultActions.clicks,
      self: 1
    }
  },
  Minion: {
    name: "Minion",
    ...defaultActions
  },
  Doppelganger: {
    name: "Doppelganger",
    ...defaultActions
  }
};

admin.initializeApp();

exports.createUsersOnRegistration = functions.auth.user().onCreate(user => {
  const initials = user.displayName.match(/\b\w/g) || [];
  const names = user.displayName.split(" ");
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      id: user.uid,
      name: names.shift() || user.email,
      initials: (
        (initials.shift() || "") + (initials.pop() || "")
      ).toUpperCase(),
      fullName: user.displayName,
      points: 0,
      email: user.email,
      photo: user.photoURL,
      push: null
    });
});

const getRoles = total => {
  const four = [
    allRoles.Villager,
    allRoles.Werewolf,
    allRoles.Werewolf,
    allRoles.Seer
  ];
  const five = [...four, allRoles.Minion];
  const six = [...five, allRoles.Troublemaker];
  const seven = [...six, allRoles.Robber];
  const eight = [...seven, allRoles.Villager];
  const nine = [...eight, allRoles.Insomniac];
  const ten = [...nine, allRoles.Villager];
  const eleven = [...ten, allRoles.Tanner];
  const twelve = [...ten, allRoles.Mason, allRoles.Mason];
  const thirteen = [...twelve, allRoles.Tanner];
  const fourteen = [...thirteen, allRoles.Doppelgänger];

  const combinations = [
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    eleven,
    twelve,
    thirteen,
    fourteen
  ];
  let required = combinations[total - 1];
  shuffle(required);
  return required;
};

function shuffle(array) {
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

exports.sendNotifications = functions.firestore
  .document("games/{gameId}")
  .onCreate((snapshot, context) => {
    const players = shuffle(snapshot.data().players);
    let roles = getRoles(players.length)
      .map((role, idx) => {
        return idx < 3
          ? { role: role.name, ...role, player: "board-" + idx }
          : {
              role: role.name,
              ...role,
              player: players[idx - 3],
              token: "None"
            };
      })
      .reduce((acc, cur) => ({ ...acc, [cur.player]: cur }), {});

    if (
      Object.values(roles)
        .filter(r => r.role === allRoles.Werewolf.name)
        .filter(r => r.player.indexOf("board") < 0).length === 1
    ) {
      const thatOneWereWolf = Object.values(roles).find(
        r => r.role === allRoles.Werewolf.name && r.player.indexOf("board") < 0
      );
      thatOneWereWolf.clicks = {
        self:0,
        others: 1
      };
      roles = { ...roles, [thatOneWereWolf.player]: thatOneWereWolf };
    }
    snapshot.ref.set({
      roles,
      mode: "evening",
      time: new Date()
    });
  });


  // exports.onUserStatusChanged = functions.database.ref('/status/{uid}').onUpdate(
  //   async (change, context) => {
  //     // Get the data written to Realtime Database
  //     const eventStatus = change.after.val();

  //     // Then use other event data to create a reference to the
  //     // corresponding Firestore document.
  //     const userStatusFirestoreRef = admin.firestore().doc(`users/${context.params.uid}`);

  //     // It is likely that the Realtime Database change that triggered
  //     // this event has already been overwritten by a fast change in
  //     // online / offline status, so we'll re-read the current data
  //     // and compare the timestamps.
  //     const statusSnapshot = await change.after.ref.once('value');
  //     const status = statusSnapshot.val();
  //     console.log(status, eventStatus);
  //     // If the current timestamp for this data is newer than
  //     // the data that triggered this event, we exit this function.
  //     if (status.last_changed > eventStatus.last_changed) {
  //       return null;
  //     }

  //     // Otherwise, we convert the last_changed field to a Date
  //     eventStatus.last_changed = new Date(eventStatus.last_changed);

  //     // ... and write it to Firestore.
  //     return userStatusFirestoreRef.set(eventStatus, { merge: true });
  //   });