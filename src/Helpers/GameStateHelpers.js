import store from "./../store.js";
import { setGameData, setGameState } from "./../Actions";
import { selectUnit, updateAnimations } from "./../GameStates";
import socket from "./../Components/SocketSettings.jsx";

export const resetToSelectUnitState = () => {
  store.dispatch(setGameState(selectUnit()));
  store.dispatch(
    setGameData({
      ...store.getState().gameData,
      actors: store.getState().gameData.actors.map(actor => {
        return {
          ...actor,
          onTarget: false,
          highlighted: false
        };
      })
    })
  );
};

export const updateAnimationPhase = actionList => {
  let action = actionList[0];

  store.dispatch(
    setGameData({
      ...store.getState().gameData,
      actors: store.getState().gameData.actors.map(actor => {
        if (action.actorId === actor.actorId) {
          return {
            ...actor,
            action
          };
        }

        return actor;
      })
    })
  );

  console.log("change state", actionList);
  store.dispatch(setGameState(updateAnimations(actionList.slice(1))));
};

export const assignAnimationToActor = () => {
  if (store.getState().gameState.actionList.length <= 0) {
    /*store.dispatch(
      setGameData(
        store.getState().gameData.actors.map(actor => {
          return {
            ...actor,
            action: undefined
          };
        }),
        store.getState().gameData.width,
        store.getState().gameData.height
      )
    );*/
    socket.emit("get-game-data", {
      gameId: "test"
    });

    // Change the following to opponent turn later:
    resetToSelectUnitState();
    return;
  }

  let action = store.getState().gameState.actionList[0];

  console.log("action: ", action);

  store.dispatch(
    setGameData({
      ...store.getState().gameData,
      actors: store.getState().gameData.actors.map(actor => {
        if (action.actorId === actor.actorId) {
          return {
            ...actor,
            action
          };
        }

        return actor;
      })
    })
  );

  let actionList = store.getState().gameState.actionList;
  store.dispatch(setGameState(updateAnimations(actionList.slice(1))));
};
