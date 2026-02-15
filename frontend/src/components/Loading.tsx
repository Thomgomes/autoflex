import { Spinner } from "./ui/spinner";

export default function Loading() {
    return (
        <div className="flex my-24 w-full items-center justify-center flex-col">
            <Spinner className="size-12"/>
            <p>Sincronizando dados...</p>
            <p>Isso pode levar alguns segundos enquanto preparamos o ambiente. Agradecemos a paciência.</p>
        </div>
    )
}