import { useEffect } from 'react'
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  TextField,
  Zoom
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

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

interface UpdateProfileDialogProps {
  open: boolean
  close: () => void
  data: ProfileData
  refetch: () => void
}

type FormFields = {
  ProfilePicture: string | null | File
  Name: string
  CountryID: Country | null
  Address: string
}

// Helper function for getInitials
const getInitials = (name: string = 'User'): string => {
  if (!name) return 'U'
  const nameParts = name.trim().split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
}

const UpdateProfileDialog = ({ open, close, data, refetch }: UpdateProfileDialogProps) => {
  const countryData: Country[] = [] // Mock data - replace with actual data if needed
  const isLoading = false
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      ProfilePicture: data?.ProfilePicture || null,
      Name: data?.Name || '',
      CountryID: data?.country || null,
      Address: data?.Address || ''
    }
  })

  const onSubmit = async () => {
    try {
      // API call removed - just close and refetch
      close()
      refetch()
    } catch (error) {
      refetch()
    }
  }

  useEffect(() => {
    if (open) {
      reset({
        ProfilePicture: data?.ProfilePicture || null,
        Name: data?.Name || '',
        CountryID: data?.country || null,
        Address: data?.Address || ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset, refetch])

  // Theme-based colors
  const backgroundColor = isDark ? '#0F1828' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a1a2e';
  const secondaryTextColor = isDark ? '#B0BEC5' : '#4a4a6a';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 120, 178, 0.1)';

  return (
    <>
      <Dialog 
        open={open} 
        onClose={close} 
        TransitionComponent={Zoom} 
        fullWidth 
        maxWidth='sm'
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.12)',
            backgroundColor: backgroundColor,
          }
        }}
      >
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog Header with Gradient */}
          <Box
            sx={{
              background: isDark 
                ? 'linear-gradient(135deg, #0F1828 0%, #1a2a40 100%)'
                : 'linear-gradient(135deg, #1878B2 0%, #1a8bc7 100%)',
              padding: '24px 24px 16px 24px',
            }}
          >
            <DialogTitle 
              sx={{ 
                p: 0,
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}
            >
              Update Profile
            </DialogTitle>
          </Box>
          
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={4}>
              {/* Image */}
              <Grid item xs={12}>
                {/* Profile Picture */}
                <Controller
                  control={control}
                  name='ProfilePicture'
                  render={({ field }) => (
                    <>
                      <input
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        id='profile-picture'
                        onChange={e => {
                          if (e.target.files) {
                            const file = e.target.files[0]
                            field.onChange(file)
                          }
                        }}
                        hidden
                      />

                      {/* Avatar Box */}
                      <Box
                        component='label'
                        htmlFor='profile-picture'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        py={2}
                      >
                        <Box
                          display={'flex'}
                          position='relative'
                          overflow={'hidden'}
                          borderRadius={'16px'}
                          sx={{
                            '&:hover #hover-box-input': {
                              cursor: 'pointer',
                              opacity: '1'
                            }
                          }}
                        >
                          <Avatar
                            variant='rounded'
                            sx={{ 
                              width: 140, 
                              height: 140, 
                              boxShadow: isDark
                                ? '0 4px 20px rgba(0,0,0,0.4)'
                                : '0 4px 20px rgba(24, 120, 178, 0.2)',
                              border: isDark
                                ? '4px solid #1a2a40'
                                : '4px solid #1878B2',
                              borderRadius: '16px',
                              position: 'relative',
                              backgroundColor: isDark ? '#1a2a40' : '#1878B2',
                              color: 'white',
                              fontSize: '3rem',
                              fontWeight: 600,
                            }}
                            src={
                              field?.value instanceof File ? URL.createObjectURL(field.value) : field.value || undefined
                            }
                          >
                            {getInitials(data?.Name || 'User')}
                          </Avatar>
                          <Box
                            position={'absolute'}
                            width={'100%'}
                            height={'100%'}
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            bgcolor={isDark 
                              ? 'rgba(15, 24, 40, 0.7)'
                              : 'rgba(24, 120, 178, 0.6)'
                            }
                            id='hover-box-input'
                            sx={{ 
                              opacity: 0,
                              transition: 'all 0.3s ease',
                              borderRadius: '16px',
                            }}
                          >
                            <i className='ri-pencil-line text-white h-8 w-8' style={{ fontSize: '2rem' }} />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                />
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Name'
                  rules={{
                    required: 'Please enter a name',
                    maxLength: { value: 100, message: 'You cannot enter more than 100 characters' }
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField 
                        {...field} 
                        label='Name' 
                        inputProps={{ maxLength: 100 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: inputBgColor,
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                            },
                            '&:hover fieldset': {
                              borderColor: isDark ? '#4a6a8a' : '#1878B2',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: isDark ? '#4a6a8a' : '#1878B2',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? secondaryTextColor : undefined,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: isDark ? '#4a6a8a' : '#1878B2',
                          },
                          '& .MuiInputBase-input': {
                            color: textColor,
                          },
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='CountryID'
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Autocomplete
                        value={field?.value || undefined}
                        onChange={(_e, value) => {
                          field?.onChange(value)
                        }}
                        loading={isLoading}
                        options={countryData ?? []}
                        renderOption={(props, option) => (
                          <li {...props} key={option.ID}>
                            {option.Name}
                          </li>
                        )}
                        disableClearable
                        renderInput={params => (
                          <TextField 
                            {...params} 
                            label={'Country'}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: inputBgColor,
                                '& fieldset': {
                                  borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                                },
                                '&:hover fieldset': {
                                  borderColor: isDark ? '#4a6a8a' : '#1878B2',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: isDark ? '#4a6a8a' : '#1878B2',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: isDark ? secondaryTextColor : undefined,
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: isDark ? '#4a6a8a' : '#1878B2',
                              },
                              '& .MuiInputBase-input': {
                                color: textColor,
                              },
                            }}
                          />
                        )}
                        getOptionLabel={option => {
                          return option.Name || ''
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Address'
                  rules={{ maxLength: { value: 200, message: 'You cannot enter more than 200 characters' } }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        maxRows={4}
                        minRows={3}
                        {...field}
                        label='Address'
                        inputProps={{ maxLength: 200 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: inputBgColor,
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : undefined,
                            },
                            '&:hover fieldset': {
                              borderColor: isDark ? '#4a6a8a' : '#1878B2',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: isDark ? '#4a6a8a' : '#1878B2',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? secondaryTextColor : undefined,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: isDark ? '#4a6a8a' : '#1878B2',
                          },
                          '& .MuiInputBase-input': {
                            color: textColor,
                          },
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <Divider sx={{ borderColor: dividerColor }} />
          
          <DialogActions sx={{ 
            justifyContent: 'space-between', 
            p: 3,
            gap: 2,
          }}>
            <Button 
              variant='outlined' 
              onClick={close}
              sx={{
                borderRadius: '12px',
                padding: '8px 24px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#1878B2',
                color: '#1878B2',
                '&:hover': {
                  borderColor: '#146394',
                  backgroundColor: 'rgba(24, 120, 178, 0.08)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant='contained' 
              type='submit' 
              disabled={!isDirty || isSubmitting}
              sx={{
                backgroundColor: '#1878B2',
                color: 'white',
                borderRadius: '12px',
                padding: '8px 32px',
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
                },
                '&.Mui-disabled': {
                  backgroundColor: isDark ? '#2a2a3a' : '#b0b0b0',
                  color: isDark ? '#6a6a7a' : undefined,
                }
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateProfileDialog