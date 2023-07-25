import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Carousel, Image } from 'antd';

function ImageModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Link
        onClick={handleShow}
        style={{ textDecoration: 'none', color: '#274dd6' }}
      >
        Bill Proof
      </Link>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bill Proofs uploaded</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="img-fluid"
            style={{ width: '90%', textAlign: 'center', padding: '20px' }}
          >
            <Carousel
              dots={true}
              arrows={true}
              dotPosition="bottom"
              nextArrow={<ArrowRightOutlined />}
              prevArrow={<ArrowLeftOutlined />}
              draggable
              style={{ margin: '2px' }}
            >
              {props.src.map((proof) => {
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
                      width={'90%'}
                    />
                  );
                }
              })}
            </Carousel>
          </div>

          {/* <Link to={props.src} target="blank">
            <img src={props.src} alt="bill proof" className="img-fluid" />
          </Link> */}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ImageModal;
