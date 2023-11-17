import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import dataSupport from './dummy.json';

function DashboardAdmin() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [produk, setProduk] = state.productsAPI.products
    const [total, setTotal] = useState([])
    const [confidense, setConfidense] = useState([])
    const [totalhistory, setTotalhistory] = useState([])
    const [nilai, setNilai] = useState({})
    const [support, setSupport] = useState("")
    console.log('total', dataSupport)
    console.log('totalhistory', history)

    // console.log('produk',produk)
    // console.log('history',history)
    // const totaldata = history.length;
    // console.log('history',totaldata)

    const abc = produk.map((total, item) => { return total.sold })



    const NilaiSuport = () => {
        const dataLength = history.length
        // console.log('totallength', dataLength)
        const total = produk.map((item) => {

            return {
                totalhistory: item,
                totalSuport: item.sold / 139 * 100,

            }
        })
        setTotal(total)
    }



    const NilaiConfidence = () => {
        const total = history.map((item) => {

            return {
                nilaiconfidence: item.cart.length,
                user: item,

            }
        })
        setConfidense(total)

    }

    useEffect(() => {
        if (produk && history) {
            NilaiConfidence()
        }

    }, [produk, history])


    useEffect(() => {
        if (produk && history) {
            NilaiSuport()
        }

    }, [produk, history])

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                } else {
                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])

    return (
        <div className="history-page">

            {total?.totalSuport >= '14' &&
                <div style={{ position: "absolute" }}>
                    <img src='/bestseller.png' style={{ width: "35%", height: "35%", padding: "5px" }} />
                </div>
            }

            {/* <div style={{width:"200px"}}>
                {history.map((item, index) => 
                <div style={{display:"grid"}}>
                
                    <ul style={{marginTop:"20px" ,display:"flex", flexWrap:"wrap", listStyleType:"none", fontSize:"20px", fontWeight:"700"}}>{item.name}</ul>
                    {item.cart.map((dataItem, index) => {
                        console.log(dataItem)
                    return (
                    <tr style={{display:"flex", flexWrap:"wrap", listStyleType:"none", border:"1px solid grey", padding:"15px"}}>{dataItem.title}</tr>
                    
                    )
                })}
                </div>)}
            </div> */}

            <div style={{ margin: "17px" }}>

            </div>

            <h2>TABLE USER BELI BARANG</h2>
            <div style={{ width: "100%", display: "flex" }}>
                <div className='whitescroll'>
                    {/* {total.map((e, index) => (
                        <div>
                            <h1>{e.totalSuport}%</h1>
                            <div>
                                {e.totalhistory.title}
                            </div>


                        </div>))} */}

                    {/* {e.totalhistory.map((subMenuItem, index) => {
                                        return (
                                        <div>
                                            {subMenuItem.title}
                                        </div>
                                        )
                                    })} */}


                    {/* {e.totalhistory.map((item, index) => (
                <div>
                    {item.title}
                </div>))} */}

                    <table className='table-report-product' style={{ marginBottom: "40px" }}>
                        <thead>
                            <tr>

                                <th className='table-head'>Aturan Asosiasi</th>
                                <th className='table-head'>Nilai Confidence</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataSupport.menu.map((e, index) =>
                                <tr >

                                    <td className='table-body'>{e.support1}</td>
                                    <td className='table-body'>
                                        <div style={{ display: "flex" }}>
                                            {e.children}%
                                            {e?.children >= `14` &&
                                                <div style={{ position: "absolute", marginLeft: "35px", }}>
                                                    <img src='/bestseller.png' style={{ width: "7%", height: "7%", padding: "5px" }} />
                                                </div>
                                            }
                                        </div>
                                        </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                    <table className='table-report-product'>
                        <thead>
                            <tr>
                                <th className='table-head row-left'>No</th>
                                <th className='table-head'>Nama Produk</th>
                                <th className='table-head'>NilaiSuport</th>
                                <th className='table-head'>Total Terjual</th>
                            </tr>
                        </thead>

                        <tbody>
                            {total.map((e, index) =>
                                <tr >
                                    <td className='table-body row-left'>{index + 1}</td>
                                    <td className='table-body'>{e.totalhistory.title}</td>
                                    <td className='table-body'>{e.totalSuport}%</td>
                                    <td className='table-body'>
                                        <div style={{ display: "flex" }}>
                                            {e.totalhistory.sold}
                                            {e?.totalSuport >= `14` &&
                                                <div style={{ position: "absolute", marginLeft: "20px", }}>
                                                    <img src='/bestseller.png' style={{ width: "10%", height: "10%", padding: "5px" }} />
                                                </div>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* {dataTransaksi.length === 0 && <Loading />} */}
                </div>
            </div>
            {/* <h2 style={{ marginTop:"5rem"}}>TABLE CONFIDENCE</h2> */}
            <div style={{ width: "100%", display: "flex", marginTop: "5rem" }}>

                <div className='whitescroll'>
                    {/* <table className='table-report-product'>
                        <thead>
                            <tr>
                                <th className='table-head row-left'>No</th>
                                <th className='table-head'>Nama Produk</th>
                                <th className='table-head'>Total Beli</th>
                                <th className='table-head'>Produk Dibeli</th>

                                <th className='table-head'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {confidense.map((e, index) =>
                                <tr >
                                    <td className='table-body row-left'>{index + 1}</td>
                                    <td className='table-body'>{e.user.name}</td>
                                    <td className='table-body'>{e.nilaiconfidence}</td>
                                    <td className='table-body'>{e.nilaiconfidence * abc}</td>
                                    <td className='table-body'><h4 style={{ color: "#99BBED", cursor: "pointer" }}>Details</h4></td>
                                </tr>
                            )}
                        </tbody>
                    </table> */}
                    {/* {dataTransaksi.length === 0 && <Loading />} */}
                </div>
            </div>

        </div>
    )
}

export default DashboardAdmin
