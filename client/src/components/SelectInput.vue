<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="SelectInput" v-bind="attrs['div-attrs']">
      <q-select ref="select"
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
                @filter="filterFn"
                :options="options"
                v-bind="attrs['attrs']">
        <template v-for="slot in slots" v-slot:[slot]="slotProps">
          <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
        </template>

        <template v-if="!slots.includes('no-option')" v-slot:no-option>
          <q-item>
            <q-item-section>
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </transition>
</template>

<script>
  import $lget from 'lodash.get';
  import $lset from 'lodash.set';

  export default {
    name: 'SelectInput',
    props: {
      modelValue: {
        type: [Number, String, Array, Object],
      },
      path: {
        required: true,
      },
      slots: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        default_options: undefined,
        options: undefined,
      };
    },
    watch: {
      attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (this.$lget(this.default_options,'length') === 0 || this.$lget(this.default_options,'length') !== this.$lget(newVal, 'attrs.options', []).length) {
            this.default_options = this.$lget(newVal, 'attrs.options', []);
            this.options = this.$lget(newVal, 'attrs.options', []);
            if (this.$refs.select) this.$refs.select.refresh(-1);
          }
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.filled', this.$lget(newVal, 'attrs.filled', true));
        this.$lset(newVal, 'attrs.clearable', this.$lget(newVal, 'attrs.clearable', true));
        this.$lset(newVal, 'attrs.clear-icon', this.$lget(newVal, 'attrs.clear-icon', 'close'));
        this.$lset(newVal, 'attrs.use-input', this.$lget(newVal, 'attrs.use-input', true));
        this.$lset(newVal, 'attrs.hide-selected', this.$lget(newVal, 'attrs.hide-selected', true));
        this.$lset(newVal, 'attrs.fill-input', this.$lget(newVal, 'attrs.fill-input', true));
        this.$lset(newVal, 'attrs.input-debounce', this.$lget(newVal, 'attrs.input-debounce', '0'));

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        return newVal;
      },
    },
    methods: {
      $lset,$lget,
      // eslint-disable-next-line no-unused-vars
      filterFn(val, update, abort) {
        let filterFn = this.$lget(this.attrs, 'attrs.filterFn');
        if (typeof filterFn === 'function') {
          filterFn(val, update, abort);
        } else {
          update(() => {
            if (!this.$lget(this.attrs, 'attrs.multiple') || this.$lget(this.attrs, 'attrs.use-input')) {
              if (val === '') {
                this.options = this.default_options;
              } else {
                const needle = val.toLowerCase();
                this.options = this.default_options.filter(v => {
                  if (typeof v === 'string') {
                    return v.toLowerCase().indexOf(needle) > -1;
                  } else if (typeof v === 'object') {
                    let option_label = this.$lget(this.attrs, 'attrs.option-label', 'label');
                    let v_value;
                    if (typeof option_label === 'function') {
                      v_value = option_label(v);
                    } else {
                      v_value = this.$lget(v, option_label, '');
                    }
                    return v_value.toLowerCase().indexOf(needle) > -1;
                  } else {
                    return true;
                  }
                });
              }
            }
          });
        }
      },
    },
  };
</script>

<style scoped lang="scss">
</style>
