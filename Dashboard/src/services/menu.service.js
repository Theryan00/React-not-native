import { projectDatabase } from "../firebase/firebase";

const db = projectDatabase.ref("/menuItems");

const getAll = () => {
  return db;
};

const create = (menuItem) => {
  return db.push(menuItem);
};

const update = (key, data) => {
  return db.child(key).update(data);
};

const remove = (key) => {
  return db.child(key).remove();
};

export default {
  getAll,
  create,
  update,
  remove,
};
