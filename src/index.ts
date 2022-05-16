import express from 'express';
import dotenv from 'dotenv';
import {Post} from './interfaces/Post'
import jwt from 'jsonwebtoken';
import {verifyToken} from './middlewares/verifyToken'
import { Request,Response } from 'express';
const app = express();

dotenv.config()

app.use( express.json() );
app.use( express.urlencoded({
    extended: true
}) );
const posts: Post[] = [
    {
        id:1,
        post: 'nghi post'
    },
    {
        id:2,
        post: 'duy post'
    },
    {
        id:1,
        post: 'nghi post'
    }
]
app.get('/a', (req: Request, res) => {
    res.json('ja')
})
app.get('/',verifyToken, (req: Request,res: Response) => {

    let result = posts.filter(post => post.id === req.user.id)
    return res.json(result)

})

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
    console.log("server runing at port "+PORT);
});