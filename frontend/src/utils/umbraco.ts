import type { 
  IApiContentModelBase, 
  IApiContentModel,
  IApiElementModel,
  ApiBlockListModel
} from "../client";

export const BaseApiUrl =
  import.meta.env.DEV
    ? "http://localhost:46118"
    : import.meta.env.PUBLIC_API_URL ?? "https://api.sakukarttunen.com";

export const ApiUrl = `${BaseApiUrl}/umbraco/delivery/api/v2`;

export type UmbracoResponse<T> = IApiContentModelBase & {
  properties: T;
};

export type UmbracoChildContents<T extends IApiContentModel> = {
  total: number
  items: T[]
}

export async function GetContent<T extends IApiContentModel>(path: string): Promise<T> {
  const url = `${ApiUrl}/content/item/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} returned non-200 (${res.status})`);
  return await res.json() as T;
}

export async function GetChildContent<T extends IApiContentModel>(path: string): Promise<UmbracoChildContents<T>> {
  const url = `${ApiUrl}/content?fetch=descendants:${path}&expand=all`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} returned non-200 (${res.status})`);
  return await res.json() as UmbracoChildContents<T>;
}

export function TypedBlockList<T extends IApiElementModel>(blocklist: ApiBlockListModel | undefined | null): T[] {
  if (!blocklist) throw new Error(`Passed blocklist was null or undefined`)
  return blocklist.items.map((item: any) => item.content as T)
}
