const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../models/projectModel");

/* Create Project */

router.post("/", async (req,res)=>{

  try{

    const userId = req.session.userId;

    if(!userId){
      return res.status(401).json({error:"Login required"});
    }

    const { name, environment } = req.body;

    const project = await createProject(userId,name,environment);

    res.json(project);

  }catch(err){

    console.error(err);
    res.status(500).json({error:"Failed to create project"});

  }

});

/* Get Projects */

router.get("/", async (req,res)=>{

  try{

    const userId = req.session.userId;

    if(!userId){
      return res.status(401).json({error:"Login required"});
    }

    const projects = await getProjects(userId);

    res.json(projects);

  }catch(err){

    console.error(err);
    res.status(500).json({error:"Failed to load projects"});

  }

});
router.put("/:id", async (req,res)=>{

 try{

  const userId = req.session.userId;

  if(!userId){
    return res.status(401).json({error:"Login required"});
  }

  const { name, environment } = req.body;

  const project = await updateProject(
    req.params.id,
    name,
    environment
  );

  res.json(project);

 }catch(err){
  console.error(err);
  res.status(500).json({error:"Update failed"});
 }

});

router.delete("/:id", async (req,res)=>{

 try{

  const userId = req.session.userId;

  if(!userId){
    return res.status(401).json({error:"Login required"});
  }

  await deleteProject(req.params.id);

  res.json({message:"Project deleted"});

 }catch(err){
  console.error(err);
  res.status(500).json({error:"Delete failed"});
 }

});

module.exports = router;