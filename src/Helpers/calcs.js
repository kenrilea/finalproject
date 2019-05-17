export const updatePosition = (start, end, mult) => {
  let newPos = {};

  /*newPos.x = (1 - mult) * start.x + mult * end.x;
  newPos.y = (1 - mult) * start.y + mult * end.y;*/
  newPos.x = start.x + mult * (end.x - start.x);
  newPos.y = start.y + mult * (end.y - start.y);

  if (Math.abs(newPos.x - end.x) < 0.5) {
    newPos.x = end.x;
  }
  if (Math.abs(newPos.y - end.y) < 0.5) {
    newPos.y = end.y;
  }

  return newPos;
};

export const updatePositionAtSpeed = (
  position,
  start,
  end,
  direction,
  distance,
  speed
) => {
  let newPos = {};

  newPos = {
    x: (position.x += direction.x * speed),
    y: (position.y += direction.y * speed)
  };

  if (getSquaredLengthBetweenPoints(start, position) >= distance) {
    newPos = {
      x: end.x,
      y: end.y
    };
  }

  return newPos;
};

export const wait = ms => {
  let startTime = new Date() / 1;
  let currentTime = startTime;
  while (currentTime < startTime + ms) {
    currentTime = new Date() / 1;
  }
};

// Returns the actorId of the tile which a
// given 'char' actor stands on.
export const getOccupiedTile = (charActor, actorList) => {
  actorList.filter(actor => {
    return (
      actor.actorType !== "char" &&
      actor.pos.x === charActor.pos.x &&
      actor.pos.y === charActor.pos.y
    );
  });

  return actorList[0].actorId;
};

// Get whether there is a 'char' actor in the
// same position as a given tile.
export const isTileOccupied = (tileActor, actorList) => {
  if (tileActor.actorType === "char") return false;
  let found = actorList.find(actor => {
    return (
      actor.actorType === "char" &&
      actor.pos.x === tileActor.pos.x &&
      actor.pos.y === tileActor.pos.y
    );
  });
  if (found === undefined) return false;
  return true;
};

export const radiansToDegrees = rad => {
  return (rad * 180) / Math.PI;
};

export const degreesBetweenPoints = (point1, point2) => {
  return radiansToDegrees(
    Math.atan2(-point1.x + point2.x, point1.y - point2.y)
  );
};

export const getSquaredLengthBetweenPoints = (start, end) => {
  return Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
};

export const normalizedDirectionBetweenPoints = (start, end) => {
  let length = getSquaredLengthBetweenPoints(start, end);
  return {
    x: (end.x - start.x) / length,
    y: (end.y - start.y) / length
  };
};

export const multiplyDirectionVector = (vector, mult) => {
  return {
    x: vector.x * mult,
    y: vector.y * mult
  };
};

export const getDistance = (origin, dest) => {
  let width = origin.x - dest.x;
  let length = origin.y - dest.y;
  if (length < 0) {
    length = length * -1;
  }
  if (width < 0) {
    width = width * -1;
  }
  width = width * width;
  length = length * length;

  let distance = width + length;
  distance = Math.round(Math.sqrt(distance));
  return distance;
};

export const isInRange = (range, origin, dest) => {
  let distance = getDistance(origin, dest);
  if (distance <= range) {
    return true;
  }
  return false;
};

export const lineRange = (range, origin, dest) => {
  if (
    Math.abs(origin.y - dest.y) > range ||
    Math.abs(origin.x - dest.x) > range
  ) {
    return false;
  }
  if (origin.x === dest.x) {
    return true;
  }
  if (origin.y === dest.y) {
    return true;
  }
  if (Math.abs(origin.y - dest.y) === Math.abs(origin.x - dest.x)) {
    return true;
  }
  return false;
};

export const lineTarget = (range, origin, dest) => {
  if (
    Math.abs(origin.y - dest.y) > range ||
    Math.abs(origin.x - dest.x) > range
  ) {
    return false;
  }
  if (origin.x === dest.x) {
    if (Math.abs(origin.y - dest.y) === range) {
      return true;
    }
  }
  if (origin.y === dest.y) {
    if (Math.abs(origin.x - dest.x) === range) {
      return true;
    }
  }
  if (Math.abs(origin.y - dest.y) === Math.abs(origin.x - dest.x)) {
    if (
      Math.abs(origin.y - dest.y) === range &&
      Math.abs(origin.x - dest.x) === range
    ) {
      return true;
    }
  }
  return false;
};
