/**
 * Strips hardcoded fills, sizes and style blocks from raw SVG markup,
 * so it can be inlined and colored with CSS.
 */
export default function sanitizeSvg(svg: string): string {
  svg = removeFill(svg);
  svg = removeInlineFill(svg);
  svg = addFullWidthHeight(svg);
  svg = removeStyleTags(svg);
  return svg;
}

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
  // remove entire <style>...</style> blocks
  return svg.replace(/<style[\s\S]*?<\/style>/gi, "");
}
