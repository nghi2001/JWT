import express from 'express';
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
import {verifyToken} from './middlewares/verifyToken'
import { Request,Response } from 'express';
import { User } from './interfaces/User';
const app = express();

app.use(express.json())
dotenv.config()

let users: User[] = [
    {
        id: 1,
        name: 'duy',
        refreshToken:  null
    },
    {
        id: 2,
        name: 'nghi',
        refreshToken: null
    }
]

const generateToken = (user:User) => {
    const {id,name} = user;
    //Create access Token
    const accessToken = jwt.sign({id,name}, process.env.SECRET_ACCESS_TOKEN as Secret,{
        expiresIn : '2m'
    })
    //Create refresh token
    const refreshToken = jwt.sign({id,name}, process.env.SECRET_REFRESH_TOKEN as Secret,{
        expiresIn: '10m'
    })

    return {
        accessToken,
        refreshToken
    }
}

const updateRefreshToken = (username: string, refreshToken: string|null) => {
    users = users.map( user => {
        if ( user.name === username ) {
            return {
                ...user,
                refreshToken
            }

        }
            return user
        
    })
}
app.post('/login', (req:Request,res:Response) => {
    console.log(req.body);
    
    const username = req.body.username;
    const user = users.find(user => user.name === username);
    if( !user ) return res.sendStatus(401)

    const token = generateToken(user);
    updateRefreshToken(user.name,token.refreshToken);
    
    // console.log(token);
    console.log(users);

    res.json(token)
})


app.post('/token', (req:Request,res:Response) => {
    
    const refreshToken = req.body.refreshToken;

    if( !refreshToken ) return res.sendStatus(401);

    const user = users.find(user => user.refreshToken === refreshToken);

    if( !user ) return res.sendStatus(401);

    try {

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN as Secret);

        const token = generateToken(user);
        updateRefreshToken(user.name,token.refreshToken);

        res.json(token)
        
    } catch (error) {
        console.log( error );
        res.sendStatus(403)
    }
})


app.get('/all', (req:Request,res:Response) => {
    console.log(users);

    return res.json('')
})

app.delete('/logout', verifyToken ,(req:Request,res:Response) => {
    const user:User|undefined = users.find(user => user.id === req.user.id);
    
    if( user ) {
        updateRefreshToken(user.name, null )
    }
    
	res.sendStatus(204)
})

app.listen(3500, () => {
    console.log(`server running at port 3500`);
})