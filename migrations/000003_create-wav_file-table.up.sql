CREATE TABLE IF NOT EXISTS wav_file(
    id serial PRIMARY KEY,
    file_name varchar(255) NOT NULL,
    creation_date integer DEFAULT extract(epoch FROM now()) NOT NULL,
    duration integer NOT NULL,
    -- user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    format text NOT NULL,
    data bytea NOT NULL
);

