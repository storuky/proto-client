<template>
  <div class="viewport-grid">
    <div
      class="x-axis"
      :style="{width: distance, left: `${axis*distance - (distance - offset.x)}px`}"
      v-for="axis in xAxises"
      :key="`x-${axis}`"
    ></div>
    <div
      class="y-axis"
      :style="{height: distance, top: `${axis*distance - (distance - offset.y)}px`}"
      v-for="axis in yAxises"
      :key="`y-${axis}`"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ViewportGrid",
  data() {
    return {
      xAxises: 10,
      yAxises: 10,
      defaultDistance: 50,
      availableDistance: 50,
      minDistance: 25,
      maxDistance: 100
    };
  },
  mounted() {
    this.$el.onresize = () => {
      this.calcAxis();
    };
    this.calcAxis();

    window.addEventListener("resize", this.calcAxis);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.calcAxis);
    });
  },
  methods: {
    calcAxis() {
      this.xAxises = Math.round(this.$el.clientWidth / this.distance) * 2;
      this.yAxises = Math.round(this.$el.clientHeight / this.distance) * 2;
    }
  },
  computed: {
    transform() {
      return this.$store.getters["viewport/transform"];
    },
    distance() {
      let distance = this.transform.scale * this.availableDistance;

      if (distance < this.minDistance) {
        this.availableDistance *= this.defaultDistance / this.minDistance;
      } else if (distance > this.maxDistance) {
        this.availableDistance /= this.defaultDistance / this.minDistance;
      }

      if (distance < this.minDistance || distance > this.maxDistance) {
        distance = this.transform.scale * this.availableDistance;
      }

      this.$store.commit("viewport/setGridDistance", distance);

      return distance;
    },
    offset() {
      const { x, y } = this.transform;
      const offset = {
        x: x % this.distance,
        y: y % this.distance
      };

      this.$store.commit("viewport/setGridOffset", offset);

      return offset;
    }
  }
};
</script>

<style scoped>
.viewport-grid {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background: #f7f7f7;
  transform-origin: 0 0;
}

.x-axis {
  height: 100%;
  position: absolute;
  border-left: 1px solid #e7e7e7;
  transform-origin: 0 0;
}

.y-axis {
  border-top: 1px solid #e7e7e7;
  position: absolute;
  width: 100%;
  transform-origin: 0 0;
}
</style>
