interface TitleBarProps {
  title: string;
}

export default function TitleBar({ title }: TitleBarProps) {
  return (
    <div className="bg-blue-600 text-white p-4">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
