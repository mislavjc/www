// RFC 9110 §12.5.1 Accept-header negotiation.
//
// Implements the parsing rules documented at https://acceptmarkdown.com —
// rank by q-value, break ties by specificity, honour `q=0` as an explicit
// rejection, and never substring-match the raw header.

/** Representations this site can produce, most-preferred default first. */
export const PRODUCES = ['text/html', 'text/markdown'] as const;

export type Produced = (typeof PRODUCES)[number];

type AcceptEntry = {
  type: string;
  q: number;
  // 2 = exact type, 1 = subtype wildcard, 0 = full wildcard.
  // Higher specificity wins over q per RFC 9110.
  specificity: number;
};

const parseAccept = (header: string): AcceptEntry[] =>
  header
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const parts = raw.split(';').map((part) => part.trim());
      const type = parts[0].toLowerCase();

      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split('=').map((part) => part.trim());
        if (name?.toLowerCase() === 'q') {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }

      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;

      return { type, q, specificity };
    });

const matches = (entry: AcceptEntry, candidate: string): boolean => {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
};

/**
 * Pick the representation to serve.
 *
 * Returns `null` only when the client explicitly rules out everything we can
 * produce — that is the one case that warrants a 406. A missing header, or a
 * header we cannot parse into any preference, falls back to the default.
 */
export const preferredType = (header: string | null): Produced | null => {
  if (!header) return PRODUCES[0];

  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let bestType: Produced | null = null;
  let bestQ = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of PRODUCES) {
    // Find the most specific range matching this candidate. Specificity wins
    // over q, so `text/html;q=0, */*` still rejects HTML.
    let matched: AcceptEntry | null = null;
    let matchedPosition = Number.POSITIVE_INFINITY;

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      if (!matches(entry, candidate)) continue;

      // Strictly greater: entries are scanned in order, so on a specificity
      // tie the earlier one already won.
      if (matched === null || entry.specificity > matched.specificity) {
        matched = entry;
        matchedPosition = index;
      }
    }

    if (matched === null || matched.q <= 0) continue;

    // Across candidates: highest q wins, then the client's own ordering, so
    // `Accept: text/markdown, text/html` picks Markdown.
    if (
      matched.q > bestQ ||
      (matched.q === bestQ && matchedPosition < bestPosition)
    ) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
};

/** Add `Accept` to an existing `Vary` header without clobbering other tokens. */
export const appendVaryAccept = (headers: Headers): void => {
  const existing = headers.get('Vary');

  if (!existing) {
    headers.set('Vary', 'Accept');
    return;
  }

  const tokens = existing.split(',').map((token) => token.trim().toLowerCase());
  if (!tokens.includes('accept')) {
    headers.set('Vary', `${existing}, Accept`);
  }
};

/** RFC 9110 §15.5.7 recommends listing the available representations. */
export const notAcceptableBody = (requested: string | null) =>
  [
    'This resource is available in:',
    ...PRODUCES.map((type) => `- ${type}`),
    '',
    `You requested: ${requested ?? '(no Accept header)'}`,
    '',
  ].join('\n');
