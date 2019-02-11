import * as d3 from "d3";

export default {
  props: {
    id: [Number, String],
    type: String,
    moving: {
      type: String,
      default: "fixed",
      validator(value) {
        return ["fixed", "fluid"].includes(value);
      }
    },
    position: {
      type: Object
    },
    size: {
      type: Object
    }
  },
  methods: {
    translate(dim = "px") {
      const { x: ex, y: ey } = this.position;
      const { x: vx, y: vy } = this.viewportTransform;

      const x = ex * this.scale + vx,
        y = ey * this.scale + vy;

      return `translate(${x}${dim}, ${y}${dim}) scale(${this.scale})`;
    },
    dragHandler() {
      let initial;

      const handler = d3.drag();
      handler.on("start", () => {
        const { x: ex, y: ey } = this.position;

        initial = {
          x: d3.event.x / this.scale - ex,
          y: d3.event.y / this.scale - ey
        };
      });
      handler.on("drag", () => {
        const position = {
          x: d3.event.x / this.scale - initial.x,
          y: d3.event.y / this.scale - initial.y
        };

        this.set({ position });
      });

      return handler;
    },
    set(params) {
      this.$store.dispatch("element/set", {
        id: this.id,
        ...params
      });
    }
  },
  computed: {
    viewportTransform() {
      return this.$store.getters["viewport/transform"];
    },
    elementTransform() {
      return {
        transform: this.translate()
      };
    },
    elementSize() {
      if (!this.size) return {};
      return {
        width: `${this.size.width}px`,
        height: `${this.size.height}px`
      };
    },
    scale() {
      const { scale } = this.viewportTransform;
      return scale;
    }
  }
};
