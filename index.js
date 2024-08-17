

import Express from "express";

import bodyParser from "body-parser";

import mongoose from "mongoose";

import cors from "cors";


const app=Express();



app.use(cors());
//to add body parser middleware to access data comes alobg with request like post,put,patch 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




//establishing a connection to mongodb database
try {
    mongoose.connect('mongodb+srv://shubhammayanepaypal:Shubham1122@cluster0.q6nrdxs.mongodb.net/UserDatabase');
  } catch (error) {
    console.log(error);
    
  }

const objectSchema=new mongoose.Schema({

    name:String,
    dateOfBirth:String,
    createdUserDate:String,
    userName:String,
    password:String,
    status:String, 
    role:String,      
});


const myUserCollectionModel=mongoose.model("UserCollection",objectSchema);


// const myData=new myUserCollectionModel({
//     name:"Shubham",
//     dateOfBirth:"11/08/1997",
//     createdUserDate:"11/08/1997",
//     userName:"Shubham Mayane",
//     password:"12345", 
// });

// //inserting above document in Fruit collection
// myData.save();



const port =process.env.PORT || 5000;



app.listen(port,function(){

    console.log("Server is running at port "+port);
    
});

app.get("/",function(req,res){


    res.send("Jay ganesh");
})


app.post("/checkUser",function(req,res){

    console.log("inisde check user");
    

    myUserCollectionModel.findOne({userName:req.body.username,password:req.body.password}).then(function(data) {

        console.log(data);

        if(data==null)
        {       //user is not valid 
                res.json({
                    title:"userExistStatus",
                    status:false
                });
        }
        else
        {   
            //user is valid
            res.json({
                title:"userExistStatus",
                status:true
            });

        }
    }).catch(function (err) {
        console.log(err);
        res.send({
            status:err
        })
      });
});

app.post("/insertUser",function(req,res){

    console.log("inside insertUser");
    

    // console.log(req.body);
    
    // console.log(req.body.fullname);
    
    const userObj=new myUserCollectionModel({

        name:req.body.fullname,
        dateOfBirth:req.body.dob,
        createdUserDate:new Date(),
        userName:req.body.emailid,
        password:req.body.password, 
        status:"Active",
        role:req.body.role
    });

    
   userObj.save().then((doc) => {
    console.log('Document saved:', doc);
    res.json(
        {   title:"userInsertStatus",
            status:true
        });
  })
  .catch((err) => {
    console.error('Error saving document:', err);
  });


});



app.get("/getAllUsers",function(req,res){

    myUserCollectionModel.find({}).then(function(data) {

        console.log(data);
        res.json(data);
    }).catch(function (err) {
        console.log(err);
      });
});


app.get("/getUserById/:id",function(req,res){

    console.log("inside getUserById");
    
    myUserCollectionModel.find({_id:req.params.id}).then(function(data) {

        console.log(data);
        res.json(data);
    }).catch(function (err) {
        console.log(err);
      });
});


app.put("/updateUser/:id",function(req,res){

    let user=req.body;
    let id=req.params.id;

    console.log("inisde update user");
    console.log(user);
    console.log(id);
    
    
    


        myUserCollectionModel.updateOne({_id:id},{$set:{
            name:user.fullname,
            dateOfBirth:user.dob,
            createdUserDate:new Date(),
            userName:user.emailid,
            password:user.password, 
            status:user.status,
            role:user.role
        }}).then(function(){
        console.log("Data is updated Successfully");
        res.json({
            status:true
        });
        }).catch(function(err){
        console.log(err);
        res.json({
            status:false
        })
        });
});



app.delete("/deleteUser/:id",async function(req,res){


   
  try {
    const status = await myUserCollectionModel.findByIdAndDelete(req.params.id);

    console.log(status);

    if(status==null)
    {
      console.log("Data is not found in database");
      res.json({
        message:"user is not found in database",
        status:false

      })
    }
    else
    {
      console.log("Data is successfully deleted");
      res.json({
        message:"user is deleted from database",
        status:true

      });
    }
    
  } catch (error) {
    console.log(error);
    res.json({
        message:"Error",
        status:false

      });
  }
});


