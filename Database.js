// Example of using Mongoose to interact with the database
app.get('/api/users/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        res.json(user);
    } catch (error) {
        console.error('User retrieval error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
