# Post

## Description

Spout360 Post

## Fields

Name                  | Type
--                    | --
id(PK)                | integer
name                  | string
title                 | string
content               | string
status                | enum
type                  | enum
created_time          | datetime
updated_time          | datetime

## Relationships

Type                  | Model
--                    | --
belongsToMany         | Category
belongsToMany         | Tag
