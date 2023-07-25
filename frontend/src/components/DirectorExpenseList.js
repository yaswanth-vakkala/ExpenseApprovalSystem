import { Table, Col, Container } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Input } from 'antd';

import { useUpdateExpenseMutation } from '../slices/expensesApiSlice';
import Paginate from '../components/Paginate';
import ExpenseSearchBox from './ExpenseSearchBox';
import ImageModal from './ImageModal';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const DirectorExpenseList = (props) => {
  const navigate = useNavigate();
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempExpense, setTempExpense] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');
  const showModal = (expense) => {
    setIsModalOpen(true);
    setTempExpense(expense);
  };
  const handleOk = () => {
    handleReject(tempExpense);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  let index = 0;
  function findIndex(i) {
    let row_index = i + 1;
    let serNum =
      process.env.REACT_APP_EXPENSES_PAGINATION_LIMIT * (props.data.page - 1) +
      row_index;
    index++;
    return serNum;
  }
  function formatDate(date) {
    return dayjs(date).format('DD/MM/YYYY');
  }

  const [updateExpense, { isLoading }] = useUpdateExpenseMutation();

  async function handleApprove(expense) {
    if (!window.confirm('Are you sure to Accept the Expense?')) return;
    const data = { ...expense, currentStatus: 'DirectorApproved' };
    try {
      await updateExpense(data);
      props.refetch();
      toast.success('Expense Approved Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  async function handleReject(expense) {
    if (rejectionReason === '') return;
    const data = {
      ...expense,
      status: 'Rejected',
      rejectionReason: rejectionReason,
    };
    try {
      await updateExpense(data);
      props.refetch();
      toast.success('Expense Rejected Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <Modal
        title="Please provide the rejection reason for the expense?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Reject"
        cancelText="Cancel"
      >
        <TextArea
          rows={4}
          placeholder="Enter Rejection Reason to reject the expense"
          maxLength={100}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </Modal>
      {props.keyword && (
        <Link to="/" className="btn btn-light my-2">
          Go Back
        </Link>
      )}
      <Col className="my-2" md="6">
        <ExpenseSearchBox />
      </Col>
      <Table hover bordered striped responsive>
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>S.No</th>
            <th>Employee Name</th>
            <th>Employee Id</th>
            <th>Project Name</th>
            <th>Project Id</th>
            <th>Bill Proof</th>
            <th>Amount(₹)</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.data.expenses.map((expense) => (
            <tr key={expense._id} style={{ textAlign: 'center' }}>
              <td>{findIndex(index)}</td>
              <td>{expense.empName}</td>
              <td>{expense.empId}</td>
              <td>{expense.projName}</td>
              <td>{expense.projId}</td>
              {expense.billProof === 'Resource Link' ? (
                <td>No Image</td>
              ) : (
                <td>
                  <Container>
                    <ImageModal src={expense.billProof} />
                  </Container>
                </td>
              )}
              <td>{expense.amount}</td>
              <td>{expense.description}</td>
              <td>{formatDate(expense.date)}</td>
              <td
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  to={`/expense/calculation/${expense.user}/${expense._id}`}
                >
                  {/* <AiOutlineCheck
                    size={'1.7em'}
                    color="#00FF00"
                    style={{ cursor: 'pointer' }}
                  /> */}
                  <CheckCircleOutlined
                    style={{
                      cursor: 'pointer',
                      color: '#00FF00',
                      fontSize: '2em',
                    }}
                    title="Approve Expense"
                  />
                </Link>
                {/* <AiOutlineCheck
                  size={'1.7em'}
                  color="#00FF00"
                  onClick={() => handleApprove(expense)}
                  style={{ cursor: 'pointer' }}
                /> */}
                {/* <AiOutlineClose
                  size={'1.7em'}
                  color="#FF0000"
                  onClick={() => showModal(expense)}
                  style={{ cursor: 'pointer' }}
                /> */}
                <CloseCircleOutlined
                  style={{
                    cursor: 'pointer',
                    color: '#FF0000',
                    fontSize: '2em',
                  }}
                  onClick={() => showModal(expense)}
                  title="Reject Expense"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        pages={props.data.pages}
        page={props.data.page}
        keyword={props.keyword ? 'search/' + props.keyword : ''}
      />
    </>
  );
};

export default DirectorExpenseList;
