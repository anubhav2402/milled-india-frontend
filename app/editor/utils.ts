/**
 * Preprocess Gmail HTML for GrapesJS compatibility.
 *
 * Gmail HTML has already been cleaned server-side (no scripts, no trackers,
 * no event handlers). This function handles additional normalization that
 * makes the HTML parse better inside GrapesJS's component model.
 */
export function preprocessEmailHtml(html: string): string {
  let processed = html;

  // Remove HTML comments (MSO conditionals like <!--[if mso]>)
  processed = processed.replace(/<!--[\s\S]*?-->/g, "");

  // Remove XML processing instructions
  processed = processed.replace(/<\?xml[^?]*\?>/gi, "");

  // Remove doctype
  processed = processed.replace(/<!DOCTYPE[^>]*>/gi, "");

  // Extract content from <body> if full document
  const bodyMatch = processed.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    processed = bodyMatch[1];
  }

  // Remove <head> section and <html> tags if still present
  processed = processed.replace(/<head[\s\S]*?<\/head>/gi, "");
  processed = processed.replace(/<\/?html[^>]*>/gi, "");

  // Fix empty image sources with transparent placeholder
  processed = processed.replace(
    /src=["']\s*["']/gi,
    'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'
  );

  // Remove data-* attributes that might confuse GrapesJS (keep data-gjs-*)
  processed = processed.replace(
    /\s+data-(?!gjs)[a-z-]+=["'][^"']*["']/gi,
    ""
  );

  // Normalize style attribute single quotes to double quotes
  processed = processed.replace(
    /style='([^']*)'/gi,
    (_match, content: string) => `style="${content.replace(/"/g, "'")}"`
  );

  // Remove xmlns attributes (Outlook XML namespaces)
  processed = processed.replace(/\s+xmlns(?::[a-z]+)?=["'][^"']*["']/gi, "");

  // Clean up excessive whitespace
  processed = processed.replace(/\s{2,}/g, " ");

  return processed.trim();
}
