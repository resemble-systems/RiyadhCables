import * as React from "react";
import CommonLayout from "../layout/Layout";
import CommonCard from "../commonCard";
import { Button, Popconfirm, Select, DatePicker } from "antd";
import WorkflowTable from "./WorkflowTable";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import Search from "antd/es/input/Search";
import * as XLSX from "xlsx";
export interface IWorkflowTaskProps {
  lg: number;
  xl: number;
  Title: string;
  marginRight: boolean;
  context: WebPartContext;
  workFlowData: any;
  newUserData: any;
  PaymentRequestData: any;
  loanRequestData: any;
  getNewUser: any;
  getLoanRequest: any;
  getPaymentRequest: any;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
    manager: string;
    managerEmail: string;
  };
}
export interface IWorkflowTaskState {
  selectedDashboard: string;
  selectedStatus: string;
  isOpen: boolean;
  selectedStartDate: string;
  selectedTable: string;
  tableData: any;
  filterData: any;
  selectedPendingWith: string;
  filterDuration: boolean;
  StartDate: string;
  EndDate: string;
  AllData: any;
  searchText: string;
  selectedDepartment: string;
  selectDepartment: any;
  exportAsPdf: boolean;
}
export default class WorkflowTask extends React.Component<
  IWorkflowTaskProps,
  IWorkflowTaskState
> {
  public RangePickerRef: any;
  public constructor(props: IWorkflowTaskProps, state: IWorkflowTaskState) {
    super(props);
    this.state = {
      selectedDashboard: "Task Assigned to me",
      selectedStatus: "Status",
      isOpen: false,
      selectedStartDate: "",
      selectedTable: "All Requests",
      tableData: [],
      filterData: [],
      selectedPendingWith: "Pending With",
      filterDuration: false,
      StartDate: "",
      EndDate: "",
      AllData: [],
      searchText: "",
      selectedDepartment: "Department",
      selectDepartment: [],
      exportAsPdf: false,
    };
    this.RangePickerRef = React.createRef();
  }

  public componentDidMount(): void {
    console.log("workFlowData", this.props.workFlowData);
    const { newUserData, loanRequestData, PaymentRequestData } = this.props;
    const {
      filterDuration,
      StartDate,
      EndDate,
      selectedDepartment,
      selectedPendingWith,
    } = this.state;
    const combineData = () => {
      const newUser = newUserData?.map((data: any) => {
        return {
          ...data,
          FormType: "USER FORM",
        };
      });
      const loanRequest = loanRequestData?.map((data: any) => {
        return {
          ...data,
          FormType: "LOAN FORM",
        };
      });
      const paymentRequest = PaymentRequestData?.map((data: any) => {
        return {
          ...data,
          FormType: "PAYMENT FORM",
        };
      });
      const AllRequestData = [...newUser, ...loanRequest, ...paymentRequest];
      return AllRequestData;
    };
    console.log("Initial Data", combineData());
    this.setState({
      tableData: this.usedFilter(
        combineData(),
        filterDuration,
        StartDate,
        EndDate,
        selectedDepartment,
        selectedPendingWith
      ),
      filterData: this.sortData(combineData()),
    });
  }

  public departmentFilter = (dataArray: any) => {
    console.log("Department Filter", dataArray);
    const departments = dataArray?.filter((data: any) => {
      if (data.Department) {
        return data;
      }
    });
    const departmentSelect = departments?.map((data: any) => {
      return {
        value: data.Department,
        label: data.Department,
      };
    });
    console.log("Department Filter One", departmentSelect);
    const uniquedepartmentsData = departmentSelect?.reduce(
      (acc: any, curr: any) => {
        if (!acc.find((item: { value: string }) => item.value === curr.value)) {
          acc.push(curr);
        }
        return acc;
      },
      []
    );
    console.log(
      "Department Filter Two",
      uniquedepartmentsData,
      this.props.selectedPersonDetails.department
    );
    const departmentFinanceFilter = uniquedepartmentsData?.filter(
      (data: any) => {
        if (this.props.selectedPersonDetails.department === data.value) {
          return data;
        } else if (this.props.selectedPersonDetails.department === "Finance") {
          return data;
        }
      }
    );
    console.log("departmentFinanceFilter", departmentFinanceFilter);
    return [
      {
        value: "Department",
        label: "Department",
      },
      ...departmentFinanceFilter,
    ];
  };

  public componentDidUpdate(
    prevProps: Readonly<IWorkflowTaskProps>,
    prevState: Readonly<IWorkflowTaskState>
  ): void {
    const {
      filterDuration,
      StartDate,
      EndDate,
      selectedTable,
      selectedDepartment,
      selectedPendingWith,
      filterData,
    } = this.state;
    const { newUserData, loanRequestData, PaymentRequestData } = this.props;
    const combineData = () => {
      const newUser = newUserData?.map((data: any) => {
        return {
          ...data,
          FormType: "USER FORM",
        };
      });
      const loanRequest = loanRequestData?.map((data: any) => {
        return {
          ...data,
          FormType: "LOAN FORM",
        };
      });
      const paymentRequest = PaymentRequestData?.map((data: any) => {
        return {
          ...data,
          FormType: "PAYMENT FORM",
        };
      });
      const AllRequestData = [...newUser, ...loanRequest, ...paymentRequest];
      return AllRequestData;
    };

    const stateSetting = () => {
      if (selectedTable === "All Requests") {
        this.setState({
          tableData: this.usedFilter(
            combineData(),
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(combineData()),
          selectDepartment: this.departmentFilter(combineData()),
        });
      } else if (selectedTable === "New Loan Request") {
        this.setState({
          tableData: this.usedFilter(
            this.props.loanRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(this.props.loanRequestData),
          selectDepartment: this.departmentFilter(this.props.loanRequestData),
        });
      } else if (selectedTable === "Payment Request") {
        this.setState({
          tableData: this.usedFilter(
            this.props.PaymentRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(this.props.PaymentRequestData),
          selectDepartment: this.departmentFilter(
            this.props.PaymentRequestData
          ),
        });
      } else if (selectedTable === "New User Creation") {
        this.setState({
          tableData: this.usedFilter(
            this.props.newUserData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(this.props.newUserData),
          selectDepartment: this.departmentFilter(this.props.newUserData),
        });
      }
    };
    if (prevProps.newUserData !== this.props.newUserData) {
      console.log("New User Data", this.props.newUserData);
      stateSetting();
    }
    if (prevProps.loanRequestData !== this.props.loanRequestData) {
      console.log("Loan Request Data", this.props.loanRequestData);
      stateSetting();
    }
    if (prevProps.PaymentRequestData !== this.props.PaymentRequestData) {
      console.log("Payment RequestData Data", this.props.PaymentRequestData);
      stateSetting();
    }
    if (prevProps.selectedPersonDetails !== this.props.selectedPersonDetails) {
      this.setState({ selectDepartment: this.departmentFilter(filterData) });
    }
  }

  public sortData = (data: any) => {
    const sortedData = data?.sort(
      (a: { Created: string }, b: { Created: string }) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    return sortedData;
  };

  public usedFilter = (
    Data: any,
    DateFilter: boolean,
    Start: string,
    End: string,
    Department: string,
    PendingWith: string
  ) => {
    const { selectedStatus, selectedStartDate, searchText } = this.state;
    console.log(
      "Filter Options",
      selectedStatus,
      selectedStartDate,
      PendingWith,
      Department
    );
    let tableData: any;
    const sortedItems: any[] = Data?.sort(
      (a: { Created: string }, b: { Created: string }) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log("FILTER SORT", sortedItems);
    const departmentFilter = sortedItems?.filter((data) => {
      if (Department !== "Department") {
        return data.Department === Department;
      } else {
        return data;
      }
    });
    const filteredData = departmentFilter?.filter((data: any) => {
      if (PendingWith === "VP Finance") {
        return (
          data.PendingDepartment === "VP Finance" ||
          data.PendingDepartment === "Cash Team" ||
          data.PendingDepartment === "AR Team" ||
          data.PendingDepartment === "AP Team" ||
          data.PendingDepartment === "Cash Head" ||
          data.PendingDepartment === "AR Head" ||
          data.PendingDepartment === "AP Head" ||
          data.PendingDepartment === "Finance Controller"
        );
      } else if (PendingWith === "IT Approvers") {
        return (
          data.PendingDepartment === "IT Approver" ||
          data.PendingDepartment === "IT Approvers"
        );
      } else if (PendingWith !== "Pending With") {
        return data.PendingDepartment === PendingWith;
      } else {
        return data;
      }
    });
    if (DateFilter) {
      const filterOnDate = filteredData?.filter(
        (data: { Date: string }) =>
          new Date(Start).getTime() <= new Date(data.Date).getTime() &&
          new Date(End).getTime() + 66600000 >= new Date(data.Date).getTime()
      );
      const searchData = filterOnDate?.filter(
        (data: { ReferenceNumber: string }) => {
          if (searchText === "") {
            return data;
          } else {
            return data.ReferenceNumber?.toLowerCase().match(
              searchText?.toLowerCase()
            );
          }
        }
      );
      tableData = searchData;
    } else {
      const searchData = filteredData?.filter(
        (data: { ReferenceNumber: string }) => {
          if (searchText === "") {
            return data;
          } else {
            return data.ReferenceNumber?.toLowerCase().match(
              searchText?.toLowerCase()
            );
          }
        }
      );
      tableData = searchData;
    }
    return tableData;
  };

  public downloadExcel = (data: any) => {
    const sortedItems: any[] = data?.sort(
      (a: { Created: string }, b: { Created: string }) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log("excel Data", sortedItems);
    const worksheet = XLSX.utils.json_to_sheet(sortedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "WorkFlowDashboard.xlsx");
    console.log(worksheet, workbook, data, "Workbook All Data");
    this.setState({ exportAsPdf: false });
  };

  public render(): React.ReactElement<IWorkflowTaskProps> {
    const {
      lg,
      xl,
      Title,
      marginRight,
      context,
      workFlowData,
      newUserData,
      loanRequestData,
      PaymentRequestData,
      getNewUser,
      getLoanRequest,
      getPaymentRequest,
    } = this.props;
    const {
      selectedDashboard,
      selectedStatus,
      selectedStartDate,
      selectedTable,
      tableData,
      filterData,
      selectedPendingWith,
      filterDuration,
      StartDate,
      EndDate,
      searchText,
      selectedDepartment,
      selectDepartment,
      exportAsPdf,
    } = this.state;

    const { RangePicker } = DatePicker;
    const ExportXlsx = require("../workflowCard/viewForms/assets/Export.svg");

    const selectDashboard = [
      {
        value: "All Request",
        label: (
          <div
            onClick={() => {
              console.log("LABEL CLICKED");
              this.setState({
                searchText: "",
                selectedDepartment: "Department",
                selectedPendingWith: "Pending With",
                tableData: this.usedFilter(
                  filterData,
                  filterDuration,
                  StartDate,
                  EndDate,
                  "Department",
                  "Pending With"
                ),
              });
            }}
          >
            All Requests
          </div>
        ),
      },
      {
        value: "Task Assigned to me",
        label: "Pending Approvals",
      },
      {
        value: "Request Created by me",
        label: "Created Request",
      },
      { value: "Open", lable: "Open" },
      { value: "Approved", lable: "Approved" },
      { value: "Rejected", lable: "Rejected" },
      { value: "Closed", lable: "Closed" },
    ];

    const selectTable = [
      {
        value: "All Requests",
        label: "All Requests",
      },
      {
        value: "New User Creation",
        label: "User Creation",
      },
      {
        value: "New Loan Request",
        label: "Loan Request",
      },
      {
        value: "Payment Request",
        label: "Payment Request",
      },
    ];

    const selectPendingWithUser = [
      { value: "Business Approver", lablel: "Business Approver" },
      { value: "IT Approvers", lablel: "IT Approver" },
      { value: "IT Technician", lablel: "IT Technician" },
    ];
    const selectPendingWithLoan = [
      { value: "Business Approver", lablel: "Business Approver" },
      { value: "IT Approver", lablel: "IT Approver" },
      { value: "HR Approver", lablel: "HR Approver" },
      { value: "Finance Approver", lablel: "Finance Approver" },
    ];
    const selectPendingWithPayment = [
      { value: "Business Approver", lablel: "Business Approver" },
      { value: "Department Head", lablel: "Department Head" },
      { value: "Finance Secretary", lablel: "Finance Secretary" },
      { value: "Cash Team", lablel: "Cash Team" },
      { value: "AR Team", lablel: "AR Team" },
      { value: "AP Team", lablel: "AP Team" },
      { value: "Cash Head", lablel: "Cash Head" },
      { value: "AR Head", lablel: "AR Head" },
      { value: "AP Head", lablel: "AP Head" },
      { value: "Finance Controller", lablel: "Finance Controller" },
      { value: "VP Finance", lablel: "VP Finance" },
      { value: "CFO", lablel: "CFO" },
      { value: "CEO", lablel: "CEO" },
    ];
    const selectPendingWithAll = [
      { value: "Business Approver", lablel: "Business Approver" },
      { value: "IT Approvers", lablel: "IT Approver" },
      { value: "IT Technician", lablel: "IT Technician" },
      { value: "HR Approver", lablel: "HR Approver" },
      { value: "Finance Approver", lablel: "Finance Approver" },
      { value: "Department Head", lablel: "Department Head" },
      { value: "Finance Secretary", lablel: "Finance Secretary" },
      { value: "Cash Team", lablel: "Cash Team" },
      { value: "AR Team", lablel: "AR Team" },
      { value: "AP Team", lablel: "AP Team" },
      { value: "Cash Head", lablel: "Cash Head" },
      { value: "AR Head", lablel: "AR Head" },
      { value: "AP Head", lablel: "AP Head" },
      { value: "Finance Controller", lablel: "Finance Controller" },
      { value: "VP Finance", lablel: "VP Finance" },
      { value: "CFO", lablel: "CFO" },
      { value: "CEO", lablel: "CEO" },
    ];

    const handleTableChange = (value: string) => {
      this.setState({
        selectedTable: value,
      });
      if (value === "All Requests") {
        const newUser = newUserData?.map((data: any) => {
          return {
            ...data,
            FormType: "USER FORM",
          };
        });
        const loanRequest = loanRequestData?.map((data: any) => {
          return {
            ...data,
            FormType: "LOAN FORM",
          };
        });
        const paymentRequest = PaymentRequestData?.map((data: any) => {
          return {
            ...data,
            FormType: "PAYMENT FORM",
          };
        });
        const AllRequestData = [...newUser, ...loanRequest, ...paymentRequest];
        console.log("AllRequestData", AllRequestData);
        console.log(
          "Table All Filter",
          this.usedFilter(
            AllRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          )
        );
        this.setState({
          tableData: this.usedFilter(
            AllRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(AllRequestData),
          selectDepartment: this.departmentFilter(AllRequestData),
        });
      }
      if (value === "New User Creation") {
        this.setState({
          tableData: this.usedFilter(
            newUserData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(newUserData),
          selectDepartment: this.departmentFilter(newUserData),
        });
      }
      if (value === "New Loan Request") {
        this.setState({
          tableData: this.usedFilter(
            loanRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(loanRequestData),
          selectDepartment: this.departmentFilter(loanRequestData),
        });
      }
      if (value === "Payment Request") {
        this.setState({
          tableData: this.usedFilter(
            PaymentRequestData,
            filterDuration,
            StartDate,
            EndDate,
            selectedDepartment,
            selectedPendingWith
          ),
          filterData: this.sortData(PaymentRequestData),
          selectDepartment: this.departmentFilter(PaymentRequestData),
        });
      }
    };

    const handleChange = (value: string) => {
      this.setState({
        selectedDashboard: value,
      });
      if (value === "All Request") {
        this.setState({
          searchText: "",
          selectedDepartment: "Department",
          selectedPendingWith: "Pending With",
          tableData: this.usedFilter(
            filterData,
            filterDuration,
            StartDate,
            EndDate,
            "Department",
            "Pending With"
          ),
        });
      }
      console.log("FILTERED DATA", filterData);
    };

    const handleDepartmentChange = (value: string) => {
      this.setState({
        selectedDepartment: value,
        tableData: this.usedFilter(
          filterData,
          filterDuration,
          StartDate,
          EndDate,
          value,
          selectedPendingWith
        ),
      });
    };

    const handlePendingWith = (value: string) => {
      this.setState({ selectedPendingWith: value });
    };
    const onSearch = (value: string) => {
      const searchData = filterData?.filter(
        (data: { ReferenceNumber: string }) => {
          return data.ReferenceNumber?.toLowerCase().match(
            value?.toLowerCase()
          );
        }
      );
      this.setState({ tableData: searchData });
    };

    const text = "Filter";
    const description = (
      <div className="d-flex gap-2 mb-3">
        <Select
          value={selectedPendingWith}
          onChange={handlePendingWith}
          options={
            selectedTable === "New User Creation"
              ? selectPendingWithUser
              : selectedTable === "New Loan Request"
              ? selectPendingWithLoan
              : selectedTable === "Payment Request"
              ? selectPendingWithPayment
              : selectPendingWithAll
          }
          status="warning"
          style={{ width: 200 }}
        />
      </div>
    );

    const confirm = () => {
      console.log("Filter Options", selectedStatus, selectedStartDate);
      this.setState({
        tableData: this.usedFilter(
          filterData,
          filterDuration,
          StartDate,
          EndDate,
          selectedDepartment,
          selectedPendingWith
        ),
      });
    };

    const cancel = () => {
      const usedFilter = (
        Data: any,
        DateFilter: boolean,
        Start: string,
        End: string,
        SelectedStatus: string,
        SelectedPendingWith: string,
        Department: string
      ) => {
        console.log("Filter Options", SelectedStatus);
        let tableData: any;
        const sortedItems: any[] = Data?.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("FILTER SORT", sortedItems);
        const departmentFilter = sortedItems?.filter((data) => {
          if (Department !== "Department") {
            return data.Department === Department;
          } else {
            return data;
          }
        });
        const filteredData = departmentFilter?.filter((data: any) => {
          if (SelectedPendingWith !== "Pending With") {
            return data.PendingDepartment === SelectedPendingWith;
          } else {
            return data;
          }
        });
        if (DateFilter) {
          const filterOnDate = filteredData?.filter(
            (data: { Date: string }) =>
              new Date(Start).getTime() <= new Date(data.Date).getTime() &&
              new Date(End).getTime() + 66600000 >=
                new Date(data.Date).getTime()
          );
          const searchData = filterOnDate?.filter(
            (data: { ReferenceNumber: string }) => {
              if (searchText === "") {
                return data;
              } else {
                return data.ReferenceNumber?.toLowerCase().match(
                  searchText?.toLowerCase()
                );
              }
            }
          );
          tableData = searchData;
        } else {
          const searchData = filteredData?.filter(
            (data: { ReferenceNumber: string }) => {
              if (searchText === "") {
                return data;
              } else {
                return data.ReferenceNumber?.toLowerCase().match(
                  searchText?.toLowerCase()
                );
              }
            }
          );
          tableData = searchData;
        }
        return tableData;
      };
      this.setState({
        tableData: usedFilter(
          filterData,
          filterDuration,
          StartDate,
          EndDate,
          "Status",
          "Pending With",
          selectedDepartment
        ),
        selectedStatus: "Status",
        selectedPendingWith: "Pending With",
      });
    };

    const onChange = (
      value: DatePickerProps["value"] | RangePickerProps["value"],
      dateString: [string, string] | string
    ) => {
      this.setState({
        filterDuration: value !== null,
        StartDate: dateString[0],
        EndDate: dateString[1],
      });
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      this.setState({
        tableData: this.usedFilter(
          filterData,
          value !== null,
          dateString[0],
          dateString[1],
          selectedDepartment,
          selectedPendingWith
        ),
      });
    };

    console.log("TABLE DATA", tableData);
    console.log("SELECTED TABLE", selectedTable);
    console.log("FILTERED DATA", filterData);

    return (
      <CommonLayout
        lg={lg}
        xl={xl}
        classNames={`${marginRight && "marginRight"}`}
      >
        <CommonCard
          cardIcon={require("./assets/to-do-list.png")}
          cardTitle={Title}
          footerText={""}
          footerVisible={false}
          rightPanelVisible={true}
          redirectionLink={``}
          rightPanelElement={
            <div className="d-flex gap-2">
              <Select
                options={selectTable}
                status="warning"
                defaultValue={selectedTable}
                onChange={handleTableChange}
                style={{ width: 175 }}
              />
              <Select
                defaultValue={selectedDashboard}
                value={selectedDashboard}
                onChange={handleChange}
                options={selectDashboard}
                status="warning"
                style={{ width: 175 }}
              />
              <form ref={this.RangePickerRef} id="RangePickerFrom">
                <RangePicker onChange={onChange} name="rangePicker" />
              </form>
            </div>
          }
        >
          <div
            className="d-flex justify-content-between mb-2"
            style={{ fontFamily: "Avenir Next" }}
          >
            <div
              style={{ fontSize: "18px", fontWeight: "600" }}
              className="mb-2"
            >
              {selectedTable}
            </div>
            <div className="d-flex gap-2">
              <Search
                placeholder="Ref Number..."
                onSearch={onSearch}
                value={searchText}
                onChange={(event) => {
                  this.setState({ searchText: event.target.value });
                  if (event.target.value?.length === 0) {
                    this.setState({ tableData: filterData });
                  } else {
                    const searchData = filterData?.filter(
                      (data: { ReferenceNumber: string }) => {
                        return data.ReferenceNumber?.toLowerCase().match(
                          event.target.value?.toLowerCase()
                        );
                      }
                    );
                    this.setState({ tableData: searchData });
                  }
                }}
                style={{ width: 175 }}
              />
              <Select
                options={selectDepartment}
                status="warning"
                defaultValue={selectedDepartment}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                style={{ width: 175 }}
              />
              <Popconfirm
                placement="bottomRight"
                title={text}
                description={description}
                onConfirm={confirm}
                onCancel={cancel}
                okText="Submit"
                cancelText="Clear"
                icon={<></>}
              >
                <Button>Filter</Button>
              </Popconfirm>
              <Button
                onClick={() => {
                  this.setState({ exportAsPdf: true });
                }}
              >
                <div className="d-flex gap-1 justify-content-center align-items-center">
                  <img src={ExportXlsx} width={22} />
                  <span>Export</span>
                </div>
              </Button>
            </div>
          </div>

          <WorkflowTable
            self={this}
            context={context}
            exportAsPdf={exportAsPdf}
            downloadExcel={this.downloadExcel}
            selectedDepartment={selectedDepartment}
            selectedStatus={selectedStatus}
            selectDashboard={selectedDashboard}
            workFlowData={workFlowData}
            selectedStartDate={selectedStartDate}
            newUserData={tableData}
            PaymentRequestData={PaymentRequestData}
            selectTable={selectedTable}
            getNewUser={getNewUser}
            getLoanRequest={getLoanRequest}
            getPaymentRequest={getPaymentRequest}
          />
        </CommonCard>
      </CommonLayout>
    );
  }
}
