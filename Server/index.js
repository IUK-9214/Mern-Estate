import express from 'express'


const app = express()


app.use(express())

app.get("/",(req,res)=>
{
    res.json({
        msg:"i m a get request and on home page "
    })
})

app.listen(5000,()=>{

    console.log("Hello I m listeing ....");
    
})

