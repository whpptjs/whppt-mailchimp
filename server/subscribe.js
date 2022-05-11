/* eslint-disable camelcase */
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// TODO: exposing the list id here could be a spamming concern.
export const subscribe = {
  exec(_, { listId, values }) {
    return Promise.resolve().then(() => {
      if (!listId) throw new Error('Cannot subscribe to our newsletter at the moment. Please try again later.');

      const { email_address, ...merge_fields } = values;
      return mailchimp.lists
        .addListMember(listId, {
          email_address,
          merge_fields,
          status: 'subscribed',
        })
        .then(() => ({ success: true, message: 'Success' }))
        .catch(err => {
          if (!err.response) return { success: false, message: err };
          const response = JSON.parse(err.response.text);
          if (response.errors && response.errors.length)
            return { success: false, message: response.errors.map(err => `${err.field}:${err.message}`).join(', ') };
          if (response.title === 'Member Exists') {
            return {
              success: true,
              message: 'Success',
            };
          }
          return {
            success: false,
            message: response.detail,
          };
        });
    });
  },
};
