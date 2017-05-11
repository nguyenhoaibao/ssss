# Video

## Description

Spout360 Video

## Fields

Name                  | Type
--                    | --
id(PK)                | integer
category_id           | integer
title                 | string
content               | string
slug                  | string
created_time          | string
updated_time          | string

## Relationships

Type                  | Model             | Fields
--                    | --                | --
belongsTo             | Category          | category_id
