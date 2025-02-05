create extension if none exist citext;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL primary key,
    email citext UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25),
    password text not null,
    email_verified boolean not null default false,
);