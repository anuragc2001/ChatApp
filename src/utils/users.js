
const users = [];
const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room required'
        }
    }

    const existingUser = users.filter((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser.length > 0) {
        return {
            error: 'Username in use'
        }
    }


    const user = { id, username, room }
    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const User = users.filter((user) => {
        return user.id === id;
    })

    if (User.length === 0) {
        return undefined
    } else {
        return User[0];
    }
}

const getUsersInRoom = (room) => {
    const allUsers = users.filter((user) => {
        return user.room === room
    })

    if (allUsers.length === 0) {
        return [];
    } else {
        return allUsers;
    }

}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}