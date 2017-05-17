# Post

## Description

Spout360 Post

## Fields

Name                  | Type
--                    | --
id(PK)                | integer
category_id           | integer
name                  | string
title                 | string
content               | string
status                | enum
type                  | enum
created_time          | datetime
updated_time          | datetime

## Relationships

Type                  | Model             | Fields
--                    | --                | --
belongsTo             | Category          | category_id
belongsToMany         | Tag
