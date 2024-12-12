
const prisma = require('../models/prisma');


exports.createProgramme = async(req, res) =>{
  const { name, cohort, active,  startDate, endDate,} = req.body
    try{
      const programme= await prisma.programme.create({
      data: { name, cohort, active,  startDate, endDate} , 
    });
    res.json({message: "Programe created  with Cohort ", programme})
    } catch (error) {
        res.status(401).json({message: "Error cannot create cohort", programme})
    }
    }

    exports.getAllProgrammes= async(req, res) =>{
      const programme = await prisma.programme.findMany();
    }
    
    