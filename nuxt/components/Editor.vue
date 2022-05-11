<template>
  <div class="mailchimp-subscriber-config-editor whppt-full">
    <div class="whppt-contents__actions">
      <whppt-text-input id="mailchimp-listId" :value="listId" label="List Id" @input="setListId" />
    </div>
    <div class="whppt-contents__actions">
      <whppt-text-input
        id="mailchimp-submit-text"
        :value="submitText"
        label="Submit button text"
        @input="setSubmitText"
      />
    </div>
    <div class="whppt-contents__actions">
      <whppt-text-input
        id="mailchimp-success-message"
        :value="successMessage"
        label="Success Message"
        @input="setSuccessMessage"
      />
    </div>
    <div class="instructions">
      <h3>Custom Fields</h3>
      The email field will always be added to the mailchimp form. Add any custom fields needed below. The fields id must
      match the field id setup in mailchimp.
    </div>
    <div class="whppt-contents__actions">
      <whppt-text-input id="mailchimp-field-id" v-model="newFieldId" label="Field id" />
      <whppt-text-input id="mailchimp-field-name" v-model="newFieldName" label="Field name" />
      <whppt-checkbox v-model="newFieldRequired" label="Required" />
      <whppt-button @click="() => addField()"><add /> Add Custom Field</whppt-button>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <div v-for="(item, index) in fields" :key="index">
      <div class="whppt-contents__item-container">
        <span>
          {{
            typeof item !== 'object'
              ? item || `Item #${index + 1}`
              : `${item.name} (${item.id})${item.required ? ' (Required)' : ''}` || `Item #${index + 1}`
          }}
        </span>
        <div class="whppt-contents__actions">
          <whppt-button @click="moveUp(item, index)"><arrow-up /></whppt-button>
          <whppt-button @click="moveDown(item, index)"><arrow-down /></whppt-button>
          <whppt-button danger @click="removeItem(item)"><trash /></whppt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { clone } from 'lodash';

import WhpptTextInput from '@whppt/nuxt/lib/components/ui/components/Input';
import WhpptButton from '@whppt/nuxt/lib/components/ui/components/Button';
import WhpptCheckbox from '@whppt/nuxt/lib/components/ui/components/Checkbox';

export default {
  name: 'WhpptMailchimpSubscribeEditor',
  components: { WhpptTextInput, WhpptButton, WhpptCheckbox },
  data() {
    return {
      newFieldId: '',
      newFieldName: '',
      newFieldRequired: false,
      error: '',
      loading: false,
      success: false,
    };
  },
  computed: {
    ...mapState('whppt/editor', ['selectedComponent']),
    mailchimpData() {
      if (!this.selectedComponent.value.mailchimp)
        this.setSelectedComponentState({ value: {}, path: 'mailchimp', replace: true });
      return this.selectedComponent.value.mailchimp;
    },
    listId() {
      if (!this.mailchimpData.listId) this.setListId('');
      return this.mailchimpData.listId;
    },
    submitText() {
      return this.mailchimpData.submitText || 'Submit';
    },
    fields() {
      if (!this.mailchimpData.fields) this.setFields([{ id: 'email_address', name: 'Email Address', required: true }]);
      return this.mailchimpData.fields;
    },
  },
  methods: {
    ...mapActions('whppt/editor', ['setSelectedComponentState']),
    addField() {
      this.error = '';
      if (!this.newFieldId) return (this.error = 'An ID for the field is required!');
      const items = [...this.fields, { id: this.newFieldId, name: this.newFieldName, required: this.newFieldRequired }];
      this.setFields(items);
      this.newFieldId = '';
      this.newFieldName = '';
      this.newFieldRequired = false;
    },
    removeItem(item) {
      if (window.confirm('Are you sure?')) {
        const removed = this.fields.filter(f => f.id !== item.id);
        this.setFields(removed);
      }
    },
    moveUp(item, index) {
      const items = clone(this.fields);
      items.splice(index, 1);
      items.splice(index - 1, 0, item);
      this.setFields(items);
    },
    moveDown(item, index) {
      const items = clone(this.fields);
      items.splice(index, 1);
      items.splice(index + 1, 0, item);
      this.setFields(items);
    },
    setFields(value) {
      this.setSelectedComponentState({ value, path: 'mailchimp.fields', replace: true });
    },
    setListId(value) {
      this.setSelectedComponentState({ value, path: 'mailchimp.listId', replace: true });
    },
    setSubmitText(value) {
      this.setSelectedComponentState({
        value: { ...this.mailchimpData, submitText: value },
        path: 'mailchimp',
        replace: true,
      });
    },
    setSuccessMessage(value) {
      this.setSelectedComponentState({ value, path: 'mailchimp.successMessage', replace: true });
    },
  },
};
</script>
