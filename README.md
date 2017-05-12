# Spout API

## Endpoints

  - Category
    - Retrieve categories
      - Endpoint `GET /categories`
      - Response
      ```
      {
          data: [
              {
                id: <category_id|integer>
                name: <category_name|string>
              }
          ]
      }
      ```
    - Retrieve category details
      - Endpoint `GET /categories/{id}`
      - Response
      ```
      {
        id: <category_id|integer>
        name: <category_name|string>
      }
      ```
    - Retrieve category posts
      - Endpoint `GET /categories/{id}/posts`
      - Response
      ```
      {
          data: [
              {
                id: <post_id|integer>
                title: <post_title|string>
                ...
              }
          ]
      }
      ```
    - Retrieve category videos
      - Endpoint `GET /categories/{id}/videos`
      - Response
      ```
      {
          data: [
              {
                id: <post_id|integer>
                title: <post_title|string>
                ...
              }
          ]
      }
      ```

  - Post
    - Retrieve post
      - Endpoint `GET /posts/{id}`
      - Response
      ```
      {
        id: <post_id|integer>
        title: <post_title|string>
        ...
      }
      ```

  - Tag
    - Retrieve posts by tag
      - Endpoint `GET /tags/{id}`
      - Response
      ```
      {
          data: [
              {
                id: <post_id|integer>,
                title: <post_title|string>,
                ...
              },
              ...
          ]
      }
      ```

  - Video
    - Retrieve video
      - Endpoint `GET /videos/{id}`
      - Response
      ```
      {
        id: <video_id|integer>
        title: <video_title|string>
        ...
      }
      ```

  - Livestream video
    - Retrieve video
      - Endpoint `GET /live_streams/{id}`
      - Response
      ```
      {
        id: <video_id|integer>
        url: <video_stream_url|string>
        ...
      }
      ```


## TODO
  - How to sync data from [Spout360.com](https://spout360.com) to own DB?
    - [ ] Write [WP Hook](https://codex.wordpress.org/Plugin_API/Action_Reference)
      - [ ] save_post
      - [ ] deleted_post
      - [ ] (old_status)_to_(new_status)
    - [ ] Write API to receive hook data from WP
  - Which content style can be displayed on mobile? How to transform from origin to this content?
    - Markdown???
