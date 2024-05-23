-- Create trips table
CREATE TABLE trips (
    id serial PRIMARY KEY,
    name varchar(255),
    location varchar(255),
    date date,
    description text,
    peoplejoined integer,
    code varchar(10) UNIQUE
);

-- Set owner
ALTER TABLE trips OWNER TO jiddccrd;

-- Create pins table
CREATE TABLE pins (
    pinid bigint NOT NULL PRIMARY KEY,
    type varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    description text,
    xposition integer NOT NULL,
    yposition integer NOT NULL,
    tripid integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE
);

-- Set owner
ALTER TABLE pins OWNER TO jiddccrd;

-- Create messages table
CREATE TABLE messages (
    id serial PRIMARY KEY,
    messagecontent text NOT NULL,
    username varchar(50) NOT NULL,
    tripid integer NOT NULL REFERENCES trips(id)
);

-- Set owner
ALTER TABLE messages OWNER TO jiddccrd;
