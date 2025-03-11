export const isAuthorized = (role,userExist) => {
    if (role != userExist.role ) {
        throw new Error("not allowed !" , {cause : 401})
    }
}