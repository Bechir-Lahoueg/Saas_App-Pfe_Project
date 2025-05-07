CREATE TABLE IF NOT EXISTS public.reservation_created_events
(
    id bigint NOT NULL,
    client_email character varying(255) COLLATE pg_catalog."default",
    client_phone_number character varying(255) COLLATE pg_catalog."default",
    confirmation_code character varying(255) COLLATE pg_catalog."default",
    reservation_id bigint,
    start_time timestamp(6) without time zone,
    status character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT reservation_created_events_pkey PRIMARY KEY (id)
    )