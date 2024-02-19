import * as React from "react";
import { IAdminDasboardProps } from "./IAdminDasboardProps";
import { Button, DatePicker, Popconfirm, Select } from "antd";
import "../../global.css";
import AdminTable from "./adminTable/AdminTable";
import CommonCard from "../../../commonComponents/commonCard";
import CommonLayout from "../../../commonComponents/layout/Layout";
import AnnouncementPostModal from "../../../commonComponents/adminModals/AnnouncementPostModal";
interface IAdminDasboardState {
  selectedDashboard: string;
  selectedStatus: string;
  selectedStartDate: string;
  modalOpen: boolean;
}

export default class AdminDasboard extends React.Component<
  IAdminDasboardProps,
  IAdminDasboardState
> {
  public constructor(props: IAdminDasboardProps, state: IAdminDasboardState) {
    super(props);
    this.state = {
      selectedDashboard: "Announcements",
      selectedStatus: "Status",
      selectedStartDate: "",
      modalOpen: false,
    };
  }
  public render(): React.ReactElement<IAdminDasboardProps> {
    const { context } = this.props;
    const { modalOpen } = this.state;
    const UserEmail = context.pageContext.user.email;
    const { selectedDashboard, selectedStatus } = this.state;
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
      this.setState({ selectedDashboard: value });
    };
    const selectStatus = [
      { value: "Open", lable: "Open" },
      { value: "Closed", lable: "Closed" },
    ];
    const handleStatus = (value: string) => {
      this.setState({ selectedStatus: value });
    };
    const confirm = () => {};
    const onChange = (date: any, dateString: any) => {
      console.log(date, dateString);
      this.setState({ selectedStartDate: dateString });
    };
    const description = (
      <div className="d-flex gap-2 mb-3">
        <Select
          defaultValue={selectedStatus}
          onChange={handleStatus}
          options={selectStatus}
          status="warning"
        />
        <DatePicker onChange={onChange} status="warning" />
      </div>
    );
    const handleClose = () => {
      this.setState({ modalOpen: false });
    };
    return (
      <section
        className="container"
        style={{
          paddingTop: "1rem",
          paddingRight: "0px",
          paddingLeft: "0px",
          fontFamily: "Avenir Next",
        }}
      >
        {UserEmail.toLowerCase() === "hari@resemblesystems.com" && (
          <CommonLayout lg={24} xl={24} classNames={``}>
            <CommonCard
              cardIcon={require("../assets/to-do-list.png")}
              cardTitle={"Admin Dashboard"}
              footerText={""}
              footerVisible={false}
              rightPanelVisible={true}
              redirectionLink={``}
              rightPanelElement={
                <div className="d-flex gap-2">
                  <Select
                    defaultValue={selectedDashboard}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                      { value: "Announcements", label: "Announcements" },
                      { value: "About", label: "About" },
                      { value: "News", label: "News" },
                    ]}
                  />
                  <Popconfirm
                    placement="bottomRight"
                    title={"Filter"}
                    description={description}
                    onConfirm={confirm}
                    okText="Submit"
                    cancelText="Cancel"
                    icon={<></>}
                  >
                    <Button>Filter</Button>
                  </Popconfirm>
                </div>
              }
            >
              <div
                className="d-flex justify-content-between align-items-center mb-2"
                style={{ fontFamily: "Avenir Next" }}
              >
                <div
                  style={{ fontSize: "18px", fontWeight: "600" }}
                  className="mb-2"
                >
                  {selectedDashboard}
                </div>
                <button
                  onClick={() => this.setState({ modalOpen: true })}
                  style={{
                    border: "none",
                    backgroundColor: " rgb(181, 77, 38)",
                  }}
                  className="text-white py-2 px-2 rounded d-flex justify-content-center align-items-center gap-2"
                >
                  <img
                    src={require("../assets/add.png")}
                    width={"24px"}
                    height={"24px"}
                  />
                  <span style={{ fontSize: "16px" }}>Create New</span>
                </button>
              </div>
              <div className="d-flex justify-content-end mb-2"></div>
              <AdminTable selectedStatus={selectedDashboard} />
            </CommonCard>
          </CommonLayout>
        )}
        <AnnouncementPostModal
          self={this}
          title={selectedDashboard}
          context={context}
          modalOpen={modalOpen}
          handleClose={handleClose}
        />
      </section>
    );
  }
}
