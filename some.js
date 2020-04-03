

const allRoles = {
    Villager: "Villager",
    Werewolf: "Werewolf",
    Seer: "Seer",
    Robber: "Robber",
    Troublemaker: "Troublemaker",
    Tanner: "Tanner",
    Drunk: "Drunk",
    Hunter: "Hunter",
    Mason: "Mason",
    Insomniac: "Insomniac",
    Minion: "Minion",
    Doppelgänger: "Doppelgänger"
  };

  const getRoles = total => {
    const four = [
      allRoles.Villager,
      allRoles.Villager,
      allRoles.Werewolf,
      allRoles.Seer
    ];
    const five = [...four, allRoles.Minion];
    const six = [...five, allRoles.Troublemaker];
    const seven = [...six, allRoles.Robber];
    const eight = [...seven, allRoles.Werewolf];
    const nine = [...eight, allRoles.Villager];
    const ten = [...nine, allRoles.Insomniac];
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
    const required = combinations[total - 1];
    shuffle(required);
    return required;
  };
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  
  const result = getRoles(3);
  console.log(result);
  