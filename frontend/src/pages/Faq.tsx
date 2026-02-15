import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="sm:text-3xl text-xl font-black text-slate-900">
            FAQ - Central de Ajuda
          </h1>
          <p className="text-slate-500 mt-2">
            Dúvidas frequentes sobre o funcionamento.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="lg:w-2xl md:w-120 w-full bg-white rounded-xl border p-6 shadow-sm"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold text-slate-700">
              Por que a API pode demorar para carregar inicialmente?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              O backend deste projeto está hospedado no plano gratuito do{" "}
              <strong>Render</strong>. Por padrão, o serviço entra em modo de
              repouso após 15 minutos de inatividade. Quando uma nova requisição
              é feita, ocorre o <strong>Cold Start</strong>, onde o servidor
              precisa "acordar", o que pode levar entre 40 a 60 segundos no
              primeiro carregamento.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold text-slate-700">
              Como foi estruturado o banco de dados?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Utilizamos um banco de dados relacional{" "}
              <strong>PostgreSQL</strong> hospedado no <strong>Supabase</strong>
              . A estrutura conta com tabelas para Materiais, Produtos e uma
              tabela associativa para as Receitas (ProductMaterial).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold text-slate-700">
              Qual foi a stack tecnológica utilizada?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              O ecossistema é composto por:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>
                  <strong>Backend:</strong> Java com framework Quarkus.
                </li>
                <li>
                  <strong>Frontend:</strong> React com Vite e Tailwind CSS v4
                  para estilização.
                </li>
                <li>
                  <strong>Estado:</strong> Redux Toolkit para centralização dos
                  dados de produção e inventário.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <footer className="pt-10 border-t border-slate-200 flex items-center justify-end gap-4">
        <p className="text-slate-500 text-sm font-medium">Desenvolvido por</p>
        <a
          href="https://thomgomes.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-900/30 text-white px-2 py-2 rounded-full hover:bg-slate-800/20 transition-all shadow-md"
        >
          <img src="/thomty.gif" alt="thom" width={46} />
        </a>
      </footer>
    </div>
  );
}
