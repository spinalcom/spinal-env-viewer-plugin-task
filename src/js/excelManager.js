import Excel from "exceljs";
import FileSaver from "file-saver";
import taskService from "spinal-env-viewer-task-service";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

class ExcelManager {
  constructor() {
    this.workbook = new Excel.Workbook();

    this.workbook.creator = "spinalcom";
    this.workbook.created = new Date();
  }

  /////////////////////////////////////////////////////////////////
  //                        EXPORT                               //
  /////////////////////////////////////////////////////////////////
  exportExcel(id, sheetName, listItem) {

    this.createAllSheet(id, sheetName, listItem).then(() => {
      let name = SpinalGraphService.getInfo(id).name.get();

      this.workbook.xlsx
        .writeBuffer()
        .then(buffer => {
          FileSaver.saveAs(
            new Blob([buffer]),
            `spinal_maintenance_${name}_${sheetName}.xlsx`
          );
          this.workbook = new Excel.Workbook();
        })
        .catch(err => console.log(err));
    });
  }

  createTaskSheet(listItem, sheetName) {
    let sheet = this.workbook.addWorksheet(`${sheetName}`, {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape"
      },
      state: "visible"
    });

    let columns = [{
        header: "Name",
        key: "name",
        width: 32
      },
      {
        header: "Period Number",
        key: "periodNumber",
        width: 15
      },
      {
        header: "Period Mesure",
        key: "periodMesure",
        width: 15
      },
      {
        header: "Intervention Number",
        key: "interventionNumber",
        width: 15
      },
      {
        header: "Intervention Mesure",
        key: "interventionMesure",
        width: 15
      },
      {
        header: "Visit Type",
        key: "visitType",
        width: 32
      },
      {
        header: "description",
        key: "description",
        width: 32
      }
    ];

    let listMapped = listItem.map(el => {
      return {
        name: el.name,
        periodNumber: el.periodicity.number,
        periodMesure: el.periodicity.mesure,
        interventionNumber: el.intervention.number,
        interventionMesure: el.intervention.mesure,
        visitType: el.visitType,
        description: el.description
      };
    });

    // console.log('sheet', sheet);

    sheet.columns = columns;

    // sheet.addTable({
    //   name: "Table",
    //   ref: 'A1',
    //   headerRow: true,
    //   style: {
    //     theme: 'TableStyleDark3',
    //     showRowStripes: true
    //   },
    //   columns: columns,
    //   rows: listMapped
    // })



    sheet.addRows(listMapped);

    return Promise.resolve(true);

    // let taskTable = sheet.tables.add("A1:D1", true);
    // taskTable.name = "TaskTable";

    // taskTable.getHeaderRowRange().values = [
    //   ["Name", "Period Number", "Period Mesure", "Visit Type"]
    // ];

    // taskTable.rows.add(null, [listItem.map(el => {
    //   return [
    //     el.name,
    //     el.periodicity.number,
    //     el.periodicity.mesure,
    //     el.visitType.name
    //   ]
    // })]);
  }

  createTasksOperationSheet(groupId) {
    return taskService.getGroupOperation(groupId).then(tasks => {
      return tasks.map(task => {
        return task.operations.map(operation => {
          let workSheet = this.workbook.addWorksheet(
            `${task.name}_${this._formatDate(operation.date)}`, {
              pageSetup: {
                paperSize: 9,
                orientation: "landscape"
              },
              state: "visible"
            }
          );

          workSheet.columns = [{
              header: "Equipment Name",
              key: "name",
              width: 32
            },
            {
              header: "dbId",
              key: "dbId",
              width: 10
            },
            {
              header: "State",
              key: "state",
              width: 20
            },
            {
              header: "Comments",
              key: "comments",
              width: 40
            }
          ];

          let rows = operation.bims.map(el => {
            return {
              name: el.name,
              dbId: el.dbId,
              state: el.state,
              comments: el.comments
            };
          });

          workSheet.addRows(rows);
          console.log("finish !!!!!!!!!!!!!");
          return true;
        });
      });
    });
  }

  createAllSheet(groupId, sheetName, listItem) {
    return Promise.all([
      this.createTaskSheet(listItem, sheetName)
      // this.createTasksOperationSheet(groupId)
    ]);
  }

  _formatDate(argDate) {
    let date = new Date(parseInt(argDate));

    return `${date.getDate()}/${date.getDay() + 1}/${date.getFullYear()}`;
  }

  /////////////////////////////////////////////////////////////////
  //                        IMPORT                               //
  /////////////////////////////////////////////////////////////////

  importFile() {
    return this.getFile();
  }

  getFile() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept =
      ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
    input.click();

    return new Promise((resolve, reject) => {
      input.addEventListener("change", event => {

        let reader = new FileReader();
        let file = event.target.files[0];


        reader.onload = (_file) => {

          let data = _file.target.result;


          this.workbook.xlsx.load(data).then((res) => {
            let rows = []
            res.eachSheet((sheet) => {

              let obj = {
                sheet: sheet.name,
                rows: []
              }
              sheet.eachRow((row, rowIndex) => {

                if (rowIndex !== 1) {
                  obj.rows.push(row.values.filter(
                    el => {
                      if (el) return true;
                      return false;
                    }));
                }
              })
              rows.push(obj)
            })

            resolve(rows);

          });

        }

        reader.onerror = (err) => {
          reject(err);
        }

        reader.readAsArrayBuffer(file);
      })



      // console.log("file", file);

      // this.workbook.xlsx
      //   .load(file)
      //   .then(data => {
      //     console.log("data", data);
      //   })
      //   .catch(err => console.log(err));
    });
  }
}

export default new ExcelManager();