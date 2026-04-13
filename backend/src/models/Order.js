const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  razorpayOrderId: { 
    type: String, 
    required: true 
  },
  razorpayPaymentId: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  planId: { 
    type: String, 
    required: true,
    enum: ['1_month', '3_months', '1_year']
  },
  status: { 
    type: String, 
    default: 'completed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
