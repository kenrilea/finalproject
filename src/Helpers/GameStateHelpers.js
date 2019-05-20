import store from "./../store.js";
import { setGameData, setGameState } from "./../Actions";
import { selectUnit, opponentTurn, updateAnimations } from "./../GameStates";
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
          highlighted: false,
          occupiedByEnemy: false
        };
      })
    })
  );
};

export const goToOpponentState = () => {
  store.dispatch(setGameState(opponentTurn()));
  store.dispatch(
    setGameData({
      ...store.getState().gameData,
      actors: store.getState().gameData.actors.map(actor => {
        return {
          ...actor,
          onTarget: false,
          highlighted: false,
          occupiedByEnemy: false
        };
      })
    })
  );
};

export const updateAnimationPhase = actionList => {
  let action = actionList[0];

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

  console.log("change state", actionList);
  store.dispatch(setGameState(updateAnimations(actionList.slice(1))));
};

export const assignAnimationToActor = () => {
  setTimeout(() => {
    if (store.getState().gameState.actionList === undefined) return;

    if (store.getState().gameState.actionList.length <= 0) {
      socket.emit("get-game-data", {
        gameId: store.getState().currentLobbyId
      });
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
    console.log("change state", actionList);
    store.dispatch(setGameState(updateAnimations(actionList.slice(1))));
  }, 200);
};
