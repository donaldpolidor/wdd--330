export function getParam(param) {
  const queryString = window.location.search;
  console.log('Query string:', queryString);
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  console.log(`Parameter ${param}:`, value);
  return value;
}

export function setLocalStorage(key, data) {
  try {
    console.log('Saving to localStorage:', key, data);
    localStorage.setItem(key, JSON.stringify(data));
    console.log('Data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

export function getLocalStorage(key) {
  try {
    console.log('Reading from localStorage:', key);
    const item = localStorage.getItem(key);
    console.log('Raw data:', item);
    
    if (!item) {
      console.log('No data found, returning empty array');
      return [];
    }
    
    const data = JSON.parse(item);
    console.log('Parsed data:', data);
    
    // Ensure we always return an array
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      console.log('Converting object to array');
      return [data];
    } else {
      console.warn('Unexpected data format, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}