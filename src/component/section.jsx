import {React, useState, useEffect} from 'react'
import "../assets/css/section.css"
import FolderImage from '../assets/img/folderImage'
import { connect } from 'react-redux' 
import { getDataProductFromAPI} from '../config/firebase'
import {Button, Card} from 'react-bootstrap'


function Section({getProduct, dataRedux}){
    const [dataProduct, setDataProduct] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [idImage, setIdImage] = useState(0);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        getProduct();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */ 
    useEffect(() => {
        const fetchData = async () => {
        try { 
            if(dataRedux.product.length !== undefined) {
                setDataProduct(dataRedux.product); 
                setIsLoading(false);
            } 
        } catch (error) {
            console.log(error);
        }
        };

        fetchData();
    }, [dataRedux.product]);

    const idImageOpen = (id) => {
        setIdImage(id)
    }

    return(
        <div>
            <div className="containerSection">
                <img className="imageLogo" src={FolderImage.logoAlphaStore} alt="logo Alpha Store" /> 
                <div>selamat datang di Alpha Store</div>
                <div>selamat berbelanja</div>
            </div>
            <div className="containerPageSection">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                dataProduct.length === 0 ? (
                    <div>Product Masih Kosong</div> 
                ) : ( 
                    <div className='containerCardSection'>
                    {dataProduct.map((product, index) => (
                        <Card className='cardSection' key={index}>
                            {product.urlImageProduct === undefined ? (
                                <div className="imageProductUtamaSection">tidak ada gambar</div>
                            ): (
                                <Card.Img  variant="top" className="imageProductUtamaSection" src={product.urlImageProduct[idImage]} alt="logo Alpha Store" /> 
                            )}
                            <div className='containerImageProductSection'>
                                {product.urlImageProduct === undefined ? (
                                    <div className="imageProductSection">tidak ada gambar</div>    
                                ): (
                                    product.urlImageProduct.map((image, index) => (
                                        <Card.Img  variant="top" className="imageProductSection" key={index} src={image} alt="Alpha Store" onClick={() => idImageOpen(index)}/>
                                    ))
                                )} 
                            </div>           
                            <Card.Title className='titleProductSection'>{product.namaProduct}</Card.Title>  
                            <Button className='checkout'><a href={product.linkProduct}  target="_blank" rel="noopener noreferrer">checkout</a></Button> 
                        </Card> 
                    ))}
                    </div>
                ) 
            )} 
            </div> 

        </div>
    )
}


const reduxState = (state) => ({
    dataRedux: {
        product: state.product
    }
})
 
const reduxDispatch = (dispatch) => ({
    getProduct: () => dispatch(getDataProductFromAPI()), 
})

export default connect(reduxState, reduxDispatch) (Section);