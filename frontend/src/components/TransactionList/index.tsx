// src/components/TransactionList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Select } from "antd";
import { jsPDF } from "jspdf";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { DownloadOutlined } from "@ant-design/icons";
import {
  getTransactions,
  addTransaction,
  cancleTransaction,
  setUserDetails,
  User,
} from "../../helpers";
import "./TransactionList.css";
import { columns } from "./columns";
import TransactionItemModal from "./TransactionItemModal";
const { Option } = Select;

interface TransactionListProps {
  userDetails: User;
}
const TransactionList: React.FC<TransactionListProps> = ({ userDetails }) => {
  const [Transactions, setTransactions] = useState([]);
  const [TransactionLoader, setTransactionLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [duration, setDuration] = useState("weekly");
  const dispatch = useDispatch();

  const fetchTransactions = async () => {
    setTransactionLoader(true);
    try {
      const transactionsResp = await getTransactions("ministatement");
      if (transactionsResp.success) {
        setTransactions(transactionsResp.data.listData);
      } else {
        toast.error(transactionsResp.msg);
      }
      setTransactionLoader(false);
    } catch (error) {
      setTransactionLoader(false);
      console.error("Error fetching Transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleAddTransaction = async (transaction: any) => {
    const addTransactionResp = await addTransaction(transaction);
    if (addTransactionResp.success) {
      toast.success(addTransactionResp.msg);
      if (addTransactionResp?.data["balance"]) {
        const newData = {
          ...userDetails,
          balance: addTransactionResp.data["balance"],
        };
        dispatch(setUserDetails(newData));
      }
      fetchTransactions();
    } else {
      toast.error(addTransactionResp.msg);
    }
    closeModal();
  };

  const handleCancleTransaction = async (transactionId: string) => {
    const cancleTransactionResp = await cancleTransaction(transactionId);
    if (cancleTransactionResp.success) {
      toast.success(cancleTransactionResp.msg);
      fetchTransactions();
    } else toast.error(cancleTransactionResp.msg);
  };

  const handleDownloadTransaction = async () => {
    setDownloadLoader(true);
    const doc = new jsPDF();

    try {
      const transactionsResp = await getTransactions(duration);
      if (transactionsResp.success) {
        const pdfHeaders = [
          "Id",
          "Payer A/c No.",
          "Payer Contact No.",
          "Amount",
          "Type",
          "Date",
        ];
        const rowData: any[] = [];
        transactionsResp.data.listData.forEach((row: any) => {
          rowData.push({
            Id: row.transactionId,
            "Payer A/c No.": `${row.receiverAccountNo}`,
            "Payer Contact No.": row.receiverContactNo,
            Amount: `${row.amount} Rs.`,
            Type: row.type,
            Date: row.createdAt.split("T")[0],
          });
        });
        doc.table(10, 10, rowData, pdfHeaders, {
          printHeaders: true,
          autoSize: true,
        });
        doc.save(`${duration}-${new Date().toLocaleDateString()}.pdf`);
        setDownloadLoader(false);
      } else {
        toast.error(transactionsResp.msg);
        setDownloadLoader(false);
      }
    } catch (error) {
      setDownloadLoader(false);
      console.error("Error downloading Transactions:", error);
    }
  };

  return (
    <div className="transaction-list">
      <div className="transaction-actions">
        <Select
          defaultValue={"weekly"}
          placeholder="Download Statements"
          onChange={(value) => setDuration(value)}
          style={{ width: "20vh", marginRight: 8 }}
        >
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>
        <Tooltip title="Download Statements">
          <Button
            loading={downloadLoader}
            type="primary"
            onClick={handleDownloadTransaction}
            icon={<DownloadOutlined />}
          />
        </Tooltip>
        <Button
          style={{ marginLeft: "5px" }}
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          Add Transaction
        </Button>
      </div>

      <div className="table-container">
        <Table
          scroll={{ x: true }}
          columns={columns({
            handleCancleTransaction,
          })}
          dataSource={Transactions}
          loading={TransactionLoader}
          pagination={false}
        />
        <TransactionItemModal
          visible={isModalVisible}
          onCancel={() => {
            closeModal();
          }}
          onSave={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionList;
