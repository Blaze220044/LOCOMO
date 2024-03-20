const VendorSchema = new mongoose.Schema({
    vendorName: String,
    email: String,
    password: String,
    address: String,
    phoneNumber: String
});

const VendorModel = mongoose.model('Vendor', VendorSchema);


app.post('/api/vendors/register', async (req, res) => {
    try {
        const { vendorName, email, password, address, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new VendorModel({ vendorName, email, password: hashedPassword, address, phoneNumber });
        await newVendor.save();
        res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/vendors/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await VendorModel.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ vendorId: vendor._id }, 'secretkey');
        res.json({ token });
    } catch (error) {
        console.error('Vendor login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/vendors/profile', verifyToken, async (req, res) => {
    try {
        const vendor = await VendorModel.findById(req.userId);
        res.json(vendor);
    } catch (error) {
        console.error('Vendor profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
