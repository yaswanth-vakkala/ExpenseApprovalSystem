import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useAddMoneyMutation,
} from '../../slices/usersApiSlice';

const AddMoneyScreen = () => {
  const { id: employeeId } = useParams();
  const [money, setMoney] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(employeeId);

  const [addMoney, { isLoading: loadingUpdate }] = useAddMoneyMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    let moneyToBeAdded = Number(money) + Number(user.amount);
    try {
      await addMoney({
        employeeId,
        amount: moneyToBeAdded,
      });
      refetch();
      if (userInfo.userType === 'Admin') {
        navigate('/admin/userlist');
      } else {
        navigate('/userlist');
      }
      toast.success('Money added Successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <FormContainer>
            <h1>Add money to user account</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2" controlId="money">
                <Form.Label>Enter Amount</Form.Label>
                <Form.Control
                  type="Number"
                  placeholder="Enter Amount to be added"
                  value={money}
                  onChange={(e) => setMoney(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Container className="d-flex justify-content-end">
                <Button
                  variant="danger"
                  onClick={() => {
                    userInfo.userType === 'Admin'
                      ? navigate('/admin/userlist')
                      : navigate('/userlist');
                  }}
                  className="m-2"
                  style={{ color: 'white' }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="my-2">
                  Add Money
                </Button>
              </Container>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default AddMoneyScreen;
