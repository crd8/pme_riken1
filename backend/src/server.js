require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const sequelize = require('./config/database');
const dataRoutes= require('./routes/dataRoutes');
const dataTableRoutes = require('./routes/dataTableRoutes');
const usageRoutes = require('./routes/usageRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/data', dataRoutes);
app.use('/api/data-table', dataTableRoutes);
app.use('/api/usage', usageRoutes);

sequelize.authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
