let currentActorId = 0;
let pos = { x: -999, y: -999 };
let newActorId = () => {
  currentActorId++;
  return currentActorId + "";
};
let dispatch = action => {
  if (action.type === "create-actor") {
    let newActor = {
      actorId: newActorId(),
      pos: { ...pos },
      actorType: "default",
      team: "none"
    };
    if (typeof action.pos === "object") {
      if (typeof action.pos.x === "number") {
        newActor.pos.x = action.pos.x;
      }
      if (typeof action.pos.y === "number") {
        newActor.pos.y = action.pos.y;
      }
    }
    if (typeof action.actorType === "string") {
      newActor.actorType = action.actorType;
    }
    return { success: true, type: "add-new", actor: newActor };
  }
  //______________________________________________________________________________
  if (action.type == "change-to-char") {
    if (typeof action.actorId !== "string") {
      return { success: false, err: "bad actor id: " + action.actorId };
    }
    let newCharProps = {
      charType: "default",
      actions: ["move"],
      static: false,
      team: "none",
      moveSpeed: 0,
      points: 0,
      range: 0
    };
    if (typeof action.range === "number") {
      newCharProps.range = action.range;
    }
    if (typeof action.charType === "string") {
      newCharProps.points = action.points;
    }
    if (typeof action.charType === "string") {
      newCharProps.charType = action.charType;
    }
    if (typeof action.actorType === "string") {
      newCharProps.actorType = action.actorType;
    }
    if (typeof action.actions === "object") {
      newCharProps.actions = action.actions;
    }
    if (typeof action.static === true || typeof action.static === false) {
      newCharProps.static = action.static;
    }
    if (typeof action.team === "string") {
      newCharProps.team = action.team;
    }
    if (typeof action.moveSpeed === "number") {
      newCharProps.moveSpeed = action.moveSpeed;
    }
    let keys = Object.keys(newCharProps);
    let charProps = keys.map(key => {
      return { prop: key, value: newCharProps[key] };
    });
    return {
      success: true,
      type: "edit-existing",
      actorId: action.actorId,
      edits: charProps
    };
  }
  //______________________________________________________________________________
  return { success: false };
};
module.exports = { dispatch };
