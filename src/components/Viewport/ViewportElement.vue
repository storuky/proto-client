<template>
  <component
    @click="select"
    class="viewport-element"
    v-bind="element"
    :is="element.type"
    :selected="selected"
  ></component>
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
  },
  methods: {
    select(e) {
      if (!e.metaKey && !e.shiftKey) {
        this.$store.commit("element/deselectAll");
      }
      this.$store.commit("element/select", this.element);

      e.stopPropagation();
    }
  },
  computed: {
    selected() {
      return this.$store.getters["element/selectedIds"].includes(
        this.element.id
      );
    }
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
