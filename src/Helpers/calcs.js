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
    if (Math.abs(origin.y - dest.y)) {
      return true;
    }
  }
  if (origin.y === dest.y) {
    return true;
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
