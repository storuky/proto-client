<template>
  <div class="viewport" ref="viewport">
    <ViewportElement v-for="element in elements" :element="element" :key="element.id"/>
  </div>
</template>

<script>
import * as d3 from "d3";
import ViewportElement from "./ViewportElement";

export default {
  name: "Viewport",
  components: { ViewportElement },
  mounted() {
    this.d3Viewport = d3
      .select(this.$refs.viewport)
      .call(this.zoomable())
      .on("dblclick.zoom", null);
  },
  methods: {
    zoomable() {
      return d3.zoom().on("zoom", () => {
        const { x, y, k: scale } = d3.event.transform;
        this.setCoordsAndZoom({ x, y, scale });
      });
    },
    setCoordsAndZoom(transform) {
      this.$store.dispatch("viewport/setTransform", transform);
    }
  },
  computed: {
    transform() {
      return this.$store.getters["viewport/transform"];
    },
    elements() {
      return this.$store.getters["element/all"];
    }
  }
};
</script>

<style scoped>
.viewport {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transform-origin: 0 0;
  overflow: hidden;
  background: #eeeeee;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
}

.html-layer {
  width: 100px;
  height: 100px;
  background: red;
  position: relative;
  z-index: 1;
  will-change: transform;
}

.svg-layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
