/**
 * Receipt Table Component (Admin Dashboard)
 * Shows all receipts with inline editing for OCR fields
 */
import { useState, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box,
  Typography,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  Checkbox,
  Menu,
  MenuItem,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  useMediaQuery,
  useTheme,
  Toolbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';

export default function ReceiptTable({ receipts, onUpdate, darkMode = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuReceiptId, setMenuReceiptId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [imagePreview, setImagePreview] = useState({ open: false, url: '', title: '' });

  // Helper function to build image URL
  const getImageUrl = (receipt) => {
    // The backend builds the full image URL and returns it in image_path
    // For new receipts: /api/receipts/{id}/image (database-stored images)
    // For old receipts: /uploads/{filename} (filesystem paths)
    if (receipt.image_path) {
      return receipt.image_path;
    }
    
    // Fallback: Build API URL from receipt ID if image_path is missing
    // but receipt has an ID (shouldn't happen with current backend logic)
    if (receipt.id) {
      const API_URL = import.meta.env.VITE_API_URL || 'https://necf-treasury-backend.onrender.com';
      return `${API_URL}/receipts/${receipt.id}/image`;
    }
    
    return null;
  };

  const handleEdit = (receipt) => {
    setEditingId(receipt.id);
    setEditData({
      user_name: receipt.user_name || '',
      user_phone: receipt.user_phone || '',
      item_bought: receipt.item_bought || '',
      approved_by: receipt.approved_by || '',
      ocr_price: receipt.ocr_price || '',
      ocr_date: receipt.ocr_date || '',
      ocr_time: receipt.ocr_time || '',
    });
  };

  const handleSave = async (receiptId) => {
    try {
      // Only send fields that have values (filter out empty strings)
      const dataToSend = {};
      Object.keys(editData).forEach(key => {
        if (editData[key] !== '' && editData[key] !== null && editData[key] !== undefined) {
          dataToSend[key] = editData[key];
        }
      });

      console.log('Sending data:', dataToSend);
      const response = await api.put(`/receipts/${receiptId}`, dataToSend);
      console.log('Update response:', response.data);
      
      setEditingId(null);
      setEditData({});
      setSnackbar({ open: true, message: 'Receipt updated successfully!', severity: 'success' });
      // Force refresh the data
      await onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update: ' + (error.response?.data?.detail || error.message),
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedReceipts(receipts.map(r => r.id));
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedReceipts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event, receiptId) => {
    setMenuAnchor(event.currentTarget);
    setMenuReceiptId(receiptId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuReceiptId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleImagePreview = (url, title) => {
    setImagePreview({ open: true, url, title });
  };

  const closeImagePreview = () => {
    setImagePreview({ open: false, url: '', title: '' });
  };

  const handleDelete = async (receiptId) => {
    if (!window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/receipts/${receiptId}`);
      setSnackbar({ open: true, message: 'Receipt deleted successfully!', severity: 'success' });
      handleMenuClose();
      await onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to delete: ' + (error.response?.data?.detail || error.message),
        severity: 'error'
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReceipts.length === 0) {
      setSnackbar({ open: true, message: 'No receipts selected', severity: 'warning' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedReceipts.length} receipt(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.post('/receipts/bulk-delete', selectedReceipts);
      setSnackbar({ 
        open: true, 
        message: `Successfully deleted ${selectedReceipts.length} receipt(s)!`, 
        severity: 'success' 
      });
      setSelectedReceipts([]);
      await onUpdate();
    } catch (error) {
      console.error('Bulk delete error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to delete receipts: ' + (error.response?.data?.detail || error.message),
        severity: 'error'
      });
    }
  };

  if (receipts.length === 0) {
    return (
      <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'white' }}>
        <ReceiptLongIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No receipts found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first receipt to get started
        </Typography>
      </Paper>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Box>
        {receipts.map((receipt) => {
          const isEditing = editingId === receipt.id;
          const isExpanded = expandedRows.includes(receipt.id);

          return (
            <Card
              key={`receipt-${receipt.id}`}
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                {/* Header with Image and Title */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2 }}>
                  <Avatar
                    src={getImageUrl(receipt)}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      cursor: 'pointer',
                      border: '2px solid #e0e0e0',
                      flexShrink: 0,
                    }}
                    onClick={() => handleImagePreview(getImageUrl(receipt), receipt.item_bought)}
                  >
                    <ReceiptLongIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        value={editData.item_bought}
                        onChange={(e) => handleChange('item_bought', e.target.value)}
                        placeholder="Item name"
                      />
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {receipt.item_bought || 'Receipt'}
                        </Typography>
                        <Chip
                          label={receipt.approved_by || 'Pending'}
                          size="small"
                          sx={{ 
                            mt: 0.5, 
                            fontWeight: 600,
                            bgcolor: receipt.approved_by ? '#d4edda' : '#f8d7da',
                            color: receipt.approved_by ? '#155724' : '#721c24',
                            border: receipt.approved_by ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                          }}
                        />
                      </>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, receipt.id)}
                    sx={{ flexShrink: 0 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Details Grid */}
                <Grid container spacing={2}>
                  {/* Amount */}
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Amount
                    </Typography>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        value={editData.ocr_price}
                        onChange={(e) => handleChange('ocr_price', e.target.value)}
                        placeholder="0.00"
                        sx={{ mt: 0.5 }}
                      />
                    ) : (
                      <Typography variant="body1" fontWeight={600} color="#6B1C23">
                        ₺{receipt.ocr_price || '0.00'}
                      </Typography>
                    )}
                  </Grid>

                  {/* Date */}
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Date
                    </Typography>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        value={editData.ocr_date}
                        onChange={(e) => handleChange('ocr_date', e.target.value)}
                        placeholder="Date"
                        sx={{ mt: 0.5 }}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {receipt.ocr_date || formatDate(receipt.created_at)}
                      </Typography>
                    )}
                  </Grid>

                  {/* Submitted By */}
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Submitted By
                    </Typography>
                    {isEditing ? (
                      <Box sx={{ mt: 0.5 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Name"
                          value={editData.user_name}
                          onChange={(e) => handleChange('user_name', e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Phone"
                          value={editData.user_phone}
                          onChange={(e) => handleChange('user_phone', e.target.value)}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {receipt.user_name || '--'} 
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {receipt.user_phone || '--'}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                {/* Expandable Details */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="caption" color="primary" fontWeight="bold" display="block" gutterBottom>
                      Additional Details
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body2">
                          {receipt.ocr_time || '--'}
                        </Typography>
                      </Grid>
                      {isEditing && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Approved By
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={editData.approved_by}
                            onChange={(e) => handleChange('approved_by', e.target.value)}
                            placeholder="Approver"
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                      )}
                      {receipt.ocr_raw_text && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            📝 OCR Extracted Text
                          </Typography>
                          <Box 
                            sx={{ 
                              p: 1.5,
                              bgcolor: '#f8f9fa',
                              borderRadius: 1,
                              border: '1px dashed #d0d0d0',
                              maxHeight: '150px',
                              overflowY: 'auto',
                              mt: 0.5,
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                color: 'text.secondary',
                                lineHeight: 1.5,
                              }}
                            >
                              {receipt.ocr_raw_text}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {getImageUrl(receipt) && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<ZoomInIcon />}
                            onClick={() => handleImagePreview(getImageUrl(receipt), receipt.item_bought)}
                            sx={{ mt: 1 }}
                          >
                            View Receipt Image
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>

              {/* Action Buttons */}
              <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  onClick={() => toggleRowExpansion(receipt.id)}
                  sx={{ color: 'text.secondary' }}
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Button>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {isEditing ? (
                    <>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleSave(receipt.id)}
                        sx={{
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                          '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' },
                        }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleCancel}
                        sx={{
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' },
                        }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(receipt)}
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardActions>
            </Card>
          );
        })}

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { 
            handleMenuClose(); 
            const receipt = receipts.find(r => r.id === menuReceiptId);
            if (receipt) handleEdit(receipt);
          }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => { 
            handleMenuClose(); 
            const receipt = receipts.find(r => r.id === menuReceiptId);
            if (receipt) {
              toggleRowExpansion(menuReceiptId);
            }
          }}>
            View Details
          </MenuItem>
          <MenuItem 
            onClick={() => { 
              if (menuReceiptId) {
                handleDelete(menuReceiptId);
              }
            }} 
            sx={{ color: 'error.main' }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* Success/Error Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Image Preview Modal */}
        <Dialog
          open={imagePreview.open}
          onClose={closeImagePreview}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              boxShadow: 24,
            }
          }}
        >
          <DialogTitle sx={{
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="h6">
              {imagePreview.title || 'Receipt Image'}
            </Typography>
            <IconButton onClick={closeImagePreview} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'rgba(0, 0, 0, 0.9)', p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{
              width: '100%',
              height: '70vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
            }}>
              <img
                src={imagePreview.url}
                alt={imagePreview.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  // Desktop Table View

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        animation: 'fadeIn 0.8s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Bulk Actions Toolbar */}
      {selectedReceipts.length > 0 && (
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'rgba(107, 28, 35, 0.08)',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="primary">
            {selectedReceipts.length} receipt(s) selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleBulkDelete}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      <TableContainer sx={{
        bgcolor: darkMode ? '#2a2a2a' : 'white',
        '&::-webkit-scrollbar': {
          height: '8px',
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: darkMode ? '#555' : '#bdbdbd',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: darkMode ? '#777' : '#9e9e9e',
          },
        },
      }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              borderBottom: darkMode ? '2px solid #333' : '2px solid #e0e0e0',
            }}>
              <TableCell padding="checkbox" sx={{ bgcolor: darkMode ? '#1e1e1e' : '#fafafa' }} />
              <TableCell padding="checkbox" sx={{ bgcolor: darkMode ? '#1e1e1e' : '#fafafa' }}>
                <Checkbox
                  indeterminate={selectedReceipts.length > 0 && selectedReceipts.length < receipts.length}
                  checked={receipts.length > 0 && selectedReceipts.length === receipts.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: '#6B1C23',
                    '&.Mui-checked': { color: '#6B1C23' },
                    '&.MuiCheckbox-indeterminate': { color: '#6B1C23' },
                  }}
                />
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Name / Receipt
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Submitted By
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Date
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Amount
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#bbb' : '#424242', 
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipts.map((receipt) => {
              const isEditing = editingId === receipt.id;
              const isSelected = selectedReceipts.includes(receipt.id);
              const isExpanded = expandedRows.includes(receipt.id);

              return (
                <Fragment key={`receipt-${receipt.id}`}>
                  <TableRow
                    hover
                    selected={isSelected}
                    sx={{
                      bgcolor: darkMode ? '#2a2a2a' : 'white',
                      '&:hover': { 
                        bgcolor: darkMode ? 'rgba(107, 28, 35, 0.15)' : 'rgba(107, 28, 35, 0.04)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      },
                      borderBottom: isExpanded ? 'none' : (darkMode ? '1px solid #333' : '1px solid #f0f0f0'),
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&.Mui-selected': {
                        bgcolor: darkMode ? 'rgba(107, 28, 35, 0.25)' : 'rgba(107, 28, 35, 0.08)',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(107, 28, 35, 0.35)' : 'rgba(107, 28, 35, 0.12)',
                        },
                      },
                    }}
                  >
                    {/* Expand Button */}
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(receipt.id)}
                        sx={{
                          color: darkMode ? '#bbb' : 'inherit',
                          '&:hover': {
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>

                    {/* Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOne(receipt.id)}
                        sx={{
                          color: '#6B1C23',
                          '&.Mui-checked': { color: '#6B1C23' },
                        }}
                      />
                    </TableCell>

                    {/* Receipt Name/Item */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          size="small"
                          fullWidth
                          value={editData.item_bought}
                          onChange={(e) => handleChange('item_bought', e.target.value)}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={getImageUrl(receipt)}
                            variant="rounded"
                            sx={{ 
                              width: 48, 
                              height: 48,
                              cursor: 'pointer',
                              border: '2px solid #e0e0e0',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              '&:hover': { 
                                transform: 'scale(1.15)',
                                boxShadow: '0 4px 12px rgba(107, 28, 35, 0.3)',
                                borderColor: '#6B1C23',
                              },
                            }}
                            onClick={() => handleImagePreview(getImageUrl(receipt), receipt.item_bought)}
                        >
                          <ReceiptLongIcon />
                        </Avatar>
                        <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                          {receipt.item_bought || 'Receipt'}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  {/* Submitted By (User) */}
                  <TableCell>
                    {isEditing ? (
                      <Box>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Name"
                          value={editData.user_name}
                          onChange={(e) => handleChange('user_name', e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Phone"
                          value={editData.user_phone}
                          onChange={(e) => handleChange('user_phone', e.target.value)}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                          {receipt.user_name || '--'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                          {receipt.user_phone || '--'}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editData.ocr_date}
                        onChange={(e) => handleChange('ocr_date', e.target.value)}
                        placeholder="Date"
                      />
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                          {receipt.ocr_date || formatDate(receipt.created_at)}
                        </Typography>
                        {receipt.ocr_time && (
                          <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                            {receipt.ocr_time}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editData.ocr_price}
                        onChange={(e) => handleChange('ocr_price', e.target.value)}
                        placeholder="0.00"
                        sx={{ width: 100 }}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                        ₺{receipt.ocr_price || '0.00'}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Status (Approved By) */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editData.approved_by}
                        onChange={(e) => handleChange('approved_by', e.target.value)}
                        placeholder="Approver"
                      />
                    ) : (
                      <Chip
                        label={receipt.approved_by || 'Pending'}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: receipt.approved_by ? '#d4edda' : '#f8d7da',
                          color: receipt.approved_by ? '#155724' : '#721c24',
                          border: receipt.approved_by ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                          '&:hover': {
                            bgcolor: receipt.approved_by ? '#c3e6cb' : '#f5c6cb',
                          },
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    {isEditing ? (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small"
                          color="primary" 
                          onClick={() => handleSave(receipt.id)}
                          title="Save"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                            },
                          }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error" 
                          onClick={handleCancel}
                          title="Cancel"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                            },
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleEdit(receipt)}
                          title="Edit"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(107, 28, 35, 0.1)',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDelete(receipt.id)}
                          title="Delete"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, receipt.id)}
                          title="More options"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(158, 158, 158, 0.1)',
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>

                {/* Expandable Row for Additional Details */}
                <TableRow key={`${receipt.id}-expanded`}>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ py: 3, px: 2, bgcolor: darkMode ? '#1e1e1e' : '#f8f9fa' }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                bgcolor: darkMode ? '#2a2a2a' : 'white',
                                border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                Receipt Details
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Item Purchased
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                    {receipt.item_bought || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Amount
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                    ₺{receipt.ocr_price || '0.00'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Date & Time
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                    {receipt.ocr_date || formatDate(receipt.created_at)} {receipt.ocr_time && `at ${receipt.ocr_time}`}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                bgcolor: darkMode ? '#2a2a2a' : 'white',
                                border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                Submission Info
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Submitted By
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                    {receipt.user_name || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Contact
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                    {receipt.user_phone || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? '#888' : 'inherit' }}>
                                    Approved By
                                  </Typography>
                                  <Chip
                                    label={receipt.approved_by || 'Pending'}
                                    size="small"
                                    color={receipt.approved_by ? 'success' : 'warning'}
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                        
                        {/* OCR Extracted Data */}
                        {receipt.ocr_raw_text && (
                          <Box sx={{ mt: 2 }}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                bgcolor: darkMode ? '#2a2a2a' : 'white',
                                border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                📝 OCR Extracted Text
                              </Typography>
                              <Box 
                                sx={{ 
                                  mt: 2, 
                                  p: 2,
                                  bgcolor: darkMode ? '#1e1e1e' : '#f8f9fa',
                                  borderRadius: 1,
                                  border: darkMode ? '1px dashed #444' : '1px dashed #d0d0d0',
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: darkMode ? '#aaa' : 'text.secondary',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {receipt.ocr_raw_text}
                                </Typography>
                              </Box>
                            </Paper>
                          </Box>
                        )}

                        {/* Receipt Image */}
                        {getImageUrl(receipt) && (
                          <Box sx={{ mt: 2 }}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                bgcolor: darkMode ? '#2a2a2a' : 'white',
                                border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>
                                📷 Receipt Image
                              </Typography>
                              <Box 
                                sx={{ 
                                  mt: 2, 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <img 
                                  src={getImageUrl(receipt)} 
                                  alt={receipt.item_bought}
                                  style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px', 
                                    borderRadius: '8px',
                                    border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleImagePreview(getImageUrl(receipt), receipt.item_bought)}
                                  onError={(e) => {
                                    console.error('Failed to load image for receipt', receipt.id);
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<ZoomInIcon />}
                                  onClick={() => handleImagePreview(getImageUrl(receipt), receipt.item_bought)}
                                  sx={{
                                    color: darkMode ? '#fff' : '#d32f2f',
                                    borderColor: darkMode ? '#fff' : '#d32f2f',
                                    '&:hover': {
                                      borderColor: darkMode ? '#ddd' : '#c62828',
                                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(211, 47, 47, 0.04)',
                                    },
                                  }}
                                >
                                  View Full Size
                                </Button>
                              </Box>
                            </Paper>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          const receipt = receipts.find(r => r.id === menuReceiptId);
          if (receipt) handleEdit(receipt);
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          const receipt = receipts.find(r => r.id === menuReceiptId);
          if (receipt) {
            toggleRowExpansion(menuReceiptId);
          }
        }}>
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => { 
            if (menuReceiptId) {
              handleDelete(menuReceiptId);
            }
          }} 
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Success/Error Notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Image Preview Modal */}
      <Dialog
        open={imagePreview.open}
        onClose={closeImagePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.8)', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h6">
            {imagePreview.title || 'Receipt Image'}
          </Typography>
          <IconButton onClick={closeImagePreview} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(0, 0, 0, 0.9)', p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ 
            width: '100%', 
            height: '70vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 2,
          }}>
            <img 
              src={imagePreview.url} 
              alt={imagePreview.title}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
