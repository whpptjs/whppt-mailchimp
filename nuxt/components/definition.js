export default {
  key: 'MailchimpSubscribe',
  name: 'Mailchimp Subscribe',
  componentType: 'MailchimpSubscribe',
  hideSpacingInContent: false,
  init: ({ $set }, content = {}) => {
    if (!content.listId) $set(content, 'listId', '');
    if (!content.fields) $set(content, 'fields', [{ id: 'email', required: true }]);
    return content;
  },
};
