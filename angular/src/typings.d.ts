import 'datatables.net';

declare module 'datatables.net' {
  interface DataTables {
    Api: any;
    Settings: any;
  }

  interface JQueryDataTables<T extends DataTables["Settings"] = DataTables["Settings"]> {
    (opts?: T): DataTables["Api"];
  }

  interface JQuery {
    DataTable: JQueryDataTables;
    dataTable: JQueryDataTables;
  }

  interface JQueryStatic {
    fn: {
      dataTable: JQueryDataTables;
      DataTable: JQueryDataTables;
    };
  }
}

declare var DataTable: DataTables.StaticFunctions;