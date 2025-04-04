CREATE TABLE wav_metadata(
    id int PRIMARY KEY REFERENCES wav_file(id) ON DELETE CASCADE,
    file_name varchar(255) NOT NULL,
    title varchar(255),
    artist varchar(255),
    album varchar(255),
    genre varchar(100),
    duration int, -- Duration in seconds
    sample_rate int, -- Sample rate in Hz
    bit_depth int, -- Bit depth of the audio
    file_size int, -- File size in bytes
    creation_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    comments text
);

CREATE OR REPLACE FUNCTION update_last_modified_date_column()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.last_modified_date = now();
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER update_last_modified_date
    BEFORE UPDATE ON wav_metadata
    FOR EACH ROW
    EXECUTE PROCEDURE update_last_modified_date_column();

