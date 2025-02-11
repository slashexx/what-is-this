interface LoadingProps {
  className?: string;
}

export default function Loading({ className = "min-h-screen" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
