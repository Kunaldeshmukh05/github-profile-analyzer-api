const { pool } = require('../config/db');

/**
 * Inserts or updates a GitHub profile in the database.
 * Uses github_id as the unique key — re-analyzing the same user
 * overwrites the existing record with fresh data.
 */
const upsertProfile = async (profile) => {
  const sql = `
    INSERT INTO github_profiles (
      github_id, username, name, bio, avatar_url, profile_url,
      company, location, public_repos, followers, following,
      account_created_at, account_age_years, followers_to_repo_ratio,
      developer_popularity, analyzed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      username               = VALUES(username),
      name                   = VALUES(name),
      bio                    = VALUES(bio),
      avatar_url             = VALUES(avatar_url),
      profile_url            = VALUES(profile_url),
      company                = VALUES(company),
      location               = VALUES(location),
      public_repos           = VALUES(public_repos),
      followers              = VALUES(followers),
      following              = VALUES(following),
      account_created_at     = VALUES(account_created_at),
      account_age_years      = VALUES(account_age_years),
      followers_to_repo_ratio = VALUES(followers_to_repo_ratio),
      developer_popularity   = VALUES(developer_popularity),
      analyzed_at            = VALUES(analyzed_at),
      updated_at             = CURRENT_TIMESTAMP
  `;

  const values = [
    profile.github_id,
    profile.username,
    profile.name,
    profile.bio,
    profile.avatar_url,
    profile.profile_url,
    profile.company,
    profile.location,
    profile.public_repos,
    profile.followers,
    profile.following,
    profile.account_created_at,
    profile.account_age_years,
    profile.followers_to_repo_ratio,
    profile.developer_popularity,
    profile.analyzed_at,
  ];

  await pool.execute(sql, values);

  // Fetch and return the full saved record
  return findByGithubId(profile.github_id);
};

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM github_profiles ORDER BY analyzed_at DESC'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM github_profiles WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const findByGithubId = async (githubId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM github_profiles WHERE github_id = ?',
    [githubId]
  );
  return rows[0] || null;
};

module.exports = { upsertProfile, findAll, findById };
