// src/components/transactionItemModal.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Divider } from "antd";

interface addTransaction {
  receiverAccountNo: number;
  receiverContactNo: string;
  amount: number;
}

interface transactionItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (transaction: addTransaction) => void;
}

const TransactionItemModal: React.FC<transactionItemModalProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [receiverAccountNo, setReceiverAccountNo] = useState("");
  const [receiverContactNo, setReceiverContactNo] = useState("");

  const handleOk = () => {
    try {
      form
        .validateFields()
        .then((values) => {
          if (!values.receiverAccountNo) delete values.receiverAccountNo;
          if (!values.receiverContactNo) delete values.receiverContactNo;
          onSave({ ...values });
          form.resetFields();
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const hancleCancle = () => {
    form.resetFields();
    setReceiverContactNo("");
    setReceiverAccountNo("");
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title={"Add transaction"}
      onCancel={hancleCancle}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="receiverAccountNo"
          label="A/C No."
          rules={[
            () => ({
              validator(_, value) {
                setReceiverAccountNo(value);

                if (!receiverContactNo) {
                  if (!value) {
                    return Promise.reject("Account no. is required.");
                  } else if (isNaN(value)) {
                    return Promise.reject("Account no. has to be a number.");
                  } else if (value.length !== 16) {
                    return Promise.reject("Account no. must be 16 digits.");
                  }
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input disabled={!!receiverContactNo} />
        </Form.Item>
        <Divider plain>OR</Divider>
        <Form.Item
          name="receiverContactNo"
          label="Contact No."
          rules={[
            () => ({
              validator(_, value) {
                setReceiverContactNo(value);
                if (!receiverAccountNo) {
                  if (!value) {
                    return Promise.reject("Contact no. is required.");
                  } else if (value?.length !== 10) {
                    return Promise.reject("Contact no. must be 10 digits.");
                  }
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input disabled={!!receiverAccountNo} />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Please input your amount!",
            },
            () => ({
              validator(_, value) {
                if (isNaN(value)) {
                  return Promise.reject("amount has to be a number.");
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionItemModal;
