<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="localValue"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="localValue"
        readonly
        :disabled="disabled"
        v-bind="attrs"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="localValue"
      full-width
      :max="max"
      :min="min"
      @click:minute="$refs.menu.save(localValue)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import customvmodelMixin from '@/mixins/custom.vmodel.mixin.js'
export default {
  mixins: [customvmodelMixin],
  props: {
    disabled: {
      type: Boolean,
      requerid: false,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    max: {
      type: String,
      requerid: false,
    },
    min: {
      type: String,
      requerid: false,
    },
    rules: {
      type: Array,
      requerid: false,
    },
  },
  data() {
    return {
      menu: false,
    }
  },
}
</script>
<style></style>
