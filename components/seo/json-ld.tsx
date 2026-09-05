/** Renders a schema.org JSON-LD block. `data` is left loosely typed since
 *  schema.org's vocabulary is far larger than any single interface here —
 *  callers are responsible for shaping valid schema.org objects. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
