import { BaseApiUrl } from "./umbraco";

/** 
 * takes a url to an svg and returns it's inline code dynamically 
 * @throws if file path does not have suffix of ".svg" or if fetch returns non-200 status code
 * @returns Promise<string> of the inline svg code
 */
export default async function InlineRemoteSvg(fileUrl: string, sanitize = true): Promise<string> {
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

  let rawSvg = await response.text();
  if (!sanitize) return rawSvg;

  rawSvg = removeFill(rawSvg);
  rawSvg = removeInlineFill(rawSvg);
  rawSvg = addFullWidthHeight(rawSvg);
  rawSvg = removeStyleTags(rawSvg);
  return rawSvg;
}

// svg sanitization, so I can use them inline and change the colors
function removeFill(svg: string): string {
  // matches attributes like: fill="#fff" or fill="red"
  return svg.replace(/(fill="#?\w*"\s?)/g, "");
}

function addFullWidthHeight(svg: string): string {
  // matches width="123px" or height="24pt" etc.
  return svg.replace(/(width|height)="\d+\S*"/g, '$1="100%"');
}

function removeInlineFill(svg: string): string {
  // matches inline style fragments like: fill:#fff; (plus trailing space if present)
  return svg.replace(/fill:#?\w+;\s?/g, "");
}

function removeStyleTags(svg: string): string {
  // remove entire <style>...</style> blocks (dotAll "s" makes . match newlines)
  return svg.replace(/<style[\s\S]*?<\/style>/gi, "");
}
