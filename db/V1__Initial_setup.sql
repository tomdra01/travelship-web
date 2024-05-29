-- Ensure the production schema exists
CREATE SCHEMA IF NOT EXISTS production;

-- Create trips table
CREATE TABLE production.trips
(
    id serial PRIMARY KEY,
    name varchar(255),
    location varchar(255),
    date date,
    description text,
    peoplejoined integer,
    code varchar(10) UNIQUE
);

-- Create pins table
CREATE TABLE production.pins
(
    pinid bigint NOT NULL PRIMARY KEY,
    type varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    description text,
    xposition integer NOT NULL,
    yposition integer NOT NULL,
    tripid integer NOT NULL REFERENCES production.trips(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE production.messages
(
    id serial PRIMARY KEY,
    messagecontent text NOT NULL,
    username varchar(50) NOT NULL,
    tripid integer NOT NULL REFERENCES production.trips(id)
);