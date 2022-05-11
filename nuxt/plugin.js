import Vue from 'vue';

import MailchimpEditor from './components/Editor';
import MailchimpForm from './components/Form';

Vue.component(`WhpptMailchimpSubscribeForm`, MailchimpForm);

export default async function ({ $whppt }) {
  const mailchimpPlugin = {
    name: 'MailchimpPlugin',
    editors: [
      {
        name: 'mailchimp-subscribe-editor',
        label: 'Mailchimp Config',
        component: MailchimpEditor,
      },
    ],
  };
  await $whppt.addPlugin(mailchimpPlugin);
}
