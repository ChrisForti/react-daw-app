CREATE TABLE IF NOT EXISTS wav_file(
    id serial PRIMARY KEY,
    file_name varchar(255) NOT NULL,
    creation_date integer DEFAULT extract(epoch FROM now()) NOT NULL,
    duration integer NOT NULL,
    format text NOT NULL,
    wav_file bytea NOT NULL
);

