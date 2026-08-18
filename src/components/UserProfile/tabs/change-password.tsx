// ** React Imports
import { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import 'remixicon/fonts/remixicon.css'
// ** MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { TextField } from '@mui/material'
import toast from 'react-hot-toast'
import Divider from '@mui/material/Divider'

// ** Custom Functions
import { pattern } from '../../../constants/patterns'
import { useTheme as useCustomTheme } from "../../../context/ThemeContext";

type FormType = {
  password: string
  confirm_password: string
}

const resetPasswordRules = {
  defaultValues: {
    password: '',
    confirm_password: ''
  },
  password: {
    required: { value: true, message: 'Please enter password' },
    pattern: {
      value: pattern.passwordPattern,
      message:
        'Password must contain 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character, whitespace not allowed'
    }
  },
  confirm_password: {
    required: { value: true, message: 'Please enter confirm password' }
  }
}

const ChangePasswordProfile = () => {
  // ** States
  const [values, setValues] = useState({
    showNewPassword: false,
    showConfirmNewPassword: false
  })

  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const {
    control,
    getValues,
    reset,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormType>({
    defaultValues: resetPasswordRules.defaultValues
  })

  useEffect(() => {
    reset()
  }, [reset])

  // Handle Password
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  // Handle Confirm Password
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onSubmit = async (data: FormType) => {
    console.log(data)
    try {
      // API call removed - just show success message and reset
      reset()
      toast.success('Changed Password Successfully!!')
    } catch {}
  }

  // Theme-based colors
  const cardBgColor = isDark ? '#0F1828' : '#FFFFFF';
  const headerBgColor = isDark ? '#1a2a40' : '#f8fafc';
  const textColor = isDark ? '#FFFFFF' : '#1a2a3a';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#5a6b7c';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const alertBgColor = isDark ? 'rgba(255, 193, 7, 0.15)' : '#fff8e6';
  const alertBorderColor = isDark ? 'rgba(255, 193, 7, 0.3)' : '#ffd966';
  const alertTextColor = isDark ? '#ffd966' : '#856404';

  return (
    <Card 
      sx={{ 
        mt: 5, 
        borderRadius: '12px',
        boxShadow: isDark 
          ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.08)' 
          : '1px solid #e8edf2',
        backgroundColor: cardBgColor,
      }}
    >
      <CardHeader 
        title={'Change Password'} 
        sx={{
          backgroundColor: headerBgColor,
          borderBottom: isDark 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid #e8edf2',
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: textColor,
            letterSpacing: '0.3px'
          }
        }}
        titleTypographyProps={{
          variant: 'h6'
        }}
      />
      
      <CardContent sx={{ p: 6 }}>
        <Alert
          icon={false}
          severity='warning'
          sx={{
            mb: 6,
            borderRadius: '8px',
            backgroundColor: alertBgColor,
            border: isDark 
              ? `1px solid ${alertBorderColor}`
              : '1px solid #ffd966',
            '& .MuiAlertTitle-root': {
              color: alertTextColor
            },
            '& .MuiAlert-message': {
              color: alertTextColor
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, mb: theme => `${theme.spacing(1)} !important` }}>
            {'Ensure that these requirements are met'}
          </AlertTitle>
          {'Minimum 8 characters long, uppercase & symbol'}
        </Alert>

        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* New Password */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='password'
                  control={control}
                  rules={resetPasswordRules.password}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      autoComplete='off'
                      label={'New Password'}
                      value={value}
                      id='profile-view-security-new-password'
                      onChange={e => {
                        onChange(e)
                        trigger('password')
                      }}
                      type={values.showNewPassword ? 'text' : 'password'}
                      inputProps={{ 'data-testid': 'new-password' }}
                      error={Boolean(errors.password)}
                      helperText={errors?.password?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: inputBgColor,
                          '& fieldset': {
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : '#d0d7de'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1878B2'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1878B2',
                            borderWidth: '2px'
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#d32f2f'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: isDark ? secondaryTextColor : '#5a6b7c',
                          '&.Mui-focused': {
                            color: '#1878B2'
                          },
                          '&.Mui-error': {
                            color: '#d32f2f'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: isDark ? '#FFFFFF' : undefined,
                        },
                        '& .MuiFormHelperText-root': {
                          marginLeft: 0,
                          fontWeight: 400,
                          color: isDark ? '#ff6b6b' : undefined,
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              id={'profile-show-new-password'}
                              onClick={handleClickShowNewPassword}
                              data-testid='show-new-password'
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                              sx={{
                                color: isDark ? secondaryTextColor : '#5a6b7c',
                                '&:hover': {
                                  color: '#1878B2'
                                }
                              }}
                            >
                              <i className={values.showNewPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='confirm_password'
                  control={control}
                  rules={{
                    ...resetPasswordRules.confirm_password,
                    validate: value => value === getValues('password') || 'Password did not match'
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoComplete='off'
                      value={value}
                      onBlur={onBlur}
                      label={'Confirm New Password'}
                      id='user-view-security-confirm-new-password'
                      inputProps={{ 'data-testid': 'confirm-password' }}
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      onChange={e => {
                        onChange(e)
                        trigger('confirm_password')
                      }}
                      helperText={errors?.confirm_password?.message}
                      error={Boolean(errors.confirm_password)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: inputBgColor,
                          '& fieldset': {
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : '#d0d7de'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1878B2'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1878B2',
                            borderWidth: '2px'
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#d32f2f'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: isDark ? secondaryTextColor : '#5a6b7c',
                          '&.Mui-focused': {
                            color: '#1878B2'
                          },
                          '&.Mui-error': {
                            color: '#d32f2f'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: isDark ? '#FFFFFF' : undefined,
                        },
                        '& .MuiFormHelperText-root': {
                          marginLeft: 0,
                          fontWeight: 400,
                          color: isDark ? '#ff6b6b' : undefined,
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              id={'profile-show-new-confirm-password'}
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmNewPassword}
                              data-testid='show-new-confirm-password'
                              sx={{
                                color: isDark ? secondaryTextColor : '#5a6b7c',
                                '&:hover': {
                                  color: '#1878B2'
                                }
                              }}
                            >
                              <i className={values.showConfirmNewPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ 
                mb: 3,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : undefined,
              }} />
              <Button
                type='submit'
                variant='contained'
                id='change-password'
                data-testid='set-new-password'
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1878B2',
                  borderRadius: '8px',
                  padding: '10px 32px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: isDark 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(24, 120, 177, 0.3)',
                  '&:hover': {
                    backgroundColor: '#146394',
                    boxShadow: isDark 
                      ? '0 6px 20px rgba(0, 0, 0, 0.4)'
                      : '0 6px 20px rgba(24, 120, 177, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&:disabled': {
                    backgroundColor: '#1878B2',
                    opacity: 0.6,
                    boxShadow: 'none'
                  }
                }}
              >
                {isSubmitting ? 'Changing Password....' : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordProfile