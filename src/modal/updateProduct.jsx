import { React, useState, useEffect }  from "react";
import { Modal, Button, Form} from "react-bootstrap";
import '../assets/css/tambahMenu.css'
import { updateProductToApi } from '../config/firebase';
import { useMutation } from 'react-query'
import { connect } from 'react-redux' 

function ModalTambahMenu({show, onHide, idProduct, updateProduct, dataRedux}) {
    const [dataUpdateProduct, setDataUpdateProduct] = useState({
        namaProduct:'',
        linkProduct:'',
        id:'',
    })
 
    useEffect(() => {
        if(idProduct !== undefined) {
            const productById = dataRedux.product.find(product => product.id === idProduct); 
            setDataUpdateProduct({
                namaProduct: productById.namaProduct,
                linkProduct: productById.linkProduct,
                id: productById.id,
            });
        }
    }, [idProduct, dataRedux.product]); 

    const handleChange = (e) => {
        setDataUpdateProduct({
            ...dataUpdateProduct,
            [e.target.name]: e.target.value,
        })
    }
    
    const handleSubmit = useMutation(async (e) => {
        try {
          e.preventDefault();
          const userDataLocalStorage = JSON.parse(localStorage.getItem('userData'));
          const data = { 
            namaProduct : dataUpdateProduct.namaProduct,
            linkProduct : dataUpdateProduct.linkProduct,
            id : dataUpdateProduct.id,
            userId : userDataLocalStorage.uid,
          } 
          const isSuccess = await updateProduct(data)
          if (isSuccess) {  
            setDataUpdateProduct({
                namaProduct:'',
                linkProduct:'', 
            })
            window.location.reload()
            }
        } catch (error) { 
          console.log('error', error)
        }
      });
    
    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} className="containerTambahProduct">
        <Modal.Header className="headerModalNewProduct" closeButton>
          <Modal.Title >Update Product</Modal.Title>
        </Modal.Header>
        <Form className="formModalNewProduct" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Nama Product</Form.Label>
                <Form.Control className="controlModalNewMenu" value={dataUpdateProduct.namaProduct} name="namaProduct" type="text" placeholder="contoh: topi" onChange={handleChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Link Product</Form.Label>
                <Form.Control className="controlModalNewMenu" value={dataUpdateProduct.linkProduct} name="linkProduct" type="text" placeholder="contoh: https://www.google.com" onChange={handleChange} required/>
            </Form.Group> 

            <Modal.Footer>
                <Button variant="primary" type="submit" className="buttonModalNewMenu">Update Product</Button>
            </Modal.Footer>
        </Form> 
      </Modal>
    )
}

const reduxState = (state) => ({ 
    dataRedux :{ 
      product: state.product, 
    }
  });

const reduxDispatch = (dispatch) => ({
    updateProduct: (updateData) => dispatch(updateProductToApi(updateData))
  });
   
export default connect(reduxState, reduxDispatch)(ModalTambahMenu);