import {
  spinalTaskService
} from "spinal-env-viewer-task-service";

import {
  SpinalGraphService
} from 'spinal-env-viewer-graph-service'


import {
  spinalIO
} from "./spinal-io";

import {
  FileSystem
} from "spinal-core-connectorjs_type";


let utilities = {

  getAllUser() {
    return spinalIO.getAlluser();
  },

  sendMessage(taskId, messageContent) {
    let user = FileSystem._userid;

    return spinalTaskService.addComment(taskId, user, messageContent);
  },

  getMessage(taskId) {
    return spinalTaskService.getComments(taskId);
  }

};

export default utilities;