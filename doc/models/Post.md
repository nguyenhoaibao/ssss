# Post

## Description

Spout360 Post

## Fields

Name                  | Type
--                    | --
id(PK)                | integer
category_id           | integer
title                 | string
content               | string
slug                  | string
created_time          | datetime
updated_time          | datetime

## Relationships

Type                  | Model             | Fields
--                    | --                | --
belongsTo             | Category          | category_id
belongsToMany         | Tag
