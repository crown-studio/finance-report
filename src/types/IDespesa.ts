export interface IDespesa {
	id: string;
	descricao: string;
	valor: number | string;
	pagamento: string;
	categoria: string;
	subcategoria: string;
	tipo: string;
	data: string;
	observacoes?: string;
}
