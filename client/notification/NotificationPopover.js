import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import FavoriteIcon from '@material-ui/icons/Favorite'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { list, read } from './api-notification'

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  list: {
    width: 300,
    maxHeight: 400,
    overflowY: 'auto'
  },
  listItem: {
    borderBottom: '1px solid #eee'
  },
  unread: {
    backgroundColor: 'rgba(255, 167, 38, 0.1)'
  }
}))

export default function NotificationPopover() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    if (!jwt) return
    const abortController = new AbortController()
    const signal = abortController.signal

    list({ t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setNotifications(data || [])
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    // Mark as read when opened
    read({ t: jwt.token }).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        const updated = notifications.map(n => ({ ...n, read: true }))
        setNotifications(updated)
      }
    })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'notification-popover' : undefined
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <IconButton aria-label="Notifications" color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <FavoriteIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List className={classes.list}>
          {notifications.length === 0 ? (
            <Typography className={classes.typography}>No notifications yet.</Typography>
          ) : (
            notifications.map((notification, i) => {
              let text = ''
              let link = `/user/${notification.sender._id}`
              if (notification.type === 'like') {
                text = `${notification.sender.name} liked your post.`
              } else if (notification.type === 'comment') {
                text = `${notification.sender.name} commented on your post.`
              } else if (notification.type === 'follow') {
                text = `${notification.sender.name} started following you.`
              }

              return (
                <ListItem 
                  button 
                  component={Link} 
                  to={link} 
                  key={i} 
                  onClick={handleClose}
                  className={`${classes.listItem} ${!notification.read ? classes.unread : ''}`}
                >
                  <ListItemAvatar>
                    <Avatar src={'/api/users/photo/' + notification.sender._id} />
                  </ListItemAvatar>
                  <ListItemText primary={text} secondary={(new Date(notification.created)).toDateString()} />
                </ListItem>
              )
            })
          )}
        </List>
      </Popover>
    </>
  )
}
