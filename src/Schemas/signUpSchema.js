import { z} from "zod" ; 

export const signupSchema = z.object({
    username : z.string().min(3 , "username must be at least 3 characters long") ,
    email : z.string().email("Invalid email address") ,
    password :z.string().min(6 , "password must be at least 6 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character") ,
}) ; 