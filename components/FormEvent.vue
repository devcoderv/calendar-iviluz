<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-text-field
          v-model="localValue.name"
          label="Añade un titulo"
          :hide-details="hideDetails"
          :disabled="loading"
          :rules="requeridRules"
          filled
          dense
        ></v-text-field>
      </v-col>

      <v-col cols="6" class="pt-0">
        <date-picker
          v-model="localValue.startDate"
          label="Inicio"
          :hide-details="hideDetails"
          :disabled="loading"
          :rules="requeridRules"
        ></date-picker>
        <v-checkbox
          v-model="localValue.allDay"
          class="mt-0"
          :label="`Todo el dia`"
          hide-details="true"
          :disabled="loading"
        ></v-checkbox>
      </v-col>
      <v-col v-if="!allDay" cols="3" class="pt-0">
        <time-picker
          v-model="localValue.startHour"
          label="Inicio"
          :hide-details="hideDetails"
          :disabled="loading"
          :max="localValue.endHour"
          :rules="requeridRules"
        ></time-picker>
      </v-col>

      <v-col v-if="!allDay" cols="3" class="pt-0">
        <time-picker
          v-model="localValue.endHour"
          label="Inicio"
          :hide-details="hideDetails"
          :disabled="loading"
          :min="localValue.startHour"
          :rules="requeridRules"
        ></time-picker>
      </v-col>
      <v-col v-if="allDay" cols="6" class="pt-0">
        <date-picker
          v-model="localValue.endDate"
          label="Fin de evento"
          :hide-details="hideDetails"
          :disabled="loading"
          :rules="requeridRules"
        ></date-picker>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-text-field
          v-model="localValue.description"
          label="Añade un Descripcion"
          :hide-details="hideDetails"
          :disabled="loading"
          :rules="requeridRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-0">
        <color-picker
          v-model="localValue.color"
          :disabled="loading"
          :rules="requeridRules"
        ></color-picker>
      </v-col>
      <v-col cols="12" class="pt-0">
        <small v-if="message">{{ message }}</small>
        <small>*Campos requeridos</small>
        <div class="d-flex justify-end">
          <v-btn
            color="blue darken-1"
            text
            :disabled="loading"
            @click="$emit('close', false)"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :loading="loading"
            @click="handleCreate"
          >
            Guardar
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import customvmodelMixin from '@/mixins/custom.vmodel.mixin.js'
import validateForm from '@/mixins/validate.form.js'
import DatePicker from './DatePicker.vue'
import TimePicker from './TimePicker.vue'
import ColorPicker from './ColorPicker.vue'
export default {
  components: { DatePicker, TimePicker, ColorPicker },
  mixins: [customvmodelMixin, validateForm],
  props: {
    open: {
      type: Boolean,
      requerid: true,
      default: false,
    },
  },
  data() {
    return {
      allDay: false,
      hideDetails: false,
      message: null,
      eventForm: true,
      loading: false,
    }
  },
  computed: {
    editEvent() {
      return !!this.localValue.uid
    },
  },
  beforeDestroy() {
    this.localValue = {}
  },
  methods: {
    async handleCreate() {
      if (this.validate()) {
        this.loading = true
        if (this.localValue.allDay) {
          this.localValue.start = this.localValue.startDate
          this.localValue.end = this.localValue.startDate
        } else {
          this.localValue.start = `${this.localValue.startDate} ${this.localValue.startHour}`
          this.localValue.end = `${this.localValue.startDate} ${this.localValue.endHour}`
        }
        if (!this.editEvent) {
          const res = await this.$fire.firestore
            .collection('events')
            .add(this.localValue)
          this.localValue = {}
          this.$emit('save', { complete: true, id: res.id })
        } else {
          const { uid } = this.localValue
          delete this.localValue.uid
          await this.$fire.firestore
            .collection('events')
            .doc(uid)
            .update(this.localValue)
          this.localValue.uid = uid
          this.$emit('update', {
            complete: true,
            event: { ...this.localValue },
          })
          this.localValue = {}
        }
      }
    },
  },
}
</script>

<style></style>
