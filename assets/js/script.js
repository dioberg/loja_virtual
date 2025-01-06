const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')
const sectionHero = document.querySelector('.hero')

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
    //preencher nome, modelo e preco
    document.querySelector('.detalhes span').innerHTML = product.id // ajuste aula 11
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

// aula 11
const btnCarrinho = document.querySelector('.btn__carrinho .icone')
const sectionCarrinho = document.querySelector('.carrinho')

btnCarrinho.addEventListener('click', () => {
    sectionCarrinho.style.display = 'block'

    sectionHero.style.display = 'none'
    sectionProdutos.style.display = 'none'
    sectionDetalhesProduto.style.display = 'none'
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (event) => {
    event.preventDefault()
    sectionCarrinho.style.display = 'none'
    sectionHero.style.display = 'flex'
    sectionProdutos.style.display = 'flex'
    // ajuste 
    ocultarBotaoEsecao() //ajuste aula 12
})

//aula 12
//controlar seleção dos inputs radio
const radios = document.querySelectorAll('input[type="radio"]')
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const label = document.querySelector(`label[for="${radio.id}"]`)
        label.classList.add('selecionado')
        console.log(label)
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })  
    })
})

const resetarSelecao = (radios) => {
    radios.forEach(radio => {
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })
    })
}

const cart = []
const btnAddCarrinho = document.querySelector('.btn__add_cart')
btnAddCarrinho.addEventListener('click', () => {
    // pegar dados do produto adicionado
    const produto = {
        id: document.querySelector('.detalhes span').innerHTML,
        nome: document.querySelector('.detalhes h4').innerHTML,
        modelo: document.querySelector('.detalhes h5').innerHTML,
        preco: document.querySelector('.detalhes h6').innerHTML,
        tamanho: document.querySelector('input[type="radio"][name="size"]:checked').value
    }

    console.log(produto)
    cart.push(produto) // adicionar o produto no array em cart
    console.log(cart)
    //ocultar botao voltar e secao detalhes_priduto e exibir secao carrinho e hero
    ocultarBotaoEsecao()
    sectionHero.style.display = 'none'
    sectionCarrinho.style.display = 'block'

    atualizarCarrinho(cart)
    atualizarNumeroItens()
})

const corpoTabela = document.querySelector('.carrinho tbody')
atualizarCarrinho = (cart) => {
    corpoTabela.innerHTML = "" //limpar linhas da tabela
    cart.map(produto => {
        corpoTabela.innerHTML += `
            <tr> 
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td class='coluna_tamanho'>${produto.tamanho}</td>
                <td class='coluna_preco'>${produto.preco}</td>
                <td class='coluna_apagar'>
                    <span class="material-symbols-outlined" data-id="${produto.id}">
                        delete
                    </span>
                </td>
            </tr>
        `
    })
}

const numeroItens = document.querySelector('.numero_itens')
const atualizarNumeroItens = () => {
    numeroItens.innerHTML = cart.length
}