import mongoose from "mongoose";
export async function connectBD(){
   await mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected successfully")
   }).catch((error)=>{
console.log("fail to connect to db",error.message)
   })
}