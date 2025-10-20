create table users
(
    user_id    int auto_increment
        primary key,
    full_name  varchar(100)                                                        not null,
    email      varchar(100)                                                        not null,
    password   varchar(255)                                                        not null,
    role       enum ('student', 'club_owner', 'admin') default 'student'           null,
    created_at timestamp                               default current_timestamp() not null,
    constraint email
        unique (email)
);

create table clubs
(
    club_id         int auto_increment
        primary key,
    club_name       varchar(100)                          not null,
    description     text                                  null,
    logo            varchar(255)                          null,
    creator_user_id int                                   not null,
    created_at      timestamp default current_timestamp() not null,
    constraint clubs_ibfk_1
        foreign key (creator_user_id) references users (user_id)
            on delete cascade
);

create index creator_user_id
    on clubs (creator_user_id);

create table events
(
    event_id    int auto_increment
        primary key,
    club_id     int                                   not null,
    title       varchar(150)                          not null,
    description text                                  null,
    event_date  date                                  not null,
    location    varchar(150)                          null,
    image       varchar(255)                          null,
    created_at  timestamp default current_timestamp() not null,
    constraint events_ibfk_1
        foreign key (club_id) references clubs (club_id)
            on delete cascade
);

create table comments
(
    comment_id   int auto_increment
        primary key,
    user_id      int                                   not null,
    event_id     int                                   not null,
    comment_text text                                  not null,
    created_at   timestamp default current_timestamp() not null,
    constraint comments_ibfk_1
        foreign key (user_id) references users (user_id)
            on delete cascade,
    constraint comments_ibfk_2
        foreign key (event_id) references events (event_id)
            on delete cascade
);

create index event_id
    on comments (event_id);

create index user_id
    on comments (user_id);

create index club_id
    on events (club_id);

create table registrations
(
    registration_id int auto_increment
        primary key,
    user_id         int                                   not null,
    event_id        int                                   not null,
    registered_at   timestamp default current_timestamp() not null,
    constraint user_id
        unique (user_id, event_id),
    constraint registrations_ibfk_1
        foreign key (user_id) references users (user_id)
            on delete cascade,
    constraint registrations_ibfk_2
        foreign key (event_id) references events (event_id)
            on delete cascade
);

create index event_id
    on registrations (event_id);


