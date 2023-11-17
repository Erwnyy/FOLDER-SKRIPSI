import React, {useContext, useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'
import Swipers from '../../swiper/Swipers'


function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [total, setTotal] = useState({})
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    console.log(total, 'yoww total')

    const handleCheck = (id) =>{
        products.forEach(product => {
            if(product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const NilaiSuport = () => {
        // console.log('totallength', dataLength)
        const total = products.map((item) => (
                ({totalSuport: item.sold / 139 * 100, ...item})
                
        ))
        setTotal(total)
    }



    const deleteProduct = async(id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: {Authorization: token}
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const checkAll = () =>{
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () =>{
        products.forEach(product => {
            if(product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    useEffect(() => {
        NilaiSuport()
    }, [products])

    if(loading) return <div><Loading /></div>
    return (
        <>
        <Swipers/>
        <Filters />
        
        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }

        <div className="products">
            {
                products.map((product, index) => {
                    return <ProductItem key={product._id} product={product}
                    isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} total={total[index]}/>
                })
            } 
        </div>

        <LoadMore />
        {products.length === 0 && <Loading />}
        </>
    )
}

export default Products
