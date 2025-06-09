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

// Add to teachSkills (User only)
exports.addTeachSkill = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Skill name and level required" });
    }

    // Avoid duplicates
    const exists = req.user.teachSkills.find((s) => s.name === name);
    if (exists) {
      return res.status(400).json({ message: "Skill already added" });
    }

    req.user.teachSkills.push({ name, level });
    await req.user.save();

    res.status(200).json({ teachSkills: req.user.teachSkills });
  } catch (err) {
    next(err);
  }
};

// Add to learnSkills
exports.addLearnSkill = async (req, res, next) => {
  try {
    const { name, level } = req.body;
    if (!name || !level) {
      return res.status(400).json({ message: "Skill name and level required" });
    }

    const exists = req.user.learnSkills.find((s) => s.name === name);
    if (exists) {
      return res.status(400).json({ message: "Skill already added" });
    }

    req.user.learnSkills.push({ name, level });
    await req.user.save();

    res.status(200).json({ learnSkills: req.user.learnSkills });
  } catch (err) {
    next(err);
  }
};

// Remove from learnSkills
exports.removeLearnSkill = async (req, res, next) => {
  try {
    const { name } = req.params;

    req.user.learnSkills = req.user.learnSkills.filter((s) => s.name !== name);
    await req.user.save();

    res.status(200).json({ learnSkills: req.user.learnSkills });
  } catch (err) {
    next(err);
  }
};

// Remove teach skill
exports.removeTeachSkill = async (req, res, next) => {
  const { name } = req.params;
  req.user.teachSkills = req.user.teachSkills.filter((s) => s.name !== name);
  await req.user.save();
  res.status(200).json({ teachSkills: req.user.teachSkills });
};
