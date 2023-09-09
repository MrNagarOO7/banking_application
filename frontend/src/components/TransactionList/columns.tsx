import { CloseCircleOutlined } from "@ant-design/icons";
import { Tag, Space, Tooltip, Button, Popconfirm } from "antd";

export const columns = (payload: { handleCancleTransaction?: any }) => {
  const { handleCancleTransaction } = payload;
  return [
    {
      title: "Id",
      dataIndex: "transactionId",
      key: "id",
    },
    {
      title: "Payer A/c No.",
      dataIndex: "receiverAccountNo",
      key: "receiverAccountNo",
    },
    {
      title: "Payer Contact No.",
      dataIndex: "receiverContactNo",
      key: "receiverContactNo",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => (
        <span style={{ color: "green" }}>{record.amount}₹ </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: any, index: number) =>
        record.createdAt.split("T")[0],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_: any, record: any) => (
        <Tag
          color={
            record.type === "credit"
              ? "success"
              : record.type === "debit"
              ? "error"
              : "warning"
          }
        >
          {record.type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Cancle Transaction">
            <Popconfirm
              title="Are you sure to cancle this transaction?"
              onConfirm={() => handleCancleTransaction(record.transactionId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ color: "red" }}
                className={"cancle-btn"}
                icon={<CloseCircleOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
};
