const list = async (credentials, signal) => {
  try {
    let response = await fetch('/api/notifications', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      signal: signal
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (credentials) => {
  try {
    let response = await fetch('/api/notifications/read', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export { list, read }
