<template>
  <div class="mailchimp-subscribe-form" :class="{ 'mailchimp-subscribe-form--loading': loading }">
    <div v-if="inEditor" v-mailchimp-subscribe-editor="content">Configure mailchimp</div>
    <div class="mailchimp-subscribe-form__fields">
      <form-fields
        :form-values="formValues"
        :fields="customFields"
        :validations="$v"
        :clear-recaptcha="clearRecaptcha"
        @field-updated="updateField"
      >
      </form-fields>
    </div>
    <button class="mailchimp-subscribe-form__submit" @click="submit">{{ submitText }}</button>
    <div v-if="error" class="mailchimp-subscribe-form__error_bottom">{{ error }}</div>
    <div v-if="success" class="mailchimp-subscribe-form__success_bottom">{{ successMessage }}</div>
  </div>
</template>

<script type="ts">
/* eslint-disable prefer-promise-reject-errors */
import { mapGetters } from "vuex";
import FormFields from "@whppt/form-builder/lib/components/Form/FormFields";
import validationMixin from "@whppt/form-builder/lib/components/Form/validationMixin";

const buildInitialValues = (fields) =>
  fields.reduce((vals, field) => {
    if (field.type === "multipleChoice") vals[field.name] = "";
    if (field.type === "select") vals[field.name] = field.options[0];
    if (field.type === "phone") vals[field.name] = "";
    if (field.type === "email") vals[field.name] = "";
    if (field.type === "text") vals[field.name] = "";
    return vals;
  }, {});

export default {
  name: 'WhpptMailchimpSubscribeForm',
  components: { FormFields },
  mixins: [validationMixin],
  props: {
    content: { type: Object, default: () => ({}) },
    container: { type: Boolean, default: false },
  },
  data() {
    return {
      savedValues: {},
      clearRecaptcha: false,
      success: false,
      loading: false,
      error: undefined,
    }
  },
  computed: {
    ...mapGetters(['inEditor']),
    customFields() {
      return this.content.mailchimp
        ? this.content.mailchimp.fields.map(f => ({
          type: f.id === 'email' ? "email" :"text",
          label: f.name ,name: f.id, required: f.required, placeholder: f.placeholder}))
        : [];
    },
    formValues() {
      if (!(this.savedValues && this.savedValues.length)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.savedValues = buildInitialValues(this.customFields);
      }
      return this.savedValues;
    },
    submitText() {
      return this.content.mailchimp && this.content.mailchimp.submitText || 'Submit';
    },
    successMessage() {
      return this.content.mailchimp && this.content.mailchimp.successMessage || 'Subscribed succesfully.'
    }
  },
   methods: {
    updateField(event) {
      if (!event.name) return;
      this.$set(this.formValues, event.name, event.value);
      this.success = false;
    },
   submit() {
      if (this.inEditor) return;

      this.$v.$touch();
      if (this.$v.$invalid) {
        this.error = "Some fields are invalid"
        return
      };

      this.error = undefined;
      this.loading = true;
      this.success = false;

      return this.submitForm()
        .then(() => {
          this.loading = false;
          this.success = true;
        })
        .catch(err => {
          this.loading = false;
          this.success = false;
          this.error = err.message || err;
        });
    },
    submitForm() {
      if (!this.content.mailchimp.listId)
        return Promise.reject(new Error('A mailchimp list id is required, please check the config'));

      return this.$axios.$post('/api/mailchimp/subscribe', {listId: this.content.mailchimp.listId, values: this.formValues})
        .then(result => {
          if (!result.success) return Promise.reject(new Error(result.message));
        });
    },
  },
  validations() {
    const validations = this.getValidations(this.customFields);
    return validations;
  },
};
</script>
