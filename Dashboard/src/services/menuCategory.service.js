import { projectDatabase } from "../firebase/firebase";

const db = projectDatabase.ref("/menuCategories");

const getAll = () => {
  return db;
};

const create = (menuCategory) => {
  return db.push(menuCategory);
};

const update = (key, data) => {
  return db.update({[key]: data});
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
