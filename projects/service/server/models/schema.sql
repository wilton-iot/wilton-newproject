
begin;

-- postgres sequence
-- drop sequence if exists my_users_seq;
-- create sequence my_users_seq;

--
-- auth
--

-- sequence
drop table if exists auth_users_seq;
create table auth_users_seq(
    value bigint
);
insert into auth_users_seq(value) values(0);

-- table
drop table if exists auth_users;
create table auth_users(
    id bigint primary key,
    login text not null unique,
    auth_role text not null,
    pwd_hash text not null
);

-- indices
create index auth_users__login_idx on auth_users (login);

--
-- notes
--

-- sqlite sequence
drop table if exists notes_seq;
create table notes_seq(
    value bigint
);
insert into notes_seq(value) values(0);

-- users table
drop table if exists notes;
create table notes(
    id bigint primary key,
    date_added date time not null,
    title text not null,
    contents text not null,
    important integer not null
);

-- indices
create index notes__title_idx on notes (title);
create index notes__date_added_idx on notes (date_added);


commit;
