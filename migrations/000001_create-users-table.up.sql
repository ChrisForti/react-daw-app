CREATE EXTENSION citext;

CREATE TABLE users(
    id serial PRIMARY KEY,
    email citext UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25),
    password text NOT NULL,
    email_verified boolean NOT NULL DEFAULT FALSE
);

