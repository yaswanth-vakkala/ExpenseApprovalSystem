import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import {
  useCreateExpenseMutation,
  useUploadExpenseImagesMutation,
} from '../slices/expensesApiSlice';
import { useGetAllProjectsQuery } from '../slices/projectsApiSlice';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import FilesUploadComponent from './FilesUploadComponent';
import { message } from 'antd';

const ExpenseForm = () => {
  const [multipleFiles, setMultipleFiles] = useState('Resource Link');

  const { userInfo } = useSelector((state) => state.auth);
  const [empName, setEmpName] = useState(
    userInfo.firstName + ' ' + userInfo.lastName
  );
  const [empId, setEmpId] = useState(userInfo.userId);
  const [projName, setProjName] = useState('');
  const [projId, setProjId] = useState('');
  const [project, setProject] = useState();
  // const [billProof, setBillProof] = useState('Resource Link');
  let billProof = ['Resource Link'];
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  const {
    data: projects,
    refetch: projectsRefetch,
    isLoading: loadingProjects,
    error: projectsError,
  } = useGetAllProjectsQuery();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const [uploadExpenseImages, { isLoading: loadingUpload }] =
    useUploadExpenseImagesMutation();

  const handleMultipleFileChange = async (e) => {
    setMultipleFiles(e.target.files);
  };

  const handleImagesSubmit = async () => {
    // e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      if (multipleFiles === 'Resource Link') {
        return;
      } else if (
        multipleFiles[i].name.slice(-3) !== 'pdf' &&
        multipleFiles[i].name.slice(-4) !== 'jpeg' &&
        multipleFiles[i].name.slice(-3) !== 'jpg' &&
        multipleFiles[i].name.slice(-3) !== 'png' &&
        multipleFiles[i].name.slice(-4) !== 'docx' &&
        multipleFiles[i].name.slice(-3) !== 'doc' &&
        multipleFiles[i].name.slice(-4) !== 'docm'
      ) {
        toast.error('Only Image, pdf and word files can be uploaded');
        return;
      } else {
        formData.append('file', multipleFiles[i]);
      }
    }

    const res = await uploadExpenseImages(formData);
    let temp = [];
    for (let i = 0; i < res.data.files.length; i++) {
      temp.push(res.data.files[i].path);
    }
    // setBillProof(temp);
    billProof = temp;
    // fetch(`${process.env.REACT_APP_API}/api/upload`, {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     // Handle the response from the backend
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //   });

    // axios
    //   .post('http://localhost:3000/uploaddufichier', formData)
    //   .then((res) => res.data);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await handleImagesSubmit();
    } catch (err) {
      toast.error('file too large in size or file limit exceeded');
      return;
    }
    let amount = Math.round(Number(cost) * 100) / 100;
    let dt = new Date();
    const dateSplit = date.split('-');
    if (
      dateSplit[0] >= dt.getFullYear() &&
      dateSplit[1] >= dt.getMonth() + 1 &&
      dateSplit[2] > dt.getDate()
    ) {
      toast.error("Please don't select future date");
      return;
    }
    try {
      await createExpense({
        empName,
        empId,
        projName,
        projId,
        billProof,
        amount,
        description,
        date,
      });
      navigate('/');
      toast.success('Expense Created Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  function handleSelectChange(data) {
    setProject(data);
    setProjName(data.projName);
    setProjId(data.projId);
  }

  return (
    <>
      {/* <Link to="/" className="btn btn-light">
        Go Back
      </Link> */}

      <FormContainer>
        <h1>Add Expense</h1>
        <Form onSubmit={submitHandler}>
          {/* <Form.Group className="my-2" controlId="empName">
          <Form.Label>Employee Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Employee Name"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="empId">
          <Form.Label>Employee Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Employee Id"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          ></Form.Control>
        </Form.Group> */}

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

          {/* <Form.Group className="my-2" controlId="projName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Project Name"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="projId">
            <Form.Label>Project Id</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Project Id"
              value={projId}
              onChange={(e) => setProjId(e.target.value)}
              required
            ></Form.Control>
          </Form.Group> */}

          {/* <Form.Group className="my-2" controlId="billProof">
            <Form.Label>Bill Proof</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Bill Proof"
              value={billProof}
              onChange={(e) => setbillProof(e.target.value)}
              required
            ></Form.Control>
          </Form.Group> */}

          <Form.Group className="my-2" controlId="cost">
            <Form.Label>Amount(₹)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Bill Amount"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-3" controlId="billProof">
            <Form.Label>Upload all files of the bill at once</Form.Label>
            {/* <Form.Control
              type="text"
              placeholder="Enter image url"
              value={billProof}
              onChange={(e) => setBillProof(e.target.value)}
            ></Form.Control> */}
            <Form.Control
              label="Choose all files at once to upload"
              onChange={handleMultipleFileChange}
              type="file"
              multiple
              name="multipleImages"
            ></Form.Control>
            <Form.Label>
              Only 12 pdf, word, image files upto size 1mb each can be uploaded
            </Form.Label>
            {/* <Button onClick={handleImagesSubmit} className="my-2">
              Upload
            </Button> */}
            {/* {loadingUpload && <Loader />} */}
            {/* <FilesUploadComponent /> */}
            {/* <form>
              <input
                type="file"
                name="multipleImages"
                multiple
                onChange={handleMultipleFileChange}
              />
              <button onClick={handleImagesSubmit}>Upload</button>
            </form> */}
          </Form.Group>

          <Button disabled={isLoading} type="submit" variant="primary">
            Add Expense
          </Button>

          {isLoading && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ExpenseForm;
