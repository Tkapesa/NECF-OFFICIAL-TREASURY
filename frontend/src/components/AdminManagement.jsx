@ -57,13 +57,28 @@ export default function AdminManagement() {
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      console.log('Fetching admins from API...');
      const response = await api.get('/admins');
      console.log('Admins response:', response.data);
      
      if (response.data && response.data.admins) {
        setAdmins(response.data.admins);
        console.log(`✅ Successfully loaded ${response.data.admins.length} admins`);
      } else {
        console.warn('⚠️ No admins data in response');
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      console.error('❌ Error fetching admins:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setAdmins([]);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to load admins',
        message: error.response?.data?.detail || 'Failed to load admins. Please check your connection.',
        severity: 'error',
      });
    } finally {
