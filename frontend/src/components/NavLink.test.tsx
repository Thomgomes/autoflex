import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavLink } from './NavLink';
import { Home } from 'lucide-react';

describe('NavLink Component', () => {
  it('should render the link with children content', () => {
    render(
      <MemoryRouter>
        <NavLink to="/dashboard">
          <Home data-testid="home-icon" />
          <span>Dashboard</span>
        </NavLink>
      </MemoryRouter>
    );

    // Verifica se o texto dentro do link aparece
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Verifica se o ícone foi renderizado
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();

    // Verifica se o atributo "href" está correto
    const anchor = screen.getByRole('link');
    expect(anchor).toHaveAttribute('href', '/dashboard');
  });

  it('should apply activeClassName when the link is active', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavLink 
          to="/dashboard" 
          activeClassName="bg-blue-500"
        >
          Dashboard
        </NavLink>
      </MemoryRouter>
    );

    const anchor = screen.getByRole('link');
    
    // Verifica se a classe customizada de "ativo" foi aplicada
    expect(anchor).toHaveClass('bg-blue-500');
  });
});