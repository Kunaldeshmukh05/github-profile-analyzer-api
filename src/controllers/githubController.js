const githubService = require('../services/githubService');

const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username is required',
      });
    }

    if (typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'username must be a string',
      });
    }

    const profile = await githubService.analyzeProfile(username.trim());

    return res.status(200).json({
      success: true,
      message: 'Profile analyzed successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await githubService.getAllProfiles();

    return res.status(200).json({
      success: true,
      message: 'Profiles fetched successfully',
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Profile id must be a valid number',
      });
    }

    const profile = await githubService.getProfileById(Number(id));

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeProfile, getAllProfiles, getProfileById };
