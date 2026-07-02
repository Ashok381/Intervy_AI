import {z} from "zod" ; 

export const signInSchema = z.object({
    identifier : z.string("email or username is required") ,
    password : z.string("password is required") 
})