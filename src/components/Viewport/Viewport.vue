<template>
  <div @click="clickViewport" class="viewport" ref="viewport" :style="{cursor: cursor}">
    <ViewportGrid/>
    <svg width="100%" height="100%" ref="svg"></svg>
    <ViewportElement v-for="element in elements" :element="element" :key="element.id"/>
  </div>
</template>

<script>
import * as d3 from "d3";
import ViewportElement from "./ViewportElement";
import ViewportGrid from "./ViewportGrid";

export default {
  name: "Viewport",
  components: { ViewportElement, ViewportGrid },
  data() {
    return {
      cursor: "default"
    };
  },
  mounted() {
    const { viewport } = this.$refs;

    this.d3Viewport = d3
      .select(viewport)
      .call(this.zoomable())
      .on("dblclick.zoom", null);
  },
  methods: {
    zoomable() {
      return d3
        .zoom()
        .on("zoom", () => {
          const { x, y, k: scale } = d3.event.transform;

          if (scale > this.scale) {
            this.cursor = "zoom-in";
          } else if (scale < this.scale) {
            this.cursor = "zoom-out";
          } else {
            this.cursor = "grab";
          }
          this.setCoordsAndZoom({ x, y, scale });
        })
        .on("end", () => {
          this.cursor = "default";
        });
    },
    setCoordsAndZoom(transform) {
      this.$store.dispatch("viewport/setTransform", transform);
    },
    clickViewport() {
      this.$store.commit("element/deselectAll");
    }
  },
  computed: {
    transform() {
      return this.$store.getters["viewport/transform"];
    },
    elements() {
      return this.$store.getters["element/all"];
    },
    scale() {
      return this.transform.scale;
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
</style>
