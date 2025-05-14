const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class DataRealtime extends Model {}
DataRealtime.init({
  gateway:   { type: DataTypes.STRING,  allowNull: false },
  time:      { type: DataTypes.DATE,    allowNull: false },
  voltLL:    { type: DataTypes.FLOAT,   allowNull: true },
  currentLL: { type: DataTypes.FLOAT,   allowNull: true },
  freq:      { type: DataTypes.FLOAT,   allowNull: true },
  kwh:       { type: DataTypes.FLOAT,   allowNull: true },
  kvar:      { type: DataTypes.FLOAT,   allowNull: true },
  kva:       { type: DataTypes.FLOAT,   allowNull: true },
  cosphi:    { type: DataTypes.FLOAT,   allowNull: true },
  vr:        { type: DataTypes.FLOAT,   allowNull: true },
  vs:        { type: DataTypes.FLOAT,   allowNull: true },
  vt:        { type: DataTypes.FLOAT,   allowNull: true },
  ir:        { type: DataTypes.FLOAT,   allowNull: true },
  is:        { type: DataTypes.FLOAT,   allowNull: true },
  it:        { type: DataTypes.FLOAT,   allowNull: true },
}, {
  sequelize,
  modelName: 'DataRealtime',
  tableName: 'data_realtime',
  timestamps: false
});

module.exports = DataRealtime;
