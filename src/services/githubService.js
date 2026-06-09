const axios = require('axios');
const { buildProfileInsights } = require('../utils/githubAnalyzer');
const githubRepository = require('../repositories/githubRepository');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetches raw user data from the GitHub Public API.
 * Throws a structured error on 404 (user not found) or other failures.
 */
const fetchGithubUser = async (username) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'github-profile-analyzer',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const notFound = new Error(`GitHub user '${username}' not found`);
      notFound.statusCode = 404;
      throw notFound;
    }

    const apiError = new Error('Failed to reach GitHub API. Please try again later.');
    apiError.statusCode = 502;
    throw apiError;
  }
};

/**
 * Full analyze flow:
 * 1. Fetch user from GitHub
 * 2. Compute insights
 * 3. Persist to DB
 * 4. Return the saved record
 */
const analyzeProfile = async (username) => {
  const githubUser    = await fetchGithubUser(username);
  const profileData   = buildProfileInsights(githubUser);
  const savedProfile  = await githubRepository.upsertProfile(profileData);
  return savedProfile;
};

const getAllProfiles = async () => {
  return githubRepository.findAll();
};

const getProfileById = async (id) => {
  const profile = await githubRepository.findById(id);
  if (!profile) {
    const notFound = new Error(`Profile with id '${id}' not found`);
    notFound.statusCode = 404;
    throw notFound;
  }
  return profile;
};

module.exports = { analyzeProfile, getAllProfiles, getProfileById };
