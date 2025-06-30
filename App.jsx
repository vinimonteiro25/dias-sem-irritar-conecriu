import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import conecriumIrritadoGif from './assets/conecriu-irritado.webp'
import './App.css'

function App() {
  const [diasSemIrritar, setDiasSemIrritar] = useState(0)
  const [ultimaDataReset, setUltimaDataReset] = useState(null)
  const [mostrarGif, setMostrarGif] = useState(false)
  const [animacaoReset, setAnimacaoReset] = useState(false)

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('diasSemIrritarConecriu')
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos)
      setDiasSemIrritar(dados.dias || 0)
      setUltimaDataReset(dados.ultimaData ? new Date(dados.ultimaData) : null)
    }
  }, [])

  // Calcular dias automaticamente baseado na última data de reset
  useEffect(() => {
    if (ultimaDataReset) {
      const hoje = new Date()
      const diffTime = hoje.getTime() - ultimaDataReset.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setDiasSemIrritar(diffDays)
    }
  }, [ultimaDataReset])

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    if (ultimaDataReset) {
      const dados = {
        dias: diasSemIrritar,
        ultimaData: ultimaDataReset.toISOString()
      }
      localStorage.setItem('diasSemIrritarConecriu', JSON.stringify(dados))
    }
  }, [diasSemIrritar, ultimaDataReset])

  const handleIrriteiConecriu = () => {
    setAnimacaoReset(true)
    setMostrarGif(true)
    
    // Reset do contador
    const agora = new Date()
    setUltimaDataReset(agora)
    setDiasSemIrritar(0)

    // Esconder o GIF após 3 segundos
    setTimeout(() => {
      setMostrarGif(false)
      setAnimacaoReset(false)
    }, 3000)
  }

  const formatarData = (data) => {
    if (!data) return 'Nunca'
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCorContador = () => {
    if (diasSemIrritar === 0) return 'text-red-500'
    if (diasSemIrritar < 7) return 'text-orange-500'
    if (diasSemIrritar < 30) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getMensagemMotivacional = () => {
    if (diasSemIrritar === 0) return 'Recomeçando... 🙄'
    if (diasSemIrritar === 1) return 'Um dia de paz! 😌'
    if (diasSemIrritar < 7) return 'Progredindo bem! 😊'
    if (diasSemIrritar < 30) return 'Excelente controle! 🎉'
    if (diasSemIrritar < 100) return 'Você é um mestre da paciência! 🧘‍♂️'
    return 'LENDÁRIO! O CONECRIU está em paz! 👑'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            DIAS SEM IRRITAR
          </h1>
          <h2 className="text-2xl font-semibold text-indigo-600">
            O CONECRIU
          </h2>
        </div>

        {/* Contador Principal */}
        <Card className={`text-center transition-all duration-500 ${animacaoReset ? 'animate-pulse' : ''}`}>
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">
              Contador Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-8xl font-bold mb-4 transition-colors duration-300 ${getCorContador()}`}>
              {diasSemIrritar}
            </div>
            <div className="text-xl text-gray-600 mb-2">
              {diasSemIrritar === 1 ? 'dia' : 'dias'}
            </div>
            <div className="text-sm text-gray-500">
              {getMensagemMotivacional()}
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Último reset:</span>
                <span className="font-medium">{formatarData(ultimaDataReset)}</span>
              </div>
              <div className="flex justify-between">
                <span>Recorde pessoal:</span>
                <span className="font-medium text-green-600">
                  {localStorage.getItem('recordePessoal') || diasSemIrritar} dias
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Ação */}
        <Button 
          onClick={handleIrriteiConecriu}
          className="w-full h-16 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105"
          disabled={mostrarGif}
        >
          <AlertTriangle className="mr-2 h-6 w-6" />
          {mostrarGif ? 'CONECRIU IRRITADO!' : 'HOJE EU IRRITEI O CONECRIU'}
        </Button>

        {/* GIF Modal */}
        {mostrarGif && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center animate-bounce-in">
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                CONECRIU IRRITADO! 😤
              </h3>
              <img 
                src={conecriumIrritadoGif} 
                alt="CONECRIU Irritado" 
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-gray-600">
                O contador foi resetado! 😔
              </p>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center text-xs text-gray-400">
          Mantenha a paz com o CONECRIU! 🕊️
        </div>
      </div>
    </div>
  )
}

export default App

