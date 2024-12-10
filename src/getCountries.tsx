import axios from 'axios';

// Define el tipo de respuesta esperado de la API
interface CountryResponse {
  countryName: string;
  countryCode: string;
}

// Función para obtener el nombre del país a partir del código de país (ISO 3166-2)
const getCountryNameByCode = async (countryCode: string): Promise<string | null> => {
  try {
    // URL de la API
    const response = await axios.get(`https://iso3166-updates.com/api/countries/${countryCode}`);
    
    // Comprobamos si la respuesta tiene los datos que necesitamos
    const countryData: CountryResponse = response.data;

    // Retornamos el nombre del país
    return countryData.countryName;
  } catch (error) {
    console.error('Error al obtener el nombre del país:', error);
    return null;
  }
};

// Uso de la función
const countryCode = 'ES'; // Este es el código de ejemplo para España
getCountryNameByCode(countryCode)
  .then((countryName) => {
    if (countryName) {
      console.log(`El nombre del país para el código ${countryCode} es: ${countryName}`);
    } else {
      console.log(`No se pudo obtener el nombre del país para el código ${countryCode}`);
    }
  });

  export default getCountryNameByCode