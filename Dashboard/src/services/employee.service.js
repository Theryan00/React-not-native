import { projectDatabase } from "../firebase/firebase";

const db = projectDatabase.ref("/employees");

const getAll = () => {
  return db;
};

//Dirty way to do this 
const getTimeEpoch = () => {
    return new Date().getTime().toString();                             
}

const create = (employeeItem,id) => {
  return db.child(id).set(employeeItem);
  //return db.push(employeeItem);
};

const update = (employeeItem) => {
  return db.set(employeeItem);
};

export default {
  getAll,
  create,
  update,
};
