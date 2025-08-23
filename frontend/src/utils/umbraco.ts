import type { 
  IApiContentModelBase, 
  IApiContentModel,
  IApiElementModel,
  ApiBlockListModel
} from "../client";

export type UmbracoResponse<T> = IApiContentModelBase & {
  properties: T;
};

export const BaseApiUrl =
  import.meta.env.DEV
    ? "http://localhost:46118"
    : import.meta.env.PUBLIC_API_URL ?? "https://api.sakukarttunen.com";

export const ApiUrl = `${BaseApiUrl}/umbraco/delivery/api/v2`;

export async function GetContent<T extends IApiContentModel>(path: string) {
  const res = await fetch(`${ApiUrl}/content/item/${path}`);
  return await res.json() as T;
}

export function TypedBlockList<T extends IApiElementModel>(blocklist: ApiBlockListModel | undefined | null): T[] {
  if (!blocklist) throw new Error(`Passed blocklist was null or undefined`)
  return blocklist.items.map((item: any) => item.content as T)
}
