/**
 * Renders one or more JSON-LD blocks. Server component on purpose: the markup
 * ships inside the initial HTML, which is what crawlers read.
 *
 * Usage: <JsonLd data={[organizationSchema(), breadcrumbSchema(trail)]} />
 */
export default function JsonLd({ data }) {
  const blocks = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is escaped below so a stray "</script>" in
          // content can never break out of the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
