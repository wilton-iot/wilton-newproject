
-- user queries

/** idUpdate */
update my_users_seq
    set value = value + 1

/** idSelect */
select value as id
from my_users_seq

/** insert */
insert into my_users (id, date_added, nick, email, allow_spam)
    values(:id, :dateAdded, :nick, :email, :spam)

/** selectById */
select
    id as "id",
    date_added as "dateAdded",
    nick as "nick",
    email as "email",
    allow_spam as "spam"
from my_users
    where id = :id

/** select */
select
    id as "id",
    date_added as "dateAdded",
    nick as "nick",
    email as "email",
    allow_spam as "spam"
from my_users
where 
    ((:nick is null or :nick = '') or (nick like :nick || '%'))
and ((:email is null or :email = '') or (email like :email || '%'))
order by
    case when :sortval is null or :sortval = '' then id end desc,
    case when :sortval = 'id' and (:sortdir = 'asc' or :sortdir is null or :sortdir = '') then id end asc,
    case when :sortval = 'id' and :sortdir = 'desc' then id end desc,
    case when :sortval = 'dateAdded' and (:sortdir = 'asc' or :sortdir is null or :sortdir = '') then date_added end asc,
    case when :sortval = 'dateAdded' and :sortdir = 'desc' then date_added end desc,
    case when :sortval = 'nick' and (:sortdir = 'asc' or :sortdir is null or :sortdir = '') then nick end asc,
    case when :sortval = 'nick' and :sortdir = 'desc' then nick end desc,
    case when :sortval = 'email' and (:sortdir = 'asc' or :sortdir is null or :sortdir = '') then email end asc,
    case when :sortval = 'email' and :sortdir = 'desc' then email end desc,
    case when :sortval = 'spam' and (:sortdir = 'asc' or :sortdir is null or :sortdir = '') then spam end asc,
    case when :sortval = 'spam' and :sortdir = 'desc' then spam end desc
-- limit :limit
-- offset :offset

/** count */
select count(1) as count
from my_users
where 
    ((:nick is null or :nick = '') or (nick like :nick || '%'))
and ((:email is null or :email = '') or (email like :email || '%'))

