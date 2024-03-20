const ProductSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
});

const ProductModel = mongoose.model('Product', ProductSchema);


app.post('/api/products', verifyToken, async (req, res) => {
    try {
        const { productName, description, price } = req.body;
        const newProduct = new ProductModel({ productName, description, price, vendor: req.userId });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Product addition error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const products = await ProductModel.find().populate('vendor', 'vendorName');
        res.json(products);
    } catch (error) {
        console.error('Product retrieval error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
