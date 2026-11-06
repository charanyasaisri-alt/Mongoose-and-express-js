
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const port=process.env.PORT;
const mongouri=process.env.MONGO_URI;
const dbName=process.env.DB_NAME;
mongoose.connect(mongouri,{dbName:dbName})

.then(()=>{
    console.log("connected to mongodb");
})
.catch((err)=>{
    console.log("problem while connecting mongodb",err);
});
const movieSchema=new mongoose.Schema({
    title:{ type:String,required:true },
    director:String,
    category:{type:String,required:true},
    year:{type:Number,required:true},
});
const movie=mongoose.model("movie",movieSchema);
const app=express();
app.use(express.json());
app.post("/api/v1/movies",(req,res)=>{
    const newmovie=req.body;
    movie.create(newmovie)
    .then((result)=>{
        res.status(201).json({message:"movie created",data:result});
    })
        .catch((err)=>{
            err.message="movie creation failed";
            throw err;
        });
    
});
app.get("/api/v1/movies",(req,res)=>{
    const {category}=req.query;
    const query=category?{category}:{};
    movie.find(query)
    .then((result)=>{
        res.status(200).json({message:"movies reterived succesfully",
            data: result
        });
    })
    .catch((err)=>{
        err.message="movie retervied failed";
        throw err;
    });
});
app.get("/api/v1/movies/:id",(req,res)=>{
    const{id}=req.params;
    movie.findById(id)
    .then((result)=>{
        if(result){
            res.status(200).json({message:"movie details retervied succesfully",data:result});
        }else{
            res.status(404).json({message:"movie not found"});
        }
    })
    .catch((err)=>{
        res.status(500).json("movie fetched faild");
    });
});
app.put("/api/v1/movies/:id",(req,res)=>{
    const id=req.params.id;
    const updatedmovie=req.body;
    movie.findByIdAndUpdate(id,updatedmovie,{new:true})
    .then((result) =>{
        if(result){
            res.status(200).json({message:"movie details updated succesfully",data:result});
        }else{
            res.status(404).json({message:"movie not found"});
        }
    })
    .catch((err)=>{
        res.status(500).json("movie updated failed");
    });
});

app.delete("/api/v1/movies/:id",(req,res)=>{
    const{id}=req.params;
    movie.findByIdAndDelete(id)
    .then((result)=>{
        if(result){
            res.status(200).json({message:"movies delete succesfully",data:result});
        }else{
            res.status(404).json({message:"movies not found"});
        }
    })
    .catch((err)=>{
        res.status(500).json({message:"movie deleted failed"});
    });
});

app.get("/",(req,res)=>{
    res.status(200).json("movies api server running");
});
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
});

//{
 // "title": "RRR Updated",
  //"director": "S. S. Rajamouli",
  //"category": "Action",
  //"year": 2023
//}
//http://localhost:5000/api/v1/movies