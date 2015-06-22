BEGIN TRANSACTION;

CREATE TABLE users (
    id text NOT NULL,
    organization_id text NOT NULL,
    avatar_url text DEFAULT 'https://secure.lanetix.com/css/images/default-avatar.png'::text,
    name text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

COMMIT TRANSACTION;
