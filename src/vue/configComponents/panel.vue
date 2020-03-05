<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->


<template>
  <div class="_mdContent">
    <div class="visits">
      <visit-component :visits="allVists"
                       @refresh="getAllVisits"></visit-component>
    </div>
  </div>
</template>

<script>
import VisitsComponent from "./components/visitsComponent.vue";
import spinalTaskConfigurationService from "spinal-env-viewer-task-service/build/classes/Configuration";

export default {
  name: "ConfigurationTaskPanel",
  components: {
    "visit-component": VisitsComponent
  },
  data() {
    return {
      allVists: []
    };
  },
  mounted() {
    this.getAllVisits();
  },
  methods: {
    opened() {
      console.log("hello world !!!");
    },
    async getAllVisits() {
      this.allVists = await spinalTaskConfigurationService.getConfigurations();
    }
  }
};
</script>

<style scoped>
._mdContent {
  width: 100%;
  height: calc(100% - 15px);
  overflow: hidden;
}

._mdContent .visits {
  width: 100%;
  height: 100%;
}
</style>