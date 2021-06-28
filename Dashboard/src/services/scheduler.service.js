import { projectDatabase } from "../firebase/firebase";

const db = projectDatabase.ref("/schedule");

const get = (key) => {
    return projectDatabase.ref("/schedule/" + key);
};

const getAll = () => {
    return db;
};

const create = (event) => {
    return projectDatabase.ref("/schedule/" + event.id).set(event)
};

const remove = (key) => {
    return db.child(key).remove();
};

const createId = () => {
    return Date.now(); 
}

export default {
    get,
    getAll,
    create,
    remove,
    createId
};
