import { projectDatabase } from "../firebase/firebase";

const db = projectDatabase.ref("/inventory");

const get = (key) => {
  return projectDatabase.ref("/inventory/" + key);
};

const getAll = () => {
  return db;
};

const create = (inventoryItem) => {
  return db.push(inventoryItem);
};

const update = (key, data) => {
  return db.child(key).update(data);
};

const remove = (key) => {
  return db.child(key).remove();
};

export default {
  get,
  getAll,
  create,
  update,
  remove,
};
