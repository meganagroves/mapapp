import * as XLSX from 'xlsx';

export async function loadClinicData() {
  try {
    // Fetch the file from the specified path
    const response = await fetch('/clinics.xlsx'); // Ensure the file is in the public folder root

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Read the response as an array buffer
    const arrayBuffer = await response.arrayBuffer();

    // Parse the buffer using XLSX
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Extract the first sheet's name and content
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet content to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    // Add location property by combining latitude and longitude
    return data.map(clinic => ({
      ...clinic,
      location: clinic.Latitude && clinic.Longitude
        ? [clinic.Latitude, clinic.Longitude]
        : null, // Handle cases where coordinates are missing
    }));
  } catch (error) {
    console.error(`Error loading clinic data: ${error.message}`);
    throw error; // Re-throw the error for further handling if needed
  }
}
