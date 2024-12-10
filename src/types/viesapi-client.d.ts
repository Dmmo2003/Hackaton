declare module 'viesapi-client' {
    // Puedes definir las interfaces o tipos que estás utilizando aquí
    export class VIESAPIClient {
      constructor(id: string, key: string);
      getVIESData(vatNumber: string): Promise<any>;
    }
  }
  