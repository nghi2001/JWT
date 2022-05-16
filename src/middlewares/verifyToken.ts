import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import { Secret } from 'jsonwebtoken';


export const verifyToken = ( req:Request,res:Response,next:NextFunction) => {
    const Authorozation = req.header("Authorization")

    const token = Authorozation && Authorozation.split(' ')[1];
    if( !token ) return res.status(401).json('ko co auth');
    console.log(token);
    
    try {
        let decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as Secret);
        console.log(decode);
        req.user = decode
        next()

    } catch (error) {
        console.log(error);
        res.status(403).json("Forbiden")
    }
}
