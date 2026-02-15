import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Para termos o .toBeInTheDocument()
import Loading from './Loading';

describe('Loading Component', () => {
  it('should render the default message and description', () => {
    // 1. "Desenha" o componente no ambiente de teste
    render(<Loading />);

    // 2. Procura os textos padrão que estão no seu código
    const message = screen.getByText(/Sincronizando dados.../i);
    const description = screen.getByText(/Isso pode levar alguns segundos/i);

    // 3. Verifica se eles realmente apareceram na tela
    expect(message).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('should render a custom message when props are provided', () => {
    // 1. Renderiza o componente com mensagens personalizadas
    render(
      <Loading 
        message="Checking Stock..." 
        description="Wait a moment please." 
      />
    );

    // 2. Verifica se as mensagens personalizadas aparecem
    expect(screen.getByText('Checking Stock...')).toBeInTheDocument();
    expect(screen.getByText('Wait a moment please.')).toBeInTheDocument();
    
    // 3. Garante que a mensagem padrão NÃO aparece mais
    expect(screen.queryByText('Sincronizando dados...')).not.toBeInTheDocument();
  });
});