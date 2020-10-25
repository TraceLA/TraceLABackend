const seedQuery = 
`
    DROP TABLE IF EXISTS users      CASCADE; 
    DROP TABLE IF EXISTS coords     CASCADE;
    DROP TABLE IF EXISTS friends    CASCADE;

    CREATE TABLE users (
        First_Name    varchar     NOT NULL,
        Last_Name     varchar     NOT NULL,
        Username      varchar     NOT NULL,
        Password      varchar     NOT NULL,
        Email         varchar     NOT NULL,
        StudentID     integer         NOT NULL    PRIMARY KEY
    );

    CREATE TABLE coords (
        lat float8          NOT NULL,
        long float8         NOT NULL,
        stamp TIMESTAMPTZ,
        studentid int       NOT NULL
    );

    CREATE TABLE friends (
        friends_id serial PRIMARY KEY,
        user_a integer NOT NULL REFERENCES users,
        user_b integer NOT NULL REFERENCES users,
        status integer NOT NULL default 0
    );

    INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
            VALUES ('Carey','Nachenberg','caring', 'nachobird', 'cnachoberg@ucla.edu', 987654321);
    INSERT INTO users (first_name, last_name, username, password, email, studentid ) 
            VALUES ('David','Smallberg','small', 'berggg', 'smallberg@ucla.edu', 123456789);
    INSERT INTO friends (user_a,user_b,status) 
            VALUES (987654321,123456789,0);
`;

module.exports = {
    seedQuery
  }