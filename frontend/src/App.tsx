import { useState, useEffect } from 'react'
import axios from 'axios'

// 1. Interfaces locais para o teste
interface Material {
  id: number;
  name: string;
  stockQuantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductionSuggestion {
  productName: string;
  quantityToProduce: number;
}

interface ProductionResponse {
  suggestions: ProductionSuggestion[];
  totalValue: number;
}

const API_URL = 'https://autoflex-api-lsgq.onrender.com'

function App() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suggestion, setSuggestion] = useState<ProductionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true)
        
        // Testando os 3 principais endpoints simultaneamente
        const [resMaterials, resProducts, resSuggestion] = await Promise.all([
          axios.get(`${API_URL}/materials`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/production/suggestion`)
        ])

        setMaterials(resMaterials.data)
        setProducts(resProducts.data)
        setSuggestion(resSuggestion.data)
        
      } catch (err: any) {
        console.error(err)
        setError(`Erro na API: ${err.message}. Verifique se o Backend no Render está ativo (pode levar 1 min para "acordar").`)
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) return <div className="p-10 text-xl font-bold">Conectando ao Backend no Render... 🚀</div>
  if (error) return <div className="p-10 text-red-500 font-mono">{error}</div>

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8 font-sans text-slate-900">
      <h1 className="text-3xl font-black text-indigo-600 border-b pb-4">🛠️ Autoflex API Debugger</h1>

      {/* Seção de Sugestão de Produção (RF004 / RF008) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
        <h2 className="text-xl font-bold mb-4 text-indigo-800">Cálculo de Produção Sugerida</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 uppercase font-bold">Valor Total Estimado</p>
            <p className="text-3xl font-black">
              {suggestion?.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Produtos a produzir:</p>
            {suggestion?.suggestions.map((s, idx) => (
              <div key={idx} className="flex justify-between bg-slate-100 p-2 rounded">
                <span>{s.productName}</span>
                <span className="font-bold">x {s.quantityToProduce}</span>
              </div>
            ))}
            {suggestion?.suggestions.length === 0 && <p className="text-slate-400 italic">Nenhum produto pode ser produzido com o estoque atual.</p>}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista de Materiais (RF002 / RF006) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-slate-700">Estoque de Materiais</h2>
          <ul className="space-y-2">
            {materials.map(m => (
              <li key={m.id} className="flex justify-between text-sm border-b py-1 last:border-0">
                <span>{m.name}</span>
                <span className={`font-mono ${m.stockQuantity < 5 ? 'text-red-500 font-bold' : ''}`}>
                  {m.stockQuantity} un
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Lista de Produtos (RF001 / RF005) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-slate-700">Catálogo de Produtos</h2>
          <ul className="space-y-2">
            {products.map(p => (
              <li key={p.id} className="flex justify-between text-sm border-b py-1 last:border-0">
                <span>{p.name}</span>
                <span className="font-semibold text-green-600">
                  {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="text-center text-slate-400 text-xs pt-10">
        Status: Conectado a {API_URL}
      </footer>
    </div>
  )
}

export default App