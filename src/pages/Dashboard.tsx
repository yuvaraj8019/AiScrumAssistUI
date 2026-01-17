import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMeetings } from '@/api/meetings.api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
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
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  VideoCall as VideoIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: meetings, isLoading, error } = useQuery({
    queryKey: ['meetings'],
    queryFn: getMeetings,
    refetchInterval: 5000,
  });

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

  const stats = [
    {
      title: 'Total Meetings',
      value: meetings?.length || 0,
      icon: <VideoIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Completed',
      value: meetings?.filter((m) => m.status === 'COMPLETED').length || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'This Month',
      value: meetings?.filter((m) => new Date(m.createdAt).getMonth() === new Date().getMonth()).length || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Failed to load meetings. Please check if the backend is running.
      </Alert>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your scrum meetings and AI-powered task extraction
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
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
            New Meeting
          </Button>
        </Box>

        {/* Stats Cards */}
        {/* <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid component="div" xs={12} md={4} key={stat.title}>
              <Grow in timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${alpha(stat.color, 0.3)}`,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color={stat.color}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid> */}
        <Box
          sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 3,
                mb: 4,
              }}
            >
          {stats.map((stat, index) => (
            <Box key={stat.title}>
              <Grow in timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 24px ${alpha(stat.color, 0.3)}`,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color={stat.color}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Box>
          ))}
        </Box>


        {/* Meetings Table */}
        <Grow in timeout={1200}>
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Recent Meetings
              </Typography>
              <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meetings?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((meeting) => (
                      <TableRow
                        key={meeting.id}
                        sx={{
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.05),
                          },
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={500}>{meeting.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={meeting.ceremonyType}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: alpha(theme.palette.primary.main, 0.5),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(meeting.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={meeting.status}
                            size="small"
                            color={getStatusColor(meeting.status) as any}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate(`/meetings/${meeting.id}`)}
                            sx={{
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {meetings?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Typography variant="body1" color="text.secondary">
                            No meetings found. Create one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grow>
      </Box>
    </Fade>
  );
};

export default Dashboard;
