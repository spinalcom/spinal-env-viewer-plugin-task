
<template>
  <div class="visits">
    <div class="visit"
         v-for="(visit,index) in allVisits"
         :key="index"
         @click="select(visit)">{{visit.name}}</div>
  </div>
</template>


<script>
import taskService from "spinal-env-viewer-task-service";

export default {
  name: "visitComponent",
  props: ["visitSelected"],
  data() {
    return {
      allVisits: []
    };
  },
  mounted() {
    this.allVisits = taskService.getAllVisits();
  },
  methods: {
    select(item) {
      this.$emit("selectVisit", item);
    }
  }
};
</script>

<style scoped>
.visits {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.visits .visit {
  width: 40%;
  height: 150px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  text-align: center;
}

.visits .visit:hover {
  background: gray;
  cursor: pointer;
}
</style>
