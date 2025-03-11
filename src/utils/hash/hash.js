import bcrypt from "bcrypt"
export const hash=({data,saltRound=process.env.SALT_ROUND})=>{
    return bcrypt.hashSync(data,saltRound).toString()

}