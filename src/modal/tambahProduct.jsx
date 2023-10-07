import { React }  from "react";
import { Modal, Button, Form} from "react-bootstrap";
import '../assets/css/tambahMenu.css'

function ModalTambahMenu({show, onHide}) {
    
    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} className="containerTambahProduct">
        <Modal.Header className="headerModalNewProduct" closeButton>
          <Modal.Title >Product Baru</Modal.Title>
        </Modal.Header>
        <Form className="formModalNewProduct">
            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Nama Product</Form.Label>
                <Form.Control className="controlModalNewMenu" name="namaProduct" type="text" placeholder="contoh: topi"  required/>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label className="labelModalNewMenu">Link Product</Form.Label>
                <Form.Control className="controlModalNewMenu" name="linkProduct" type="text" placeholder="contoh: https://www.google.com"  required/>
            </Form.Group> 

            <Modal.Footer>
                <Button variant="primary" type="submit" className="buttonModalNewMenu">Tambah Product</Button>
            </Modal.Footer>
        </Form> 
      </Modal>
    )
}

export default ModalTambahMenu
