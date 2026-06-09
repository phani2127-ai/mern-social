import Notification from '../models/notification.model'
import errorHandler from './../helpers/dbErrorHandler'

const listByUser = async (req, res) => {
  try {
    let notifications = await Notification.find({ receiver: req.auth._id })
                                          .populate('sender', '_id name')
                                          .populate('post', '_id text')
                                          .sort('-created')
                                          .exec()
    res.json(notifications)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.auth._id, read: false },
      { $set: { read: true } }
    )
    res.json({ message: "Notifications marked as read" })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  listByUser,
  markAsRead
}
