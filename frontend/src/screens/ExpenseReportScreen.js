import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  useCreateExpenseReportMutation,
  useCreateProjectExpenseReportMutation,
} from '../slices/expensesApiSlice';
import { useGetAllProjectsQuery } from '../slices/projectsApiSlice';
import Select from 'react-select';

import '../assets/styles/card.css';
import ProjectPDFDocument from '../components/ProjectPDFDocument';
import ExpensesPDFDocument from '../components/ExpensesPDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

const ExpenseReportScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // const dt = new Date();
  // const currentMonth = dt.getMonth() + 1;
  // let edate = new Date(dt.getFullYear(), currentMonth, 0);
  // edate = edate.getDate();
  // edate = dt.getFullYear() + '-' + currentMonth + '-' + edate;
  // const sdate = dt.getFullYear() + '-' + currentMonth + '-' + 1;

  const [getExpenseReport, { isLoading, error }] =
    useCreateExpenseReportMutation();
  const [
    getProjectExpenseReport,
    { isLoading: loadingProject, error: projectError },
  ] = useCreateProjectExpenseReportMutation();

  const {
    data: projects,
    refetch: projectsRefetch,
    isLoading: loadingProjects,
    error: projectsError,
  } = useGetAllProjectsQuery();

  // const [firstDay, setFirstDay] = useState(sdate);
  // const [lastDay, setLastDay] = useState(edate);
  const [firstDay, setFirstDay] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [report, setReport] = useState('');
  const [projectReport, setProjectReport] = useState('');
  const [project, setProject] = useState();

  // useEffect(() => {
  //   const res = getExpenseReport({ firstDay, lastDay });
  //   console.log(res);
  //   setReport(res);
  // }, []);

  function handleSelectChange(data) {
    setProject(data);
  }

  const projectSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const projectId = project.projId;
      const res = await getProjectExpenseReport({ projectId });
      setProjectReport(res);
      toast.success('Report generated Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await getExpenseReport({ firstDay, lastDay });
      setReport(res);
      toast.success('Report generated Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  function formatTime(avgHours) {
    let days = Math.floor(avgHours / 24);
    let remainder = avgHours % 24;
    let hours = Math.floor(remainder);
    let minutes = Math.floor(60 * (remainder - hours));
    return days + ' days ' + hours + ' hours ' + minutes + ' minutes';
  }

  return (
    <>
      <FormContainer>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h1>Get report for a date range</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="sdate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={firstDay}
                  onChange={(e) => setFirstDay(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="edate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={lastDay}
                  onChange={(e) => setLastDay(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="my-3">
                Get report
              </Button>
            </Form>
            {report && (
              <Card className="custom-mobileResponsive">
                <Card.Body>
                  <Card.Title>Report</Card.Title>
                  <Card.Text>
                    Total no of Expenses received during the selected time
                    period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(report.data.report1[0].count) +
                        Number(report.data.report2[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total no of Expenses reimbursed during the selected time
                    period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(report.data.report1[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total no of Expenses Rejected or In Process during the
                    selected time period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(report.data.report2[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses submitted during the selected time
                    period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(report.data.report1[0].totalExpenseCost) +
                          Number(report.data.report2[0].totalExpenseCost)
                      )}{' '}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses Reimbursed during the selected time
                    period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(report.data.report1[0].totalExpenseCost)
                      )}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses Rejected or In Process during the
                    selected time period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(report.data.report2[0].totalExpenseCost)
                      )}
                    </span>{' '}
                  </Card.Text>

                  <Card.Text>
                    Average Reimbursement time calculated based on only
                    reimbursed expenses during the selected time period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {formatTime(Number(report.data.report3[0].avgTime))}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Average Processing time calculated based on reimbursed and
                    Rejected expenses during the selected time period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {formatTime(Number(report.data.report4[0].avgTime))}
                    </span>{' '}
                  </Card.Text>
                  <PDFDownloadLink
                    document={
                      <ExpensesPDFDocument
                        report={report}
                        empName={userInfo.firstName + ' ' + userInfo.lastName}
                        empId={userInfo.userId}
                        sdate={firstDay}
                        edate={lastDay}
                      />
                    }
                    fileName="ExpensesReport"
                  >
                    {({ loading }) =>
                      loading ? (
                        <Button>Loading Document...</Button>
                      ) : (
                        <Button>Download Report</Button>
                      )
                    }
                  </PDFDownloadLink>
                </Card.Body>
              </Card>
            )}
            <Form onSubmit={projectSubmitHandler}>
              <Form.Group className="my-2" controlId="project">
                <Form.Label>Select project from the list</Form.Label>
                <Select
                  options={projects}
                  getOptionLabel={(option) =>
                    option.projName + ' ( project Id : ' + option.projId + ')'
                  }
                  getOptionValue={(option) => option.projId}
                  placeholder="Select Project"
                  value={project}
                  onChange={handleSelectChange}
                  isSearchable={true}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="my-3">
                Get report
              </Button>
            </Form>
            {projectReport && (
              <Card className="custom-mobileResponsive">
                <Card.Body>
                  <Card.Title>Report</Card.Title>
                  <Card.Text>
                    Total no of expense received for the Project:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(projectReport.data.projectReport1[0].count) +
                        Number(projectReport.data.projectReport2[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total no of Expenses reimbursed for the Project period:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(projectReport.data.projectReport1[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total no of Expenses Rejected or In Process for the project:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {Number(projectReport.data.projectReport2[0].count)}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses submitted for the project:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(
                          projectReport.data.projectReport1[0].totalExpenseCost
                        ) +
                          Number(
                            projectReport.data.projectReport2[0]
                              .totalExpenseCost
                          )
                      )}{' '}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses Reimbursed for the project:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(
                          projectReport.data.projectReport1[0].totalExpenseCost
                        )
                      )}{' '}
                    </span>{' '}
                  </Card.Text>
                  <Card.Text>
                    Total cost of Expenses Rejected or In Process for the
                    project:{' '}
                    <span style={{ color: '#000000' }}>
                      {' '}
                      {currencyFormatter.format(
                        Number(
                          projectReport.data.projectReport2[0].totalExpenseCost
                        )
                      )}{' '}
                    </span>{' '}
                  </Card.Text>
                  <PDFDownloadLink
                    document={
                      <ProjectPDFDocument
                        projectReport={projectReport}
                        projName={project.projName}
                        projId={project.projId}
                        empName={userInfo.firstName + ' ' + userInfo.lastName}
                        empId={userInfo.userId}
                      />
                    }
                    fileName="ProjectExpenseReport"
                  >
                    {({ loading }) =>
                      loading ? (
                        <Button>Loading Document...</Button>
                      ) : (
                        <Button>Download Report</Button>
                      )
                    }
                  </PDFDownloadLink>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </FormContainer>
    </>
  );
};

export default ExpenseReportScreen;
