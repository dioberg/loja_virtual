//fomatador numeros para formato monetario brasileiro e exibir o simnolo de moeda
export const numberFormatBR = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits:2,
    maximumFractionDigits:2,
})

export const limparFormatoReal = (valor) => {
    return parseFloat(valor.replace('R$&nbsp;', '').replace('.', '').replace(',', '.'))
}
