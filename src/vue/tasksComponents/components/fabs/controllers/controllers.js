import {
  spinalTaskConfigurationService
} from "spinal-env-viewer-task-service";


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