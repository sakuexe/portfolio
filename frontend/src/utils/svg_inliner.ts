import { BaseApiUrl } from "./umbraco";

/** 
 * takes a url to an svg and returns it's inline code dynamically 
 * @throws if file path does not have suffix of ".svg" or if fetch returns non-200 status code
 * @returns Promise<string> of the inline svg code
 */
export default async function InlineRemoteSvg(fileUrl: string): Promise<string> {
  if (!fileUrl.endsWith(".svg")) {
    throw Error(`Passed file is not an svg (${fileUrl})`);
  }
  if (!fileUrl.startsWith("/")) {
    throw Error(`Passed path shouldn't include the domain or the protocol is not an svg (${fileUrl})`);
  }

  const response = await fetch(`${BaseApiUrl}${fileUrl}`);
  if (!response.ok) {
    throw Error(`Could not fetch remote SVG file from ${BaseApiUrl}${fileUrl}, got status of ${response.status}`);
  }

  const rawSvg = response.text();
  return rawSvg;
}
