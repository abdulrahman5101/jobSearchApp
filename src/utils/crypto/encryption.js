
import CryptoJS from "crypto-js"
export const encrypt=({data,key=process.env.CRYPTO_KEY})=>{
return CryptoJS.AES.encrypt(data,key).toString()
}