import {React, useState, useEffect} from 'react'
import "../assets/css/section.css"
import FolderImage from '../assets/img/folderImage'
import { connect } from 'react-redux' 
import { getDataProductFromAPI} from '../config/firebase'


function Section({getProduct, dataRedux}){
    const [dataProduct, setDataProduct] = useState([])
    const [isLoading, setIsLoading] = useState(true);

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
    return(
        <div>
            <div className="containerSection">
                <img className="imageLogo" src={FolderImage.logoAlphaStore} alt="logo Alpha Store" /> 
                <div>selamat datang di Alpha Store</div>
                <div>selamat berbelanja</div>
            </div>
            <div className="containerItem">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                dataProduct.length === 0 ? (
                    <div>Product Masih Kosong</div> 
                ) : ( 
                    dataProduct.map((product, index) => (
                        <a href={product.linkProduct} className="cssItem" key={index} target="_blank" rel="noopener noreferrer">
                        {index + 1}. {product.namaProduct}
                        </a>
                    ))
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