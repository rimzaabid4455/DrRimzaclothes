const messages = [
  '✦ Free shipping across the UAE on orders above AED 500',
  '✦ Cash on Delivery available',
  '✦ Eid Collection 2026 — Now in the boutique',
  '✦ Hand-crafted in Dubai',
  '✦ Complimentary alterations in-atelier',
];

export default function AnnouncementBar() {
  const repeated = [...messages, ...messages];
  return (
    <div className="overflow-hidden bg-gold-400 py-2 text-ink-900">
      <div className="marquee flex w-max gap-12 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.3em]">
        {repeated.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}
