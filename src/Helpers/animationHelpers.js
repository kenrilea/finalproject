export const animationIds = [];

export const cancelAllAnimations = () => {
  animationIds.forEach(id => {
    cancelAnimationFrame(id);
  });
  animationIds = [];
};

export const pushNewAnimation = id => {
  animationIds.push(id);
  return id;
};
