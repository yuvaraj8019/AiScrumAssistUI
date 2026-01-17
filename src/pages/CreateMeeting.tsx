import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createMeeting } from '@/api/meetings.api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const meetingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  ceremonyType: z.enum(['STANDUP', 'PLANNING', 'REVIEW', 'RETROSPECTIVE']),
  toolType: z.enum(['JIRA', 'AZURE']),
  projectKey: z.string().min(2, 'Project key is required'),
  meetingDate: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

const CreateMeeting = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      ceremonyType: 'STANDUP',
      toolType: 'JIRA',
      projectKey: 'KAN',
    },
  });

  const mutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      navigate(`/meetings/${data.id}`);
    },
  });

  const onSubmit = (data: MeetingFormData) => {
    mutation.mutate({
      ...data,
      meetingDate: data.meetingDate || new Date().toISOString(),
    });
  };

  const ceremonyTypes = [
    { value: 'STANDUP', label: 'Daily Standup' },
    { value: 'PLANNING', label: 'Sprint Planning' },
    { value: 'REVIEW', label: 'Sprint Review' },
    { value: 'RETROSPECTIVE', label: 'Retrospective' },
  ];

  const toolTypes = [
    { value: 'JIRA', label: 'Jira' },
    { value: 'AZURE', label: 'Azure DevOps' },
  ];

  return (
    <Fade in timeout={800}>
      <Box maxWidth={800}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create New Meeting
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Set up a new scrum meeting for AI-powered task extraction
            </Typography>
          </Box>
        </Box>

        {/* Form Card */}
        <Card
          sx={{
            background: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Meeting Details
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Title */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Meeting Title"
                      placeholder="e.g., Daily Standup - Backend Team"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Ceremony Type and Tool Type */}
                <Box display="flex" gap={2}>
                  <Controller
                    name="ceremonyType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Ceremony Type"
                        fullWidth
                        error={!!errors.ceremonyType}
                        helperText={errors.ceremonyType?.message}
                      >
                        {ceremonyTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="toolType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Tool Type"
                        fullWidth
                        error={!!errors.toolType}
                        helperText={errors.toolType?.message}
                      >
                        {toolTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>

                {/* Project Key */}
                <Controller
                  name="projectKey"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Project Key"
                      placeholder="e.g., KAN, SCRUM, PROJ"
                      fullWidth
                      error={!!errors.projectKey}
                      helperText={errors.projectKey?.message}
                    />
                  )}
                />

                {/* Meeting Date */}
                <Controller
                  name="meetingDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Meeting Date (Optional)"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />

                {/* Error Message */}
                {mutation.isError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Failed to create meeting. Please try again.
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={mutation.isPending}
                    startIcon={mutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.6)}`,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {mutation.isPending ? 'Creating...' : 'Create Meeting'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        background: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default CreateMeeting;
