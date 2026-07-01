interface TextListCardProps {
  items: string[];
}

export default function TextListCard({ items }: TextListCardProps) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex min-w-0 gap-2 text-sm leading-[1.65] text-muted-foreground">
          <span className="mt-[0.75em] size-1 shrink-0 rounded-full bg-primary" />
          <span className="min-w-0 break-keep break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}
