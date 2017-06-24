CREATE TABLE `blip` (
	`id`	TEXT NOT NULL UNIQUE,
	`name`	TEXT NOT NULL UNIQUE,
	`description`	TEXT NOT NULL,
	`creator`	TEXT NOT NULL,
	`angle`	TEXT NOT NULL,
	`offset`	NUMERIC NOT NULL,
	`timestamp`	NUMERIC NOT NULL,
	`quadrant`	TEXT NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `vote` (
	`id`	TEXT NOT NULL,
	`user`	TEXT NOT NULL,
	`isUpVote`	INTEGER NOT NULL
);