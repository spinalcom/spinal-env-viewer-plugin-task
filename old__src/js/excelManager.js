import Excel from "exceljs";


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
    this.workbook = new Excel.Workbook();
    return this.createAllSheet(id, sheetName, listItem).then(() => {

      return this.workbook;

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

    sheet.columns = columns;

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

    sheet.addRows(listMapped);

    return Promise.all(
      columns.map(column => {
        let key = column.key;
        let col = sheet.getColumn(key);

        return this.validateAllCells(key, col);
      })
    );
  }

  validateAllCells(key, col) {
    let dataValidation = {
      type: "",
      allowBlank: true,
      errorStyle: "error",
      errorTitle: "errot",
      error: "The value is incorrect !!!"
    };

    if (key === "periodNumber" || key === "interventionNumber") {
      dataValidation["type"] = "whole";
    } else if (key === "periodMesure" || key === "interventionMesure") {
      dataValidation["type"] = "list";
      dataValidation["formulae"] =
        key === "interventionMesure" ? [
          '"minute(s), day(s), week(s), month(s), year(s)"'
        ] : ['"day(s), week(s), month(s), year(s)"'];
    } else if (key === "visitType") {
      dataValidation["type"] = "list";
      dataValidation["formulae"] = [
        '"MAINTENANCE_VISIT,REGULATORY_VISIT,SECURITY_VISIT,DIAGNOSTIC_VISIT"'
      ];
    }

    return new Promise(resolve => {
      let cpt = 0;
      col.eachCell(cell => {
        if (cpt !== 0) {
          cell.dataValidation = dataValidation;
        }
        cpt++;
      });
      resolve(true);
    });
  }


  createAllSheet(groupId, sheetName, listItem) {
    return Promise.all([
      this.createTaskSheet(listItem, sheetName)
      // this.createTasksOperationSheet(groupId)
    ]).then(data => {
      return data;
    });
  }

  _formatDate(argDate) {
    let date = new Date(parseInt(argDate));

    return `${date.getDate()}/${date.getDay() + 1}/${date.getFullYear()}`;
  }

  /////////////////////////////////////////////////////////////////
  //                        IMPORT                               //
  /////////////////////////////////////////////////////////////////

  importFile() {
    return this.getFileImportedData().then(data => {

      return {
        valid: data.filter(el => this.dataIsValid(el)),
        invalid: data.filter(el => !this.dataIsValid(el))
      }

    })
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

        reader.onload = _file => {
          let data = _file.target.result;

          this.workbook.xlsx.load(data).then(res => {
            let rows = [];

            res.eachSheet(sheet => {
              let obj = {
                sheet: sheet.name,
                rows: []
              };
              sheet.eachRow((row, rowIndex) => {
                if (rowIndex !== 1) {

                  obj.rows.push({
                    name: row.getCell(1).value,

                    periodNumber: row.getCell(2)
                      .value,

                    periodMesure: [
                      "day(s)", "week(s)",
                      "month(s)", "year(s)"
                    ].indexOf(row.getCell(3)
                      .value),

                    interventionNumber: row.getCell(
                        4)
                      .value,

                    interventionMesure: [
                      "minute(s)", "day(s)",
                      "week(s)", "month(s)",
                      "year(s)"
                    ].indexOf(row.getCell(5)
                      .value),

                    description: row.getCell(7)
                      .value
                  });
                }
              });
              rows.push(obj);
            });

            resolve(rows);
          });
        };

        reader.onerror = err => {
          reject(err);
        };

        reader.readAsArrayBuffer(file);
      });

      // console.log("file", file);

      // this.workbook.xlsx
      //   .load(file)
      //   .then(data => {
      //     console.log("data", data);
      //   })
      //   .catch(err => console.log(err));
    });
  }

  getValue(value) {
    let bool = value !== null &&
      typeof value !== "undefined" &&
      value != "-1" &&
      (value + "").trim().length > 0;

    if (bool) {
      return value;
    }

    return undefined;
  }

  getFileImportedData() {
    return this.getFile()
      .then(res => {
        return res[0].rows.map(el => {
          return {
            name: this.getValue(el.name),
            periodNumber: this.getValue(el.periodNumber),
            periodMesure: this.getValue(el.periodMesure),
            interventionNumber: this.getValue(el.interventionNumber),
            interventionMesure: this.getValue(el.interventionMesure),
            description: el.description
          };
        });
      })
      .catch(err => {
        return err;
      });
  }

  dataIsValid(obj) {
    return (
      obj.name.trim().length !== 0 &&
      (typeof obj.periodNumber !== "undefined" && typeof obj
        .periodMesure !== "undefined") &&
      this.interventionValid(obj)
    );
  }

  interventionValid(item) {
    return (
      (typeof item.interventionNumber === "undefined" && typeof item
        .interventionMesure === "undefined") ||

      (typeof item.interventionNumber !== "undefined" && typeof item
        .interventionMesure !== "undefined")

    );
  }

}

export default new ExcelManager();