import type { 
  IApiContentModelBase, 
  IApiContentModel,
  IApiElementModel,
  ApiBlockListModel,
  SeoPropertiesPropertiesModel
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

/**
 * Gets the content node from a specified path as a typed model.
 * WILL throw errors if the request fails, so that no (stupid) mistakes get into prod
 * @param path - The umbraco path to a content page (found in the info tab)
 * @returns The passed content type, ready for lsps and wrapped in a promise
 */
export async function GetContent<T extends IApiContentModel>(path: string): Promise<T> {
  const url = `${ApiUrl}/content/item${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} returned non-200 (${res.status})`);
  return await res.json() as T;
}

/**
 * Gets the child content nodes starting from a specified path.
 * WILL throw errors if the request fails, so that no (stupid) mistakes get into prod
 * @param path - The umbraco path to the parent's content page (found in the info tab)
 * @returns Child content wrapped in UmbracoChildContents for easy use
 */
export async function GetChildContent<T extends IApiContentModel>(path: string): Promise<UmbracoChildContents<T>> {
  const url = `${ApiUrl}/content?fetch=descendants:${path}&expand=all`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} returned non-200 (${res.status})`);
  return await res.json() as UmbracoChildContents<T>;
}

/**
 * Turns a generic block list into a typed array of block list items
 * @param blocklist - An untyped BlockListModel that you want to turn into the passed type
 * @returns Array of typed block list items
 */
export function TypedBlockList<T extends IApiElementModel>(blocklist: ApiBlockListModel | undefined | null): T[] {
  if (!blocklist) throw new Error(`Passed blocklist was null or undefined`)
  return blocklist.items.map((item: any) => item.content as T)
}

export function GetSeoProperties(model: IApiContentModel): SeoPropertiesPropertiesModel {
  return {
    seoTitle: model.properties?.seoTitle ?? model.name,
    seoDescription: model.properties?.seoDescription,
    isIndexed: model.properties?.isIndexed,
    canFollow: model.properties?.canFollow,
    seoPreviewImage: model.properties?.seoPreviewImage,
    seoKeywords: model.properties?.seoKeywords 
  };
}
