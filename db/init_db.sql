
begin;

create table host_names(
    id              serial      not null primary key,
    host_name      text        not null
);

create table companies(
    id              serial      not null primary key,
    company_name    text        not null
);

create table host_company_mappings(
    id              serial      not null,
    hostname_id     serial      not null references host_names(id),
    company_id      serial      not null references companies(id),
    primary key (hostname_id, company_id)
);

commit;