# Spout API

## Endpoints

  - Category
    - Retrive categories
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
    - Retrive category details
      - Endpoint `GET /categories/{id}`
      - Response
      ```
      {
        id: <category_id|integer>
        name: <category_name|string>
      }
      ```
    - Retrive category posts
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
    - Retrive category videos
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
    - Retrive post
      - Endpoint `GET /posts/{id}`
      - Response
      ```
      {
        id: <post_id|integer>
        title: <post_title|string>
        ...
      }
      ```

  - Video
    - Retrive video
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
