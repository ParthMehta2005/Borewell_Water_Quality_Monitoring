// mlservices.ts
import { Client, handle_file } from "@gradio/client";
import path from "path";

const SPACE_URL = "ishaantheguy/IPD_borewell_space";

let clientInstance: Awaited<ReturnType<typeof Client.connect>> | null = null;

async function getClient() {
  if (!clientInstance) {
    clientInstance = await Client.connect(SPACE_URL);
  }
  return clientInstance;
}

export async function trainModel(filePath: string): Promise<unknown> {
  const client = await getClient();
  const normalizedPath = path.resolve(filePath).split(path.sep).join("/");
  console.log(`Training with resolved path: ${normalizedPath}`);

  const result = await client.predict("/train_model", [
    handle_file(normalizedPath),
  ]);

  return result.data;
}

export async function predict(
  filePath: string,
  steps: number,
): Promise<unknown> {
  const client = await getClient();
  const normalizedPath = path.resolve(filePath).split(path.sep).join("/");
  console.log(
    `Predicting ${steps} steps with resolved path: ${normalizedPath}`,
  );

  const result = await client.predict("/predict", [
    handle_file(normalizedPath),
    Number(steps),
  ]);

  return result.data;
}
