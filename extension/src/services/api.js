export async function saveData(action, data) {
  const endpoint =
    action === 'saveBusinessData'
      ? '/api/saveBusinessData'
      : '/api/saveRegionData';

  try {
    const response = await fetch(`http://localhost:3005${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      console.log('Data saved successfully.');
      return { success: true };
    } else {
      console.error('Server error:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error.message };
  }
}
