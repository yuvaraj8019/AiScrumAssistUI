import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getMeetingById, saveTranscript, processMeeting, getMeetingTasks } from '@/api/meetings.api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  Fade,
  Grow,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  OpenInNew as OpenInNewIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [transcript, setTranscript] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  const { data: meeting, isLoading, refetch } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => getMeetingById(id!),
    enabled: !!id,
    refetchInterval: isPolling ? 2000 : false,
  });

  const { data: tasks } = useQuery({
    queryKey: ['meeting-tasks', id],
    queryFn: () => getMeetingTasks(id!),
    enabled: !!id && meeting?.status === 'COMPLETED',
  });

  const transcriptMutation = useMutation({
    mutationFn: (text: string) => saveTranscript(id!, text),
    onSuccess: () => {
      refetch();
      setTranscript('');
    },
  });

  const processMutation = useMutation({
    mutationFn: () => processMeeting(id!),
    onSuccess: () => {
      setIsPolling(true);
    },
  });

  useEffect(() => {
    if (meeting?.status === 'COMPLETED' || meeting?.status === 'FAILED') {
      setIsPolling(false);
      queryClient.invalidateQueries({ queryKey: ['meeting-tasks', id] });
    }
  }, [meeting?.status, id, queryClient]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!meeting) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Meeting not found
      </Alert>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box>
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
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {meeting.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                {meeting.ceremonyType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(meeting.createdAt), 'PPpp')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {meeting.projectKey}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={meeting.status}
            color={getStatusColor(meeting.status) as any}
            sx={{ fontWeight: 600, px: 2 }}
          />
        </Box>

        {/* Transcript Section */}
        <Grow in timeout={800}>
          <Card
            sx={{
              mb: 3,
              background: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Meeting Transcript
                </Typography>
              </Box>

              {meeting.transcript ? (
                <Paper
                  sx={{
                    p: 3,
                    background: alpha(theme.palette.background.default, 0.5),
                    maxHeight: 400,
                    overflow: 'auto',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      m: 0,
                    }}
                  >
                    {meeting.transcript}
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    placeholder="Paste your meeting transcript here..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={transcriptMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={() => transcriptMutation.mutate(transcript)}
                    disabled={!transcript || transcriptMutation.isPending}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }}
                  >
                    Save Transcript
                  </Button>
                </Box>
              )}

              {/* Process Button */}
              {meeting.transcript && meeting.status !== 'COMPLETED' && meeting.status !== 'PROCESSING' && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={isPolling ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
                  onClick={() => processMutation.mutate()}
                  disabled={processMutation.isPending || isPolling}
                  sx={{
                    mt: 3,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                    '&:hover': {
                      boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.6)}`,
                    },
                  }}
                >
                  {isPolling ? 'Processing with AI...' : 'Process Transcript (AI → Jira Tasks)'}
                </Button>
              )}

              {/* Status Messages */}
              {meeting.status === 'PROCESSING' && (
                <Box mt={3}>
                  <Alert
                    severity="warning"
                    icon={<CircularProgress size={20} />}
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography fontWeight={600}>AI Processing in Progress</Typography>
                    <Typography variant="body2">
                      Extracting decisions, blockers, and tasks...
                    </Typography>
                  </Alert>
                  <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
                </Box>
              )}

              {meeting.status === 'COMPLETED' && (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  <Typography fontWeight={600}>Processing Complete</Typography>
                  <Typography variant="body2">
                    Tasks have been created in {meeting.toolType}
                  </Typography>
                </Alert>
              )}

              {meeting.status === 'FAILED' && (
                <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography fontWeight={600}>Processing Failed</Typography>
                  <Typography variant="body2">
                    Please try again or check the logs
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grow>

        {/* Tasks Section */}
        {meeting.status === 'COMPLETED' && tasks && tasks.length > 0 && (
          <Grow in timeout={1200}>
            <Card
              sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Created Tasks ({tasks.length})
                </Typography>
                <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Jira Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow
                          key={task.id}
                          sx={{
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={500}>{task.title}</Typography>
                          </TableCell>
                          <TableCell>{task.assignee || 'Unassigned'}</TableCell>
                          <TableCell>
                            <Chip
                              label={task.priority}
                              size="small"
                              color={getPriorityColor(task.priority) as any}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={task.status} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            {task.externalId && (
                              <Button
                                size="small"
                                endIcon={<OpenInNewIcon />}
                                href={`https://yuva-raj.atlassian.net/browse/${task.externalId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    background: alpha(theme.palette.primary.main, 0.1),
                                  },
                                }}
                              >
                                {task.externalId}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grow>
        )}
      </Box>
    </Fade>
  );
};

export default MeetingDetails;
