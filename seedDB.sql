DROP TABLE IF EXISTS users      CASCADE; 
DROP TABLE IF EXISTS coords     CASCADE;
DROP TABLE IF EXISTS friends    CASCADE;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS test_results;

CREATE TABLE users (
    First_Name    varchar     NOT NULL,
    Last_Name     varchar     NOT NULL,
    Username      varchar     NOT NULL      PRIMARY KEY,
    Password      varchar     NOT NULL,
    Email         varchar     NOT NULL      UNIQUE,
    Sharing       integer     NOT NULL,
    StudentID     integer     NOT NULL      UNIQUE
);

CREATE TABLE coords (
    lat float8          NOT NULL,
    lng float8         NOT NULL,
    stamp TIMESTAMPTZ,
    username varchar      NOT NULL,
    sharing integer       NOT NULL,
    tag varchar
);

CREATE TABLE friends (
    username_a varchar NOT NULL,
    username_b varchar NOT NULL,
    status integer NOT NULL default 0,
    PRIMARY KEY (username_a, username_b)
);

CREATE TABLE contacts (
    contact_id         SERIAL      PRIMARY KEY,
    own_username       varchar     NOT NULL,
    other_username     varchar     NOT NULL,
    location           varchar     NOT NULL,
    date               date        NOT NULL
);

CREATE TABLE test_results (
    test_id            SERIAL      PRIMARY KEY,
    username           varchar     NOT NULL,
    result             boolean     NOT NULL,
    date               date        NOT NULL
);

INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
        VALUES ('Carey','Nachenberg','caring', 'nachobird', 'cnachoberg@ucla.edu', 987654321);
INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
        VALUES ('David','Smallberg','small', 'berggg', 'smallberg@ucla.edu', 123456789);
