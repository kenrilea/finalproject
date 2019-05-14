import store from "./../store.js";
import { setGameData, setGameState } from "./../Actions";
import { selectUnit, selectTile } from "./../GameStates";

export const resetToSelectUnitState = () => {
  store.dispatch(setGameState(selectUnit()));
  store.dispatch(
    setGameData(
      store.getState().gameData.actors.map(actor => {
        return {
          ...actor,
          highlighted: false
        };
      }),
      store.getState().gameData.width,
      store.getState().gameData.height
    )
  );
};
