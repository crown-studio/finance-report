export const expenseCategories = [
	'Ajuda Social',
	'Alimentação',
	'Eventos',
	'Manutenção',
	'Missões',
	'Obras',
	'Outros',
	'Pagamentos',
	'Serviços',
	'Transporte',
];

export const expenseSubcategories = {
	'Ajuda Social': ['Alimentação', 'Outros', 'Saúde', 'Transporte'],
	Alimentação: ['Adultos', 'Comunhão', 'Crianças', 'Eventos', 'Jovens', 'Outros', 'Trabalhadores'],
	Eventos: ['Batismo', 'Dia das Mães', 'Dia do Pastor', 'Dia dos Pais', 'Outros'],
	Manutenção: ['Descartáveis', 'Limpeza', 'Outros', 'Papelaria', 'Utilidades'],
	Missões: ['Igreja', 'Outros', 'Pessoal', 'Projeto', 'Sustento'],
	Obras: ['Construção', 'Ferramentas', 'Material', 'Outros', 'Reforma', 'Reparos', 'Serviço', 'Outros'],
	Outros: ['Outros'],
	Pagamentos: ['Aluguel', 'Impostos', 'Outros', 'Salário', 'Taxas'],
	Serviços: ['Contabilidade', 'Energia', 'Gás', 'Impressão', 'Outros', 'Água', 'Água Mineral'],
	Transporte: ['Combustível', 'Manutenção', 'Outros', 'Taxi', 'Passagem'],
};

export const revenueCategories = ['Dízimo', 'Oferta', 'Juros', 'Outros'];

export const revenueSubcategories = {
	Dízimo: ['EBD', 'Missões', 'Pessoal', 'Outros'],
	Oferta: ['Outros'],
	Juros: ['Outros'],
	Outros: ['Outros'],
};
