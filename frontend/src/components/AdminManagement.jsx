/**
 * Admin Management Component (Superuser Only)
 * Allows superusers to create and delete admin accounts
 */
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    is_superuser: false,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admins');
      setAdmins(response.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to load admins',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      setSnackbar({
        open: true,
        message: 'Username and password are required',
        severity: 'warning',
      });
      return;
    }

    if (newAdmin.password.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters',
        severity: 'warning',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', newAdmin.username);
      formData.append('password', newAdmin.password);
      formData.append('is_superuser', newAdmin.is_superuser);

      await api.post('/admins', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSnackbar({
        open: true,
        message: `Admin "${newAdmin.username}" created successfully!`,
        severity: 'success',
      });

      setCreateDialogOpen(false);
      setNewAdmin({ username: '', password: '', is_superuser: false });
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to create admin',
        severity: 'error',
      });
    }
  };

  const handleDeleteAdmin = async (adminId, username) => {
    if (!window.confirm(`Are you sure you want to delete admin "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admins/${adminId}`);
      setSnackbar({
        open: true,
        message: `Admin "${username}" deleted successfully`,
        severity: 'success',
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to delete admin',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Card
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
          color: 'white',
          mb: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SupervisorAccountIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Admin Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Manage admin accounts and permissions
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                bgcolor: 'white',
                color: '#6B1C23',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Create Admin
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight="600">
            Admin Accounts ({admins.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Loading admins...</Typography>
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No admins found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {admin.is_superuser ? (
                          <SupervisorAccountIcon sx={{ color: '#6B1C23' }} />
                        ) : (
                          <PersonIcon sx={{ color: '#757575' }} />
                        )}
                        <Typography fontWeight={500}>{admin.username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admin.is_superuser ? 'Superuser' : 'Admin'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: admin.is_superuser ? '#6B1C23' : '#757575',
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                        title="Delete admin"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Admin Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#6B1C23', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon />
            <Typography variant="h6" fontWeight="bold">
              Create New Admin
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            margin="normal"
            required
            helperText="Minimum 6 characters"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAdmin.is_superuser}
                onChange={(e) => setNewAdmin({ ...newAdmin, is_superuser: e.target.checked })}
                sx={{
                  color: '#6B1C23',
                  '&.Mui-checked': { color: '#6B1C23' },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Make Superuser
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Superusers can manage other admin accounts
                </Typography>
              </Box>
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAdmin}
            sx={{
              background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4A0E13 0%, #6B1C23 100%)',
              },
            }}
          >
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
