const Joi = require('joi');

module.exports = {
  createSchema() {
    return Joi
      .object()
      .options({
        language: {
          messages: {
            wrapArrays: false
          },
          object: {
            child: '!!{{reason}}'
          }
        }
      })
      .keys({
        post: Joi.object().keys({
          wp_ID: Joi.number().integer().required(),
          wp_post_author: Joi.string().required(),
          wp_post_date: Joi.string().required(),
          wp_post_date_gmt: Joi.string().required(),
          wp_post_content: Joi.string().required(),
          wp_post_title: Joi.string().required(),
          wp_post_status: Joi.string().required(),
          wp_comment_status: Joi.string().required(),
          wp_post_name: Joi.string().required(),
          wp_post_modified: Joi.string().required(),
          wp_post_modified_gmt: Joi.string().required(),
          wp_post_content_filtered: Joi.string().allow('').required(),
          wp_post_parent: Joi.number().integer().required(),
          wp_guid: Joi.string().allow('').required(),
          wp_menu_order: Joi.number().integer().required(),
          wp_post_type: Joi.string().required(),
          wp_post_mime_type: Joi.string().allow('').required(),
          wp_comment_count: Joi.string().required()
        }).required(),
        author: Joi.object().keys({
          wp_post_author: Joi.string().required(),
          wp_display_name: Joi.string().required()
        }).required(),
        categories: Joi.array().items(Joi.object().keys({
          wp_term_id: Joi.number().integer(),
          wp_name: Joi.string().required(),
          wp_slug: Joi.string().required(),
          wp_term_group: Joi.number().integer().required(),
          wp_term_taxonomy_id: Joi.number().integer(),
          wp_taxonomy: Joi.string().required(),
          wp_parent: Joi.number().integer().required(),
          wp_count: Joi.number().integer().required()
        })).required(),
        tags: Joi.array().items(Joi.object().keys({
          wp_term_id: Joi.number().integer(),
          wp_name: Joi.string().required(),
          wp_slug: Joi.string().required(),
          wp_term_group: Joi.number().integer().required(),
          wp_term_taxonomy_id: Joi.number().integer(),
          wp_taxonomy: Joi.string().required(),
          wp_parent: Joi.number().integer().required(),
          wp_count: Joi.number().integer().required()
        })).required(),
        featured_image: Joi.string().required()
      });
  },

  querySchema() {
    return Joi
      .object()
      .options({
        language: {
          messages: {
            wrapArrays: false
          },
          object: {
            child: '!!{{reason}}'
          }
        }
      })
      .keys({
        category: Joi
          .number()
          .integer()
          .positive(),
        tag: Joi
          .number()
          .integer()
          .positive(),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .max(20)
          .default(10),
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1)
      });
  }
};
