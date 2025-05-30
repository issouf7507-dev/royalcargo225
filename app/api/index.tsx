export async function postLog(data: any) {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post log');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting log:', error);
    throw error;
  }
}
