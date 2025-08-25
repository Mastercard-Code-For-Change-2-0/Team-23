import mongoose from 'mongoose';

const detailSchema = new mongoose.Schema({
  Name: { type: String, required: true }, //admin object id
  Uid : { type: String, required: true },
  Link : { type: String, required: true } 
});

const Details = mongoose.model('detail', detailSchema);

export default Details;