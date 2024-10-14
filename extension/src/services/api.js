export async function saveData(action, data) {
  let endpoint;
  switch (action) {
    case 'saveBusinessData':
      endpoint = '/api/saveBusinessData';
      break;
    case 'saveRegionData':
      endpoint = '/api/saveRegionData';
      break;
    case 'saveBattleData':
      endpoint = '/api/saveBattleData';
      break;
    case 'savePlayersData': // Add case for players
      endpoint = '/api/saveBattlePlayers';
      break;
    default:
      console.error('Unknown action:', action);
      return { success: false, error: 'Unknown action' };
  }

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
      console.log(`${action} data saved successfully.`);
      return result;
    } else {
      console.error('Server error:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error.message };
  }
}
