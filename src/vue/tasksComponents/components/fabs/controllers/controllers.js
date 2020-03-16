import spinalTaskConfigurationService from "spinal-env-viewer-task-service/src/classes/Configuration.js";


export default {
  getAllConfigurations() {
    return spinalTaskConfigurationService
      .getConfigurations();

  },
  getTasks(id) {
    return spinalTaskConfigurationService.getTasks(id);
  },
  generateEvents() {

  }
}