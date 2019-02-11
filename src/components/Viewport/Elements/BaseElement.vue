<template>
  <div
    @click="$emit('click', $event)"
    class="base-element"
    :style="{...elementTransform, ...elementSize}"
  >
    <div v-show="selected && resizable">
      <div
        v-for="corner in corners"
        :key="corner"
        :class="['control-point', corner]"
        :ref="corner"
        :style="controlPointsStyle"
      ></div>
    </div>
  </div>
</template>

<script>
import extend from "./_extend";
import * as d3 from "d3";

export default {
  name: "BaseElement",
  extends: extend,
  props: {
    resizable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      corners: ["lt", "rt", "lb", "rb"]
    };
  },
  mounted() {
    d3.select(this.$el).call(this.dragHandler());
    this.corners.forEach(corner => {
      d3.select(this.$refs[corner][0]).call(this.cornerHandler(corner));
    });
  },
  methods: {
    cornerHandler(corner) {
      const handler = d3.drag();
      handler.on("drag", () => {
        const sizes = {
          height: {
            t: this.size.height - d3.event.y,
            b: d3.event.y / this.scale
          },
          width: {
            l: this.size.width - d3.event.x,
            r: d3.event.x / this.scale
          }
        };

        const positions = {
          x: {
            l: this.position.x + d3.event.x,
            r: this.position.x
          },
          y: {
            t: this.position.y + d3.event.y,
            b: this.position.y
          }
        };

        const size = {
          width: sizes.width[corner[0]],
          height: sizes.height[corner[1]]
        };
        const position = {
          x: positions.x[corner[0]],
          y: positions.y[corner[1]]
        };

        this.set({ size, position });
      });

      return handler;
    }
  },
  computed: {
    controlPointsStyle() {
      return {
        transform: `scale(${1 / this.scale})`
      };
    }
  }
};
</script>

<style scoped>
.base-element {
  border: 1px solid gray;
  background: white;
  cursor: pointer;
  position: absolute;
  transform-origin: 0 0;
}

.control-point {
  width: 7px;
  height: 7px;
  background: #e7e7e7;
  border: 1px solid #979797;
  position: absolute;
}

.lt {
  left: -4px;
  top: -4px;
  transform-origin: 3px 3px;
  cursor: nwse-resize;
}

.rt {
  right: -4px;
  top: -4px;
  transform-origin: 6px 3px;
  cursor: nesw-resize;
}

.lb {
  left: -4px;
  bottom: -4px;
  transform-origin: 3px 6px;
  cursor: nesw-resize;
}

.rb {
  right: -4px;
  bottom: -4px;
  transform-origin: 6px 6px;
  cursor: nwse-resize;
}
</style>
