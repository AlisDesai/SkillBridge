// /controllers/skillController.js
const Skill = require("../models/Skill");

// Add a new skill
exports.addSkill = async (req, res, next) => {
  try {
    const { name, category, subcategory, description } = req.body;
    const skill = await Skill.create({
      name,
      category,
      subcategory,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
};

// Get all skills
exports.getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    next(err);
  }
};
