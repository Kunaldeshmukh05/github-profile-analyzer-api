-- GitHub Profile Analyzer - Database Schema

CREATE TABLE IF NOT EXISTS github_profiles (
  id INT NOT NULL AUTO_INCREMENT,

  github_id BIGINT NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,

  name VARCHAR(200) DEFAULT NULL,
  bio TEXT DEFAULT NULL,

  avatar_url VARCHAR(500) DEFAULT NULL,
  profile_url VARCHAR(500) NOT NULL,

  company VARCHAR(200) DEFAULT NULL,
  location VARCHAR(200) DEFAULT NULL,

  public_repos INT NOT NULL DEFAULT 0,
  followers INT NOT NULL DEFAULT 0,
  following INT NOT NULL DEFAULT 0,

  account_created_at DATETIME NOT NULL,
  account_age_years INT NOT NULL DEFAULT 0,

  followers_to_repo_ratio DECIMAL(10,2) NOT NULL DEFAULT 0.00,

  developer_popularity ENUM('Popular', 'Growing')
    NOT NULL DEFAULT 'Growing',

  analyzed_at DATETIME NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  INDEX idx_username (username),
  INDEX idx_github_id (github_id),
  INDEX idx_analyzed_at (analyzed_at)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;