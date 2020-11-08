const contactQuery = 
`
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

    INSERT INTO contacts (own_username, other_username, location, date) VALUES
        ('Dav164', 'LouieChapm905240', 'cafeteria', '2020-10-03');

    INSERT INTO test_results (username, result, date) VALUES
        ('Dav164', TRUE, '2020-10-04'),
        ('LouieChapm905240', TRUE, '2020-10-05');
`;

module.exports = {
    contactQuery
}