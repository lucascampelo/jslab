<template>
  <div :class="`note note-${type} q-pa-sm`">
    <span v-text="label"></span>
  </div>
</template>

<script>
export default {
  name: 'Note',
  props: {
    type: {
      type: String,
      default: 'positive',
      validator: function (value) {
        return ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning'].indexOf(value) !== -1
      }
    },
    label: String
  }
}
</script>

<style lang="scss" scoped>
@import "~quasar/src/css/variables";

.note {
  border-radius: 5px;
  border-style: solid;
  border-width: 0 5px;
}

$variations: (
  primary: $primary,
  secondary: $secondary,
  accent: $accent,
  positive: $positive,
  negative: $negative,
  info: $info,
  warning: $warning,
);

@each $colorName, $color in $variations {
  .note-#{$colorName} {
    border-color: $color;
    background-color: lighten($color, 43%);
  }
}
</style>
