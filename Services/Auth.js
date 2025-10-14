const SessionIdToUserMap = new Map();

const setUser = (id, user) =>{
    SessionIdToUserMap.set(id, user);
}

const getUser = (id) =>{
    return SessionIdToUserMap.get(id)
}

module.exports = {
    setUser, getUser
}