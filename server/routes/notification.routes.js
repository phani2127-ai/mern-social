import express from 'express'
import notificationCtrl from '../controllers/notification.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/notifications')
  .get(authCtrl.requireSignin, notificationCtrl.listByUser)

router.route('/api/notifications/read')
  .put(authCtrl.requireSignin, notificationCtrl.markAsRead)

export default router
