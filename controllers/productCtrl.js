const Products = require('../models/productModel')

// Filter, sorting and paginating
// /api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)

class APIfeatures {
    constructor(query, queryString){
        // console.log("query",queryString)
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['page', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }

    sorting(){
        console.log("cek",this.queryString.sort)
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 50
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const FetchApriori = (params) => {
    // const mapped = params?.map((item, index) => {
    //     return { item: item.sold * item.price}
    // })
    const mapped2 = params?.map(item => {
       return {
            item : item.sold * item.price / 200011,
            totalapriori : item.sold / 20 * 139
       }
    })
    return {
        status : "succes data terkirim",
        result : params?.length,
        products : mapped2,
        product2 : params
    }
}

// const map1 = new Map([['name', 'Tom']]);
// const map2 = new Map([['age', 30]]);
// const map3 = new Map([['country', 'Chile']]);

// const FetchApriori = (params) => {
    
//     // const obj = {country: 'Chile'};

//     // map1.set(obj, {city: 'Santiago'});
    
//     const mapped = params?.map((item, index) => {
//         item[`tes`] = item.sold * item.price

//         return item
// })

//     return{
//         result : params?.length,
//         products : mapped
//     }
// }

// const Product = (params) => {
   

//     console.log(mapped)
// }

const productCtrl = {
    getProducts: async(req, res) =>{
        try {
            const features = new APIfeatures(Products.find(), req.query)
            .filtering().sorting()
            // .sorting().paginating()

            const products = await features.query
            res.json(FetchApriori(products))
            // res.json({
            //     status: 'success',
            //     result: products.length,
            //     products: products,
            // })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    createProduct: async(req, res) =>{
        try {
            const {product_id, title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            const product = await Products.findOne({product_id})
            if(product)
                return res.status(400).json({msg: "This product already exists."})
            
            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })

            await newProduct.save()
            res.json({msg: "Created a product"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async(req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req, res) =>{
        try {
            const {title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({msg: "Updated a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = productCtrl