const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.get("/",(req,res)=>{
  res.send("hi");
});

async function connectDb(){
  await mongoose.connect("mongodb://localhost:27017",{
    dbName: "Logindb",
  });
}

app.post("/users",(req,res)=>{
  res.send("done");
})
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});