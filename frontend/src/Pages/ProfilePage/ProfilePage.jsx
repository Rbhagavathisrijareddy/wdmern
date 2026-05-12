// this is a page of profile of user, where the profile is seen with things like avatar, name , email with usestate and useeffect
import React, { useState, useEffect } from 'react'
import HttpService from '../../utils/http'
import { Loader, Avatar, Text, Container, Stack } from '@mantine/core'

export default function ProfilePage() {
  const service = new HttpService()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  
  const fetchUser = async () => {
    try {
      const res = await service.get('user/me')
      setUser(res)
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchUser()
  }, [])
  if (loading) {
    return <Loader color="grape" size="lg" type="bars" />
  }

  if (!user) {
    return <Text color="red">Error loading user profile</Text>
  }

  return (
    <Container>
      <Stack
        h={300}
        bg="var(--mantine-color-body)"
        align="center"
        justify="center"
        gap="lg"
      >
        <Avatar src={user.avatar} size={150} radius={150} alt="it's me" />
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
      </Stack>
    </Container>
  )
}

