import React from 'react'
import { useState, useEffect } from 'react'
import { Avatar } from '@mantine/core'
import { Container } from '@mantine/core'
import { Stack } from '@mantine/core'
import { Text } from '@mantine/core'
import { Loader } from '@mantine/core'
import Service from '../../utils/http'

export default function ProfilePage() {
  const service = new Service()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await service.get('user/me')

      setUser(res)
    } catch (err) {
      console.error('Error fetching user profile):', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return (
      <Container mt="xl">
        <Stack align="center">
          <Loader
            color="grape"
            size="lg"
            type="bars"
          />
        </Stack>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container mt="xl">
        <Text c="red" ta="center">
          Error loading user profile
        </Text>
      </Container>
    )
  }

  return (
    <Container mt="xl">
      <Stack
        h={300}
        bg="var(--mantine-color-body)"
        align="center"
        justify="center"
        gap="lg"
      >
        <Avatar
          src={user.avatar}
          size={150}
          radius={150}
          alt={user.name}
        />

        <Text fw={700} size="xl">
          {user.name}
        </Text>

        <Text size="md">
          {user.email}
        </Text>

        <Text size="sm" c="dimmed">
          Joined on:{' '}
          {user.createdAt
            ? new Date(
                user.createdAt
              ).toLocaleDateString()
            : 'N/A'}
        </Text>
      </Stack>
    </Container>
  )
}