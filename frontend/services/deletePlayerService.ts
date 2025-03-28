import axios from 'axios';

export const deletePlayer = async (playerId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/players/${playerId}`);
  } catch (error) {
    throw new Error('Failed to delete player');
  }
}; 