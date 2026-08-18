'use client'

import { useState } from 'react'

import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { Grid2 } from '@mui/material'

import ProfileTabs from './tabs'
import UpdateProfileDialog from './update-dialog'
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// Local type definition (replacing the import from '@/services/modules/profile/types')
interface Country {
  ID: number
  Name: string
}

interface ProfileData {
  ProfilePicture?: string | null
  Name?: string
  Email?: string
  country?: Country | null
  Address?: string
}

// Local helper function (replacing the import from '@/utils/getInitials')
const getInitials = (name: string = 'User'): string => {
  if (!name) return 'U'
  const nameParts = name.trim().split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
}

interface UserDetailsProps {
  title: string
  value: string
}

const UserDetails = ({ title, value }: UserDetailsProps) => {
  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      <Typography fontWeight={600} fontSize={15}>
        {title}:
      </Typography>
      <Typography fontSize={15}>{value}</Typography>
    </Box>
  )
}

interface OverviewCardProps {
  data: ProfileData
  refetch: () => void
}

const OverviewCard = ({ data, refetch }: OverviewCardProps) => {
  const [open, setOpen] = useState(false)
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  // Theme-based colors
  const backgroundColor = isDark ? '#0F1828' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a1a2e';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#4a4a6a';
  const cardShadow = isDark 
    ? '0 8px 32px rgba(0,0,0,0.4)' 
    : '0 8px 32px rgba(0,0,0,0.08)';
  const cardHoverShadow = isDark 
    ? '0 12px 48px rgba(0,0,0,0.6)' 
    : '0 12px 48px rgba(0,0,0,0.12)';
  const avatarBgColor = isDark ? '#1a2a40' : '#1878B2';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 120, 178, 0.15)';

  return (
    <Card 
      sx={{ 
        borderRadius: '16px',
        boxShadow: cardShadow,
        transition: 'all 0.3s ease',
        backgroundColor: backgroundColor,
        '&:hover': {
          boxShadow: cardHoverShadow,
        },
        overflow: 'hidden',
      }}
    >
      {/* Gradient Header */}
      <Box 
        sx={{ 
          height: '120px', 
          background: isDark 
            ? 'linear-gradient(135deg, #0F1828 0%, #1a2a40 100%)'
            : 'linear-gradient(135deg, #1878B2 0%, #1a8bc7 100%)',
          position: 'relative',
        }} 
      />
      
      <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          {/* Avatar */}
          <Box 
            display={'flex'} 
            alignItems={'center'} 
            justifyContent={'center'} 
            sx={{ mt: '-60px' }}
          >
            <Avatar
              variant='rounded'
              sx={{ 
                width: 120, 
                height: 120, 
                boxShadow: isDark 
                  ? '0 4px 20px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(24, 120, 178, 0.25)',
                border: `4px solid ${isDark ? '#1a2a40' : 'white'}`,
                borderRadius: '16px',
                backgroundColor: avatarBgColor,
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 600,
              }}
              src={data?.ProfilePicture || undefined}
            >
              {getInitials(data?.Name)}
            </Avatar>
          </Box>

          {/* Name */}
          <Typography 
            fontSize={20} 
            fontWeight={700} 
            textAlign={'center'}
            sx={{ 
              color: textColor,
              letterSpacing: '0.5px',
              mt: 1,
            }}
          >
            {data?.Name}
          </Typography>

          {/* Details Section */}
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography 
              fontSize={18} 
              fontWeight={600}
              sx={{ 
                color: isDark ? '#4a6a8a' : '#1878B2',
                letterSpacing: '0.3px',
              }}
            >
              Account Details
            </Typography>
            <Divider sx={{ borderColor: dividerColor }} />
            
            <Box sx={{ 
              '& .MuiTypography-root': { 
                color: isDark ? secondaryTextColor : '#4a4a6a' 
              },
              '& .MuiTypography-root:last-child': { 
                color: isDark ? '#FFFFFF' : '#1a1a2e',
                fontWeight: 500,
              }
            }}>
              <UserDetails 
                title={'Name'} 
                value={data?.Name || ''} 
              />
              <UserDetails 
                title={'Email'} 
                value={data?.Email?.toLowerCase() || ''}
              />
              <UserDetails 
                title={'Country'} 
                value={data?.country?.Name || ''}
              />
              <UserDetails 
                title={'Address'} 
                value={data?.Address || '-'}
              />
            </Box>
          </Box>

          {/* Edit Button */}
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
            <Button 
              variant='contained' 
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: '#1878B2',
                color: 'white',
                borderRadius: '12px',
                padding: '10px 40px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(24, 120, 178, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#146394',
                  boxShadow: '0 6px 24px rgba(24, 120, 178, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </CardContent>
      
      <UpdateProfileDialog 
        open={open} 
        close={() => setOpen(false)} 
        data={data} 
        refetch={refetch} 
      />
    </Card>
  )
}

const UserProfilePage = () => {
  // Static data
  const data: ProfileData = {
    ProfilePicture: null,
    Name: "John Doe",
    Email: "john.doe@example.com",
    country: {
      ID: 1,
      Name: "United States"
    },
    Address: "123 Main Street, New York"
  }

  const refetch = () => {
    console.log("Refetching profile data...")
  }

  return (
    <Grid2 container spacing={6}>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <OverviewCard data={data} refetch={refetch} />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <ProfileTabs />
      </Grid2>
    </Grid2>
  )
}

export default UserProfilePage