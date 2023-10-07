import { React, useState }  from "react";
import { Modal, Button, Form} from "react-bootstrap";
import '../assets/css/tambahMenu.css'
import {useMutation } from 'react-query'
import { connect } from 'react-redux'
import { createNewProductToApi } from '../config/firebase';

function ModalTambahMenu({show, onHide, createNewProduct}) {
    const [newProduct, setNewProduct] = useState({
        namaProduct:'',
        linkProduct:'',
        imageProduct:[],
    }) 

    const handleChange = (e) => {
      const { name, type } = e.target;
      if (type === "file") {
        const selectedFiles = Array.from(e.target.files);
        setNewProduct({
          ...newProduct, [name]: selectedFiles,
        });
      } else {
        setNewProduct({
          ...newProduct,
          [name]: e.target.value,
        });
      }
    }; 
    
    const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault(); 
      const isSuccess = await createNewProduct({namaProduct : newProduct.namaProduct, linkProduct : newProduct.linkProduct, imageProduct : newProduct.imageProduct});
      if (isSuccess) {
        setNewProduct({ 
          namaProduct:" ", 
          linkProduct:" ", 
          imageProduct:" ", 
        }); 
        window.location.reload()
      } 
    } catch (error) {
      console.log('error', error);
    }
  });

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} className="containerTambahProduct">
        <Modal.Header className="headerModalNewProduct" closeButton>
          <Modal.Title >Product Baru</Modal.Title>
        </Modal.Header>
        <Form className="formModalNewProduct" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Nama Product</Form.Label>
                <Form.Control className="controlModalNewMenu" name="namaProduct" type="text" placeholder="contoh: topi" onChange={handleChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Link Product</Form.Label>
                <Form.Control className="controlModalNewMenu" name="linkProduct" type="text" placeholder="contoh: https://www.google.com" onChange={handleChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label className="labelModalNewMenu">Gambar Product</Form.Label>
              <Form.Control className="controlModalNewMenu" type="file" name="imageProduct" id="imageProduct" onChange={handleChange} multiple/>
            </Form.Group>

            <Modal.Footer>
                <Button variant="primary" type="submit" className="buttonModalNewMenu">Tambah Product</Button>
            </Modal.Footer>
        </Form> 
      </Modal>
    )
}

const reduxDispatch = (dispatch) => ({
    createNewProduct: (newData) => dispatch(createNewProductToApi(newData))
  });
   
  export default connect(null, reduxDispatch)(ModalTambahMenu);
