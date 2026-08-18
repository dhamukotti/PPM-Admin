// ** React Imports
import { useState } from 'react'

// ** React Router Imports
import { Link, } from 'react-router'

// ** MUI Components
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { styled, keyframes } from '@mui/material/styles'

// ** Icons Imports

// ** Configs

// ** Layout Import

// ** Demo Imports

import { CircularProgress, Grid, useMediaQuery } from '@mui/material'

// Hook Imports
import { debounce } from 'lodash'
import { Controller, useForm } from 'react-hook-form'


import { pattern } from '../../constants/patterns'


// ** Logo path (served directly from /public, not imported as a module)
const logoMain = '/images/logo/logo-pp.png'

// ** Brand color
const BRAND_COLOR = '#1878B2'

// ** Inline SVG icon (replaces remix icon font "ri-arrow-left-s-line")
const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6L9 12L15 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ** Animations
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// ** Styled Components
const Card = styled(MuiCard)({
  maxWidth: '100%',
  animation: `${fadeSlideUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1)`,
  boxShadow: '0 8px 40px rgba(24, 120, 178, 0.12)',
  borderRadius: '1rem'
})

const LinkStyled = styled(Link)({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: BRAND_COLOR,
  fontWeight: 500,
  transition: 'opacity 0.2s ease, transform 0.2s ease',
  '&:hover': {
    opacity: 0.75,
    transform: 'translateX(-2px)'
  }
})

// ** Shared TextField styling for consistent focus/hover border color
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: BRAND_COLOR
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: BRAND_COLOR,
      borderWidth: '2px'
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px rgba(24, 120, 178, 0.15)`
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLOR
  }
}

// ** Shared Button styling with hover/press animation
const submitButtonSx = {
  borderRadius: '2rem',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  paddingY: '0.75rem',
  backgroundColor: BRAND_COLOR,
  boxShadow: '0 4px 14px rgba(24, 120, 178, 0.35)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#146390',
    boxShadow: '0 6px 20px rgba(24, 120, 178, 0.45)',
    transform: 'translateY(-1px)'
  },
  '&:active': {
    transform: 'translateY(0px) scale(0.98)'
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(24, 120, 178, 0.5)'
  }
}

type FormValidate = {
  email: string
}


const ForgotPassword = () => {
  // ** State
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ** Hooks
  const mdEndpoint = useMediaQuery('(min-width:1200px)')

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValidate>({
    defaultValues: {
      email: import.meta.env.DEV ? 'samad.saiyed.ss@gmail.com' : ''
    }
  })

  const onSubmit = async (data: FormValidate) => {
    console.log(data);
    setIsLoggingIn(true)
   
    setIsLoggingIn(false)
  }

  const debounceSubmit = debounce(onSubmit, 400)

  return (
    <Box
      bgcolor={'background.default'}
      height={'100%'}
      sx={{
        backgroundImage: 'url(/images/pages/login-bg.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: mdEndpoint ? `${window?.innerWidth * 0.7}px` : `${window?.innerWidth}px`
      }}
    >
      <Box height={'100dvh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Card sx={{ zIndex: 1, maxWidth: { sm: '35rem' } }}>
          <CardContent sx={{ padding: { xs: '3rem 2.25rem 1.75rem', sm: '6rem 4.5rem 3.5rem' } }}>
            <Box sx={{ mb: 6 }}>
              <Box display={'flex'} width={'100%'} justifyContent={'center'} mb={3}>
                <Box display={'flex'}>
                  <img
                    src={logoMain}
                    alt='PPM-Logo'
                    width={550}
                    height={140}
                    style={{ width: '100%', maxWidth: '550px', height: 'auto' }}
                  />
                </Box>
              </Box>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(debounceSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant='body1' fontSize={22} fontWeight={600}>
                    Forgot Password? 🔒
                  </Typography>
                  <Typography variant='body1'>
                    {`Enter your email and we'll send you instructions to reset your password`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {/* Email */}
                  <FormControl fullWidth>
                    <Controller
                      name='email'
                      control={control}
                      rules={{
                        required: 'Please enter a email',
                        pattern: { value: pattern.email, message: 'Please enter a valid email' }
                      }}
                      render={({ field: { value, onChange, onBlur } }: {
                        field: { value: string; onChange: (...event: unknown[]) => void; onBlur: () => void }
                      }) => (
                        <TextField
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors?.email)}
                          helperText={Boolean(errors?.email) && errors?.email?.message}
                          id='email'
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    size='large'
                    variant='contained'
                    type='submit'
                    disabled={isLoggingIn}
                    sx={submitButtonSx}
                  >
                    {isLoggingIn ? <CircularProgress size={22} color='inherit' /> : 'Send Reset Email'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography textAlign={'center'} display={'flex'} justifyContent={'center'}>
                    <LinkStyled to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ArrowLeftIcon />
                      <span>Back to Login</span>
                    </LinkStyled>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ForgotPassword