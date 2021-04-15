<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="localValue"
        label="Añade un color"
        readonly
        v-bind="attrs"
        :disabled="disabled"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>

    <v-color-picker
      v-if="menu"
      v-model="color"
      mode="hexa"
      elevation="0"
      hide-sliders
      show-swatches
      hide-inputs
    ></v-color-picker>
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
    rules: {
      type: Array,
      requerid: false,
    },
  },
  data() {
    return {
      menu: false,
      color: '#000000',
    }
  },
  computed: {
    // color() {
    //   return this.localValue.hexa ? this.localValue.hexa : '#000000'
    // },
  },

  watch: {
    color(value) {
      console.log(value)
      this.localValue = value
    },
  },

  methods: {
    parseColor(color) {
      console.log(color)
      console.log(color ? color.hexa : null)
      return color ? color.hexa : null
    },
  },
}
</script>
<style></style>
