CREATE TABLE IF NOT EXISTS tokens(
    hash text PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry integer NOT NULL,
    scope text NOT NULL
);

