const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { createUser, findUser } = require("../models/userModel");

router.post("/register", async (req, res) => {

 try {

   const { username, password } = req.body;

   const hash = await bcrypt.hash(password, 10);

   const user = await createUser(username, hash);

   res.json(user);

 } catch (err) {

   if(err.code === "23505"){
     return res.status(400).json({error:"Username already exists"});
   }

   console.error(err);
   res.status(500).json({error:"Registration failed"});
 }

});

router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await findUser(username);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.userId = user.id;

    res.json({ message: "Login successful" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Login failed" });

  }

});

router.get("/session",(req,res)=>{

  if(req.session.userId){
    return res.json({logged:true});
  }

  return res.status(401).json({logged:false});

});

router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await findUser(username);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.userId = user.id;

    req.session.save(() => {
      res.json({ message: "Login successful" });
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Login failed" });

  }

});
router.post("/logout",(req,res)=>{

  req.session.destroy((err)=>{

    if(err){
      console.error("Logout error",err);
      return res.status(500).json({error:"Logout failed"});
    }

    res.clearCookie("devboard.sid");

    res.json({message:"Logged out successfully"});

  });

});
module.exports = router;