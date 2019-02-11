<template>
  <component class="viewport-element" v-bind="element" :is="element.type"></component>
</template>

<script>
import BaseElement from "./Elements/BaseElement";
import LineElement from "./Elements/LineElement";

export default {
  name: "ViewportElement",
  props: {
    element: Object
  },
  components: {
    BaseElement,
    LineElement
  }
};
</script>

<style>
.viewport-element {
  transform-origin: 0 0;
  top: 0;
  left: 0;
  position: absolute;
}
</style>
