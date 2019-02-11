<template>
  <svg class="line-element" width="100%" height="100%">
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="0"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
        v-if="settings.markerEnd"
      >
        <path d="M0,0 L0,6 L9,3 z" :fill="settings.markerEnd.color"></path>
      </marker>
    </defs>
    <g class="handle" :style="elementTransform" ref="handle">
      <line v-bind="lineAttrs()" @click="$emit('click')"></line>
      <line v-bind="lineAttrs({strokeWidth: 10, opacity: 0})" @click="$emit('click', $event)"></line>

      <g v-show="selected">
        <g class="control-point" ref="dragStartHandle">
          <rect
            v-bind="controlPointsProps({x: 'x1', y: 'y1', opacity: settings.markerStart ? 0 : 1})"
          ></rect>
        </g>
        <g class="control-point" ref="dragEndHandle">
          <rect
            v-bind="controlPointsProps({x: 'x2', y: 'y2', opacity: settings.markerEnd ? 0 : 1})"
          ></rect>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import extend from "./_extend";
import * as d3 from "d3";

export default {
  name: "LineElement",
  extends: extend,
  data() {
    return {
      snapToGrid: true,
      settings: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 200,
        // markerEnd: {
        //   type: "arrow",
        //   color: "gray"
        // },
        lineStyle: {
          stroke: "gray",
          strokeWidth: 3
        }
      }
    };
  },
  mounted() {
    d3.select(this.$refs.handle).call(this.dragHandler());

    d3.select(this.$refs.dragStartHandle).call(
      this.controlPointsHandler({ xField: "x1", yField: "y1" })
    );

    d3.select(this.$refs.dragEndHandle).call(
      this.controlPointsHandler({ xField: "x2", yField: "y2" })
    );
  },
  methods: {
    controlPointsHandler({ xField, yField }) {
      const handler = d3.drag();

      handler.on("drag", () => {
        const { x, y } = d3.event;
        let dx, dy;

        if (this.snapToGrid) {
          const offset = {
            x: this.round(this.position.x, this.gridDistance) - this.position.x,
            y: this.round(this.position.y, this.gridDistance) - this.position.y
          };

          dx = this.round(x, this.gridDistance) + offset.x;
          dy = this.round(y, this.gridDistance) + offset.y;
        } else {
          dx = x;
          dy = y;
        }

        this.setSettings({ [xField]: dx, [yField]: dy });
      });

      return handler;
    },
    setSettings(settings) {
      this.settings = {
        ...this.settings,
        ...settings
      };
    },
    controlPointsProps({ x, y, opacity }) {
      const size = 8;

      return {
        width: size,
        height: size,
        x: this.settings[x] * this.scale - size / 2,
        y: this.settings[y] * this.scale - size / 2,
        style: {
          opacity,
          fill: "#e7e7e7",
          strokeWidth: 1,
          stroke: "#979797",
          transform: `scale(${1 / this.scale})`
        }
      };
    },
    lineAttrs(defaults) {
      const { settings } = this;

      let lineAttrs = (({ x1, y1, x2, y2 }) => ({
        x1,
        x2,
        y1,
        y2
      }))(settings);

      lineAttrs = {
        ...lineAttrs,
        ...defaults,
        style: settings.lineStyle,
        "marker-end": settings.markerEnd
          ? `url(#${settings.markerEnd.type})`
          : null
      };

      return lineAttrs;
    }
  },
  computed: {
    gridDistance() {
      return this.$store.getters["viewport/gridDistance"] / this.scale;
    }
  }
};
</script>

<style scoped>
.line-element {
  cursor: pointer;
  pointer-events: none;
}

.handle {
  pointer-events: all;
}

.control-point {
  cursor: move;
}
</style>
