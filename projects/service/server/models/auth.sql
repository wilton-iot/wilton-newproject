
-- user queries

/** idUpdate */
update auth_users_seq
    set value = value + 1

/** idSelect */
select value as id
from auth_users_seq

/** insert */
insert into auth_users (id, login, auth_role, pwd_hash)
    values(:id, :login, :role, :pwdHash)

/** selectByLogin */
select
    id as "id",
    login as "login",
    auth_role as "role",
    pwd_hash as "pwdHash"
from auth_users
    where login = :login
