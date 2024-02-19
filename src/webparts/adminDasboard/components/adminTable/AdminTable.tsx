import * as React from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface IAdminTableProps {
  selectedStatus: string;
}
export interface IAdminTableState {
  data: any;
  loading: boolean;
}
interface DataType {
  key: React.Key;
  ID: string;
  Status: string;
  CreatedOn: string;
  Title: string;
}

export default class AdminTable extends React.Component<
  IAdminTableProps,
  IAdminTableState
> {
  public constructor(props: IAdminTableProps, state: IAdminTableState) {
    super(props);
    this.state = {
      data: null,
      loading: false,
    };
  }

  public componentDidMount(): void {}

  public columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "ID",
    },
    {
      title: "Title",
      dataIndex: "Title",
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      title: "Created On ",
      dataIndex: "CreatedOn",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: { key: React.Key }) => (
        <Space size="middle">
          <span>View</span>
          <span>Edit</span>
          <span
            onClick={() => {
              console.log("Archive", record.key);
            }}
          >
            Archive
          </span>
        </Space>
      ),
    },
  ];

  public data: DataType[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ].map((data) => ({
    key: data,
    ID: `Task ${data}`,
    Title: "John Brown",
    Status: data % 2 === 0 ? "Open" : "Closed",
    CreatedOn: "02.07.2023",
  }));

  public render(): React.ReactElement<IAdminTableProps> {
    return (
      <Table
        columns={this.columns}
        dataSource={this.data}
        size="middle"
        pagination={{ pageSize: Math.round(this.data.length / 2) }}
        scroll={{ y: 300 }}
      />
    );
  }
}
