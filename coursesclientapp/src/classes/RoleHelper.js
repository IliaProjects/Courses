const ghostEnum = 3;
const directorEnum = 2;
const adminEnum = 1;
const userEnum = 0;

    const isInGhostRole = (e) => {
        return e == ghostEnum;
    }
    const isInDirectorRole = (e) => {
        return e == directorEnum || e == ghostEnum;
    }
    const isInAdminRole = (e) => {
        return e == adminEnum || e == directorEnum || e == ghostEnum;
    }
    const isInUserRole = (e) => {
        return e == userEnum || e == adminEnum || e == directorEnum || e == ghostEnum;
    }

    const isGhost = (e) => {
        return e == ghostEnum;
    }
    const isDirector = (e) => {
        return e == directorEnum;
    }
    const isAdmin = (e) => {
        return e == adminEnum;
    }
    const isUser = (e) => {
        return e == userEnum;
    }

    const getUserEnum = () => {
        return userEnum
    }

export { isInAdminRole, isInDirectorRole, isDirector, isAdmin, isUser, getUserEnum}