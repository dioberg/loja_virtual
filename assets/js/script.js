const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')

const ocultarBotaoEsecao = () => {
    //ocultar botao voltar e secao detalhes do produto
botaoVoltar.style.display = 'none'
sectionDetalhesProduto.style.display = 'none'
}
ocultarBotaoEsecao()

const numberFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits:2,
    maximumFractionDigits:2,
})

// const formatCurrency = (numero) => {
//     return numero.toLocaleString('pt-BR', {
//         style: 'currency',
//         currency: 'BRL',
//     })
// }

const getProducts = async () => {
    const response = await fetch('assets/js/products.json')
    const data = await response.json()

    return data
}

const criarCard = async () => {
    const products = await getProducts()
    products.map((product) => {
        let card = document.createElement('div')
        card.id = product.id //1 o passo da aula 09
        card.classList.add('card__produto')
        card.innerHTML = `
        <figure>
            <img src="./assets/image/${product.image}" alt="${product.product_name}">
        </figure>
        <div class="card__produto_detalhes">
            <h4>${product.product_name}</h4>
            <h5>${product.product_model}</h5>
        </div>
                    
                <h6>${numberFormat.format(product.price)}</h6>
        `

        const listaProdutos = document.querySelector('.lista__produtos')
        listaProdutos.appendChild(card)
        preencherCard(card,products)
    })
}
criarCard()

botaoVoltar.addEventListener('click', () => {
        sectionProdutos.style.display = 'flex'
        ocultarBotaoEsecao()
})

const preencherDadosProduto = (product) =>{
    //preencher imagens 
    const images = document.querySelectorAll('.produto__detalhes_images figure img')
    const imagesArray = Array.from(images)
    imagesArray.map(image => {
        image.src = `./assets/image/${product.image}`
    })
    console.log(imagesArray)
    //preencher nome, modelo e preco
    document.querySelector('.detalhes h4').innerHTML = product.product_name
    document.querySelector('.detalhes h5').innerHTML = product.product_model
    document.querySelector('.detalhes h6').innerHTML = numberFormat.format(product.price)
}

const details = document.querySelector('details')
details.addEventListener('toggle', () => {
    const summary = details.querySelector('summary')
    summary.classList.toggle('icone-expandir')
    summary.classList.toggle('icone-recolher')
})

const preencherCard = (card, products) => {
    
    card.addEventListener('click', (e) => {
        //ocultar e mostrar o botao e página de detalhes do produto
        sectionProdutos.style.display = 'none'
        botaoVoltar.style.display = 'block'
        sectionDetalhesProduto.style.display = 'grid'

        //indentificar qual card foi clicado
        const cardClicado = e.currentTarget
        const idProduto = cardClicado.id
        const produtoClicado = products.find(product => product.id == idProduto)
        //preencher os dados de detelhes do produto
        preencherDadosProduto(produtoClicado)
    })
}
