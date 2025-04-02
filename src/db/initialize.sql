CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users(
    id serial PRIMARY KEY,
    email citext UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25),
    password text NOT NULL,
    email_verified boolean NOT NULL DEFAULT FALSE,
);

CREATE TABLE IF NOT EXISTS wav_file(
    wav_id serial PRIMARY KEY,
    file_name varchar(255) NOT NULL,
    creation_date integer DEFAULT extract(epoch FROM now()) NOT NULL,
    duration integer NOT NULL,
    -- user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    format text NOT NULL,
);

CREATE TABLE wav_metadata(
    id int AUTO_INCREMENT PRIMARY KEY,
    file_name varchar(255) NOT NULL,
    title varchar(255),
    artist varchar(255),
    album varchar(255),
    genre varchar(100),
    duration int, -- Duration in seconds
    sample_rate int, -- Sample rate in Hz
    bit_depth int, -- Bit depth of the audio
    file_size int, -- File size in bytes
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified_date DATETIME ON UPDATE CURRENT_TIMESTAMP,
    comments text
);

CREATE TABLE IF NOT EXISTS tokens(
    hash text PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry integer NOT NULL,
    scope text NOT NULL
);

