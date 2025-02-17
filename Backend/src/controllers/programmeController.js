
const prisma = require('../models/prisma');
const logger = require('../utils/logger'); 

exports.createProgramme = async(req, res) =>{
  const { name, description, active,  startDate, endDate,} = req.body
    try{
      const programme= await prisma.programme.create({
      data: { name, description, active,  startDate, endDate} , 
    });
    res.json({message: "Programe created  with description ", programme})
    } catch (error) {
        res.status(401).json({message: "Error cannot create description", programme})
    }
    }

    exports.getAllProgrammes= async(req, res) =>{
      const programme = await prisma.programme.findMany();
    }
    
    