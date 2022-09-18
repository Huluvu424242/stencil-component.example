import {Endpunkt} from "./endpunkt";

async function fetchDataFetchAPI(queryUrl: string): Promise<Response> {
  return await fetch(queryUrl, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  });
}

export class Network {

  public async getData(endpunkt: Endpunkt): Promise<any> {
    const response: Response = await fetchDataFetchAPI(endpunkt.toUrl());
    return response.json();
  }

}

// Singleton of Network
export const networkService = new Network();
