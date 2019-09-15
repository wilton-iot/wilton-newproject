
-- user queries

/** idUpdate */
update notes_seq
    set value = value + 1

/** idSelect */
select value as id
from notes_seq

/** insert */
insert into notes (id, date_added, title, contents, important)
    values(:id, :dateAdded, :title, :contents, :important)

/** selectById */
select
    id as "id",
    date_added as "dateAdded",
    title as "title",
    contents as "contents",
    important as "important"
from notes
    where id = :id

/** selectByTitle */
select
    id as "id",
    date_added as "dateAdded",
    title as "title",
    contents as "contents",
    important as "important"
from notes
where 
    ((:title is null or :title = '') or (title like :title || '%'))
order by
    id desc
