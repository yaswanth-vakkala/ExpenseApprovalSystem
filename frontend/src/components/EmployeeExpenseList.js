//import { Table, Col, Container } from 'react-bootstrap';
import dayjs from 'dayjs';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Button, Image, Card, Row, Col, Modal, Steps } from 'antd';

import '../assets/styles/slideShow.css';
import {
  useDeleteExpenseMutation,
  useDeleteExpenseIMageMutation,
} from '../slices/expensesApiSlice';
import Paginate from '../components/Paginate';
import ExpenseSearchBox from './ExpenseSearchBox';
//import ImageModal from './ImageModal';
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

function ExpenseList(props) {
  const { confirm } = Modal;
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

  const [deleteExpenese, { isLoading }] = useDeleteExpenseMutation();
  const [deleteExpenseImage, { isLoading: loadingImage }] =
    useDeleteExpenseIMageMutation();

  async function handleDelete(expense_img, expense_id) {
    confirm({
      title: 'Are you sure to delete this expense?',
      content: 'This action is not reversable',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          if (expense_img[0] !== '' && expense_img[0] !== 'Resource Link') {
            const newExpenseImgList = expense_img.map((img) => {
              return img.split('\\')[1];
            });
            deleteExpenseImage(newExpenseImgList);
          }
          await deleteExpenese(expense_id);
          props.refetch();
          toast.success('Expense Deleted Successfully');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      },
      onCancel() {},
    });
  }

  const [selected, setSelected] = useState(null);
  const [openModal, setopenModal] = useState(false);
  const [page, setPage] = useState(1);
  let pageSize = 0;

  const statusMappings = {
    EmployeeRequested: 1,
    HRApproved: 2,
    DirectorApproved: 3,
    FinanceDepartmentApproved: 4,
    Approved: 'process',
    Rejected: 'error',
    InProcess: 'process',
  };

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  if (windowSize < 600) {
    pageSize = 3;
  } else {
    pageSize = 6;
  }

  return (
    <>
      {props.keyword && (
        <Link to="/" className="btn btn-light my-2">
          Go Back
        </Link>
      )}

      <ExpenseSearchBox />

      {/*
      <Table hover bordered striped responsive>
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>S.No</th>
            <th>Employee Name</th>
            <th>Employee Id</th>
            <th>Project Name</th>
            <th>Project Id</th>
            <th>Bill Proof</th>
            <th>Current Level</th>
            <th>Status</th>
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
                <Container>
                  <ImageModal
                    src={process.env.REACT_APP_API + expense.billProof}
                  />
                </Container>
              )}
              <td>{expense.currentStatus}</td>
              <td>
                <span style={{ color: '#0000FF' }}>{expense.status}</span>
              </td>
              <td>{expense.amount}</td>
              <td>{expense.description}</td>
              <td>{formatDate(expense.date)}</td>
              <td align="center">
                {expense.currentStatus === 'DirectorApproved' ? (
                  <RiDeleteBin2Fill
                    color="#FF0000"
                    size={'1.5em'}
                    onClick={() =>
                      alert(
                        'cannot delete an expense once it has all approvals'
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <RiDeleteBin2Fill
                    color="#FF0000"
                    size={'1.5em'}
                    onClick={() => handleDelete(expense.billProof, expense._id)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
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
                */}

      {windowSize > 600 ? (
        <Row gutter={[24, 16]} style={{ marginTop: '30px' }}>
          {props.data.expenses.map((row) => {
            return (
              <Col span={8} key={row._id}>
                <Card
                  className="cards"
                  headStyle={{
                    textAlign: 'center',
                    background: '#3c4c5d',
                    color: 'white',
                  }}
                  style={{
                    boxShadow:
                      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                  }}
                  title={row.description}
                  extra={
                    row.status === 'InProcess' &&
                    row.currentStatus === 'EmployeeRequested' && (
                      <DeleteOutlined
                        style={{
                          cursor: 'pointer',
                          fontSize: '23px',
                          color: 'white',
                        }}
                        onClick={() => {
                          handleDelete(row.billProof, row._id);
                        }}
                      />
                    )
                  }
                >
                  <div>
                    <h6>
                      Project Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                      <span>
                        {row.projName} (Id: {row.projId})
                      </span>
                    </h6>
                    <h6>
                      Amount (Rs):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                      <span>{row.amount}</span>
                    </h6>
                    <h6>
                      Date of Expense:&nbsp; <span>{formatDate(row.date)}</span>
                    </h6>
                    <p style={{ textAlign: 'right' }}>
                      <Button
                        className="check-status-btn"
                        size="small"
                        style={{
                          background: 'none',
                          cursor: 'pointer',
                          border: '1px solid',
                        }}
                        onClick={() => {
                          setSelected(row);
                          setopenModal(true);
                        }}
                      >
                        Check Status
                      </Button>
                    </p>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row gutter={[16, 20]} style={{ marginTop: '30px' }}>
          {props.data.expenses.map((row, _id) => {
            return (
              <Card
                key={_id}
                className="cards-mobile"
                headStyle={{
                  textAlign: 'center',
                  background: '#3c4c5d',
                  color: 'white',
                }}
                style={{
                  boxShadow:
                    'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                }}
                title={row.description}
                extra={
                  row.status === 'InProcess' &&
                  (row.currentStatus === 'EmployeeRequested' ||
                    row.currentStatus === 'HRApproved') && (
                    <DeleteOutlined
                      style={{
                        cursor: 'pointer',
                        fontSize: '23px',
                        color: 'white',
                      }}
                      onClick={() => {
                        handleDelete(row.billProof, row._id);
                      }}
                    />
                  )
                }
              >
                <div>
                  <h6>
                    Project Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                    <span>
                      {row.projName} (Id: {row.projId})
                    </span>
                  </h6>
                  <h6>
                    Amount (Rs):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                    <span>{row.amount}</span>
                  </h6>
                  <h6>
                    Date of Expense:&nbsp; <span>{formatDate(row.date)}</span>
                  </h6>
                  <p style={{ textAlign: 'right' }}>
                    <Button
                      className="check-status-btn"
                      size="small"
                      style={{
                        background: 'none',
                        cursor: 'pointer',
                        border: '1px solid',
                      }}
                      onClick={() => {
                        setSelected(row);
                        setopenModal(true);
                      }}
                    >
                      Check Status
                    </Button>
                  </p>
                </div>
              </Card>
            );
          })}
        </Row>
      )}
      <div className="pagination-div">
        <Paginate
          pages={props.data.pages}
          page={props.data.page}
          keyword={props.keyword ? 'search/' + props.keyword : ''}
        />
      </div>

      {/*
      {currentData.length !== 0 && (
        <ConfigProvider
          theme={{
            token: {
              colorTextDisabled: "rgba(0, 0, 0, 0.88)",
            },
          }}
        >
          <Pagination
            className="pagination"
            simple
            responsive
            total={props.data.expenses.length}
            current={page}
            pageSize={pageSize}
            showQuickJumper
            onChange={(page) => {
              setPage(page);
            }}
          />
        </ConfigProvider>
      )}
          */}
      {openModal && windowSize > 600 ? (
        <Modal
          open={openModal}
          onCancel={() => {
            setopenModal(false);
            setSelected(null);
          }}
          centered
          width={750}
          bodyStyle={{ padding: '20px' }}
          footer={null}
        >
          <h2>{selected.description}</h2>
          <div className="claim-card-modal">
            <div className="modal-details">
              <p>
                Project Name
                <h4>
                  {selected.projName} (Id: {selected.projId})
                </h4>
              </p>
              <p>
                Amount (Rs)<h4>{selected.amount}</h4>
              </p>
              <p>
                Date of Expense<h4>{formatDate(selected.date)}</h4>
              </p>
            </div>

            <div className="modal-details-1">
              <div className="modal-status">
                <h5>Status</h5>

                <Steps
                  status={statusMappings[selected.status]}
                  size="small"
                  direction="vertical"
                  current={statusMappings[selected.currentStatus]}
                  items={[
                    {
                      title: 'Claim Submitted',
                    },
                    {
                      title: 'HR Approval',
                    },
                    {
                      title: 'Director Approval',
                    },
                    {
                      title: 'Reimbursement',
                    },
                  ]}
                />
              </div>

              <div className="modal-proof" style={{ width: '400px' }}>
                <h5>Bill Proofs</h5>
                <Carousel
                  dots={true}
                  arrows={true}
                  dotPosition="bottom"
                  nextArrow={<ArrowRightOutlined />}
                  prevArrow={<ArrowLeftOutlined />}
                  draggable
                >
                  {selected.billProof.map((proof) => {
                    if (proof === 'Resource Link') {
                      return <h3>No files uploaded</h3>;
                    } else if (proof.slice(-3) === 'pdf') {
                      return (
                        <a
                          href={process.env.REACT_APP_API + '/' + proof}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Click to view pdf file
                        </a>
                      );
                    } else if (
                      proof.slice(-4) === 'docx' ||
                      proof.slice(-3) === 'doc' ||
                      proof.slice(-4) === 'docm'
                    ) {
                      return (
                        <Link to={process.env.REACT_APP_API + '/' + proof}>
                          Click to download word document file
                        </Link>
                      );
                    } else {
                      return (
                        <Image
                          src={process.env.REACT_APP_API + '/' + proof}
                          alt="proof"
                          width={400}
                          height={230}
                        />
                      );
                    }
                  })}
                </Carousel>
              </div>
            </div>

            {selected.reason && (
              <div className="rejection-reason">
                <h5>Reason for Rejection</h5>
                <p>{selected.reason}</p>
              </div>
            )}
          </div>
        </Modal>
      ) : (
        openModal && (
          <Modal
            open={openModal}
            onCancel={() => {
              setopenModal(false);
              setSelected(null);
            }}
            centered
            bodyStyle={{ padding: '10px' }}
            footer={null}
          >
            <h3>{selected.description}</h3>
            <div className="claim-card-modal-mobile">
              <div className="modal-details-1-mobile">
                <div className="modal-status-mobile">
                  <h5>Status</h5>

                  <Steps
                    status={statusMappings[selected.status]}
                    size="small"
                    direction="vertical"
                    current={statusMappings[selected.currentStatus]}
                    items={[
                      {
                        title: 'Claim Submitted',
                      },
                      {
                        title: 'HR Approval',
                      },
                      {
                        title: 'Director Approval',
                      },
                      {
                        title: 'Reimbursement',
                      },
                    ]}
                  />
                </div>

                <div className="modal-proof-mobile">
                  <h5>Proof</h5>
                  {/* <Button
                    size="small"
                    type="primary"
                    onClick={() => setVisible(true)}
                  >
                    Show Proof
                  </Button> */}
                  <Carousel
                    dots={true}
                    arrows={true}
                    dotPosition="bottom"
                    nextArrow={<ArrowRightOutlined />}
                    prevArrow={<ArrowLeftOutlined />}
                    draggable
                  >
                    {selected.billProof.map((proof) => {
                      if (proof === 'Resource Link') {
                        return <h3>No files uploaded</h3>;
                      } else if (proof.slice(-3) === 'pdf') {
                        return (
                          <a
                            href={process.env.REACT_APP_API + '/' + proof}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Click to view pdf file
                          </a>
                        );
                      } else if (
                        proof.slice(-4) === 'docx' ||
                        proof.slice(-3) === 'doc' ||
                        proof.slice(-4) === 'docm'
                      ) {
                        return (
                          <Link to={process.env.REACT_APP_API + '/' + proof}>
                            Click to download word document file
                          </Link>
                        );
                      } else {
                        return (
                          <Image
                            src={process.env.REACT_APP_API + '/' + proof}
                            alt="proof"
                            width={400}
                            height={230}
                          />
                        );
                      }
                    })}
                  </Carousel>
                </div>
              </div>

              {selected.reason && (
                <div className="rejection-reason-mobile">
                  <h5>Reason for Rejection</h5>
                  <p>{selected.reason}</p>
                </div>
              )}
            </div>
          </Modal>
        )
      )}
    </>
  );
}

export default ExpenseList;
