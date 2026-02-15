import { Spinner } from "./ui/spinner";

interface LoadingProps {
  message?: string;
  description?: string;
}

export default function Loading({
  message = "Sincronizando dados...",
  description = "Isso pode levar alguns segundos enquanto preparamos o ambiente. Agradecemos a paciência.",
}: LoadingProps) {
  return (
    <div className="flex my-24 w-full items-center justify-center flex-col">
      <Spinner className="size-12" />
      <p>{message}</p>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
  );
}
