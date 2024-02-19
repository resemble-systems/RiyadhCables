import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const getData = (context: WebPartContext, ApiUrl: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: SPHttpClientResponse = await context.spHttpClient.get(
        ApiUrl,
        SPHttpClient.configurations.v1
      );
      if (!response.ok) {
        reject(response.status);
      } else if (response.ok) {
        const responseData = await response.json();
        resolve(responseData);
      }
    } catch (error) {
      console.error("Error in Get Data:", error);
    }
  });
};

export { getData };
