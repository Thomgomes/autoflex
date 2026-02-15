import { render, screen, fireEvent } from '@testing-library/react';
import { BaseModal } from './BaseModal';
import '@testing-library/jest-dom';

describe('BaseModal Component', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn((e) => e.preventDefault());

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    title: 'Modal de Teste',
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  };

  it('should render title and children correctly', () => {
    render(
      <BaseModal {...defaultProps}>
        <div data-testid="child-element">Conteúdo Interno</div>
      </BaseModal>
    );

    expect(screen.getByText('Modal de Teste')).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    // Procuramos o botão pelo texto específico para evitar ambiguidade com o botão de fechar
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('should call onSubmit when clicking the submit button', () => {
    render(<BaseModal {...defaultProps}>Conteúdo</BaseModal>);
    
    // Clicar no botão de submit deve disparar o onSubmit do formulário
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should show spinner and disable button when isSubmitting is true', () => {
    render(<BaseModal {...defaultProps} isSubmitting={true}>Conteúdo</BaseModal>);
    
    // Quando isSubmitting é true, o texto "Salvar" some e entra o Spinner (que tem aria-label="Loading")
    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('should not render content when open is false', () => {
    render(
      <BaseModal {...defaultProps} open={false}>
        <div data-testid="modal-content">Conteúdo</div>
      </BaseModal>
    );

    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });
});