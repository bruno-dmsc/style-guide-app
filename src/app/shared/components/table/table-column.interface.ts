export interface TableColumn {
  field: string;       // Nome da propriedade no objeto (ex: 'codigo')
  header: string;      // Texto do cabeçalho (ex: 'CÓDIGO')
  align?: 'left' | 'center' | 'right'; // Alinhamento do texto
  minWidth?: string;
}

// NOVA INTERFACE PARA AÇÕES
export interface TableAction {
  id: string;       // Identificador da ação (ex: 'editar', 'excluir')
  icon: string;     // Ícone do PrimeNG (ex: 'pi-pencil', 'pi-trash')
  color?: any;      // Cor do botão (ex: 'help', 'danger')
  tooltip?: string; // (Opcional) Texto que aparece ao passar o mouse
}