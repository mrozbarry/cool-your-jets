export const make = () => ({
  items: [],
  pendingRemoval: [],
});

export const handleRemovals = (world, collection) => {
  for(const body of collection.pendingRemoval) {
    world.removeBody(body);
  }
  return {
    ...collection,
    pendingRemoval: [],
  };
};

export const add = (item, world, collection) => {
  world.addBody(item.body);
  return {
    ...collection,
    items: collection.items.concat(item),
  };
};

export const removeByBody = (body, collection) => {
  const index = collection.items.findIndex(i => i.body === body);
  if (index === -1) return collection;

  const item = collection[index];

  return {
    ...collection,
    items: collection.items.filter((_, idx) => idx !== index),
    pendingRemoval: collection.pendingRemoval.concat(item),
  };
};
