-- this schema file is creating the table for the candidates

-- deletes the tables every time schema.sql file is ran
-- the order matters
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party
    FOREIGN KEY (party_id)
    REFERENCES parties(id)
    ON DELETE SET NULL
);

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
--   this keeps track of the date and time when a voter registers
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  voter_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
-- constraints to make voter id unique
  CONSTRAINT uc_voter UNIQUE (voter_id),
  -- the on delete cascade will delete the entire row if the reference key is deleted
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);