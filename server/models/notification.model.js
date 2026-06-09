import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.ObjectId, ref: 'User' },
  type: { type: String, enum: ['like', 'follow', 'comment'], required: true },
  post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
})

export default mongoose.model('Notification', NotificationSchema)
