import type { IApiContentModelBase } from "../client";

export type UmbracoResponse<T> = IApiContentModelBase & {
  properties: T;
};
