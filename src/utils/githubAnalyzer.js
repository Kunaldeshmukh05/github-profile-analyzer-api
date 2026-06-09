/**
 * Calculates the number of complete years since the GitHub account was created.
 * @param {string} createdAt - ISO date string from GitHub API
 * @returns {number}
 */
const calculateAccountAge = (createdAt) => {
  const createdYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - createdYear;
};

/**
 * Calculates the ratio of followers to public repositories.
 * Returns 0 if the user has no public repositories (avoids division by zero).
 * @param {number} followers
 * @param {number} publicRepos
 * @returns {number}
 */
const calculateFollowersToRepoRatio = (followers, publicRepos) => {
  if (publicRepos === 0) return 0;
  return parseFloat((followers / publicRepos).toFixed(2));
};

/**
 * Determines developer popularity tier based on follower count.
 * @param {number} followers
 * @returns {'Popular' | 'Growing'}
 */
const determineDeveloperPopularity = (followers) => {
  return followers > 100 ? 'Popular' : 'Growing';
};

/**
 * Accepts raw GitHub API user data and returns a structured insights object
 * ready for database insertion.
 * @param {object} githubUser - Raw user object from GitHub API
 * @returns {object}
 */
const buildProfileInsights = (githubUser) => {
  const accountAgeYears         = calculateAccountAge(githubUser.created_at);
  const followersToRepoRatio    = calculateFollowersToRepoRatio(githubUser.followers, githubUser.public_repos);
  const developerPopularity     = determineDeveloperPopularity(githubUser.followers);

  return {
    github_id:                githubUser.id,
    username:                 githubUser.login,
    name:                     githubUser.name       || null,
    bio:                      githubUser.bio        || null,
    avatar_url:               githubUser.avatar_url || null,
    profile_url:              githubUser.html_url,
    company:                  githubUser.company    || null,
    location:                 githubUser.location   || null,
    public_repos:             githubUser.public_repos,
    followers:                githubUser.followers,
    following:                githubUser.following,
    account_created_at:       new Date(githubUser.created_at),
    account_age_years:        accountAgeYears,
    followers_to_repo_ratio:  followersToRepoRatio,
    developer_popularity:     developerPopularity,
    analyzed_at:              new Date(),
  };
};

module.exports = { buildProfileInsights };
