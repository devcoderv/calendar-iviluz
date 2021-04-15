<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        v-bind="attrs"
        :hide-details="hideDetail"
        :me="hideDetail"
        :disabled="disabled"
        :rules="rules"
        @blur="localValue = parseDate(dateFormatted)"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="localValue"
      no-title
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import customvmodelMixin from '@/mixins/custom.vmodel.mixin.js'
export default {
  mixins: [customvmodelMixin],
  props: {
    label: {
      type: String,
      requerid: false,
      default: '',
    },
    hideDetail: {
      type: Boolean,
      requerid: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      requerid: false,
      default: false,
    },
    rules: {
      type: Array,
      requerid: false,
    },
  },
  data: (vm) => ({
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu: false,
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.localValue)
    },
  },

  watch: {
    localValue(val) {
      this.dateFormatted = this.formatDate(this.localValue)
    },
  },
  mounted() {
    this.localValue = this.date
  },
  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },
}
</script>

<style></style>
