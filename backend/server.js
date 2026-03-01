import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT;

app.use(cors());
// app.use(bodyParser);
app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.send("Home page");
})
app.post('/login',(req,res)=>{
    console.log(req.body);
    res.send("welcome to home page");
})

app.post('/register',(req,res)=>{
    console.log(req.body);
    res.send({msg:"Successfully Registered...."})
})
app.use((req,res)=>{
    res.send('<h1>404 Not Found</h1>');
});
app.listen(PORT,(req,res)=>{
    console.log(`server is runing on port ${PORT}`);
});