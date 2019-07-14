
begin;

-- postgres sequence
-- drop sequence if exists my_users_seq;
-- create sequence my_users_seq;

-- sqlite sequence
drop table if exists my_users_seq;
create table my_users_seq(
    value bigint
);
insert into my_users_seq(value) values(0);

-- users table
drop table if exists my_users;
create table my_users(
    id bigint primary key,
    date_added date time not null,
    nick text not null,
    email text not null,
    allow_spam integer not null
);

-- indices
create index my_users__nick_idx on my_users (nick);

commit;
