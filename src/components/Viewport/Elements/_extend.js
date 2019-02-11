import * as d3 from "d3";

export default {
  props: {
    id: [Number, String],
    type: String,
    position: Object,
    size: Object,
    selected: Boolean
  },
  methods: {
    transform(dim = "px") {
      const { x: ex, y: ey } = this.position;
      const { x: vx, y: vy } = this.viewportTransform;

      const x = ex * this.scale + vx,
        y = ey * this.scale + vy;

      return `translate(${x}${dim}, ${y}${dim}) scale(${this.scale})`;
    },
    dragHandler() {
      let initial = {};

      const handler = d3.drag();
      handler.on("start", () => {
        this.selectedElements.forEach(({ id, position }) => {
          const { x: ex, y: ey } = position;

          initial[id] = {
            x: d3.event.x / this.scale - ex,
            y: d3.event.y / this.scale - ey
          };
        });
      });
      handler.on("drag", () => {
        this.selectedElements.forEach(({ id }) => {
          const position = {
            x: d3.event.x / this.scale - initial[id].x,
            y: d3.event.y / this.scale - initial[id].y
          };

          this.set({ id, position });
        });
      });
      handler.on("end", () => {
        initial = {};
      });

      return handler;
    },
    set({ id, ...params }) {
      this.$store.dispatch("element/set", {
        id: id || this.id,
        ...params
      });
    },
    round(value, precision) {
      return Math.round(value / precision) * precision;
    },
    findById(id) {
      return this.$store.getters["element/findById"](id);
    }
  },
  computed: {
    viewportTransform() {
      return this.$store.getters["viewport/transform"];
    },
    elementTransform() {
      return {
        transform: this.transform()
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
    },
    translate() {
      const { x, y } = this.viewportTransform;
      return { x, y };
    },
    selectedIds() {
      return this.$store.getters["element/selectedIds"];
    },
    selectedElements() {
      if (this.selectedIds.includes(this.id)) {
        return this.findById(this.selectedIds);
      } else {
        return this.findById([this.id]);
      }
    }
  }
};
