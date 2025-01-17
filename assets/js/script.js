import { numberFormatBR, limparFormatoReal } from './utils.js'

const sectionHero = document.querySelector('.hero')
const sectionProdutos = document.querySelector('.produtos')
const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionCarrinho = document.querySelector('.carrinho')

const ocultarElemento = (elemento) => {
    elemento.style.display = 'none'
}

const mostrarElemento = (elemento, display='block') => { 
    elemento.style.display = display
}

//NAVEGAÇÃO
const ocultarVoltarEsecaoDetalhes = () => {
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionDetalhesProduto)
}
ocultarVoltarEsecaoDetalhes()

botaoVoltar.addEventListener('click', () => {
    mostrarElemento(sectionProdutos, 'flex')
    ocultarVoltarEsecaoDetalhes()
})

const btnCarrinho = document.querySelector('.btn__carrinho .icone')
btnCarrinho.addEventListener('click', () => {
    mostrarElemento(sectionCarrinho)
    ocultarElemento(sectionHero)
    ocultarElemento(sectionProdutos)
    ocultarElemento(sectionDetalhesProduto)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (event) => {
    event.preventDefault()
    ocultarElemento(sectionCarrinho)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)
    
    ocultarVoltarEsecaoDetalhes()
})

//NUMERO DE ITENS NO CARRINHO
const numeroItens = document.querySelector('.numero_itens')
ocultarElemento(numeroItens)//ocultar numero de item no carrinho

const atualizarNumeroItens = () => {
    numeroItens.style.display = cart.length ? 'block' : 'none'
    numeroItens.innerHTML = cart.length
}
//--------------------------------------------
//PAGE HOME 
//pegar dados dos produtos
const getProducts = async () => {
    const response = await fetch('assets/js/products.json')
    const data = await response.json()
    return data
}

//gerar dinamicamente os cards de cada produtos
const generateCard = async () => {
    const products = await getProducts()
    products.map((product) => {
        let card = document.createElement('div')
        card.id = product.id
        card.classList.add('card__produto')
        card.innerHTML = `
        <figure>
            <img src="./assets/image/${product.image}" alt="${product.product_name}">
        </figure>
        <div class="card__produto_detalhes">
            <h4>${product.product_name}</h4>
            <h5>${product.product_model}</h5>
        </div>
                    
                <h6>${numberFormatBR.format(product.price)}</h6>
        `

        const listaProdutos = document.querySelector('.lista__produtos')
        listaProdutos.appendChild(card)
        preencherCard(card, products)
    })
    //aula 14 - R$&nbsp;1.123,45 -> 1123.45
    const total = cart.reduce((valorAcumulado, item) => {
        return valorAcumulado + parseFloat(item.preco.replace('R$&nbsp;', '').replace('.', '').replace(',','.'))
    },0)
    document.querySelector('.coluna_total').innerHTML = numberFormatBR.format(total) //1123.45

    acaoBotaoApagar()
}

generateCard()

//preencher cards
const preencherCard = (card, products) => {
    card.addEventListener('click', (e) => {
        //ocultar e mostrar o botao e página de detalhes do produto
        ocultarElemento(sectionProdutos)
        mostrarElemento(botaoVoltar)
        mostrarElemento(sectionDetalhesProduto, 'grid')

        //indentificar qual card foi clicado
        const cardClicado = e.currentTarget
        const idProduto = cardClicado.id
        const produtoClicado = products.find(product => product.id == idProduto)
        //preencher os dados de detelhes do produto
        preencherDadosProduto(produtoClicado)
    })
}

//PAGE DETALHES
//preencher dados do produto na página de detalhes do produto
const preencherDadosProduto = (product) =>{
    //preencher imagens 
    const images = document.querySelectorAll('.produto__detalhes_images figure img')
    const imagesArray = Array.from(images)
    imagesArray.map(image => {
        image.src = `./assets/image/${product.image}`
    })
    //preencher nome, modelo e preco
    document.querySelector('.detalhes span').innerHTML = product.id 
    document.querySelector('.detalhes h4').innerHTML = product.product_name
    document.querySelector('.detalhes h5').innerHTML = product.product_model
    document.querySelector('.detalhes h6').innerHTML = numberFormatBR.format(product.price)
}

//selecionar o span do id e ocultar ele
const spanId = document.querySelector('.detalhes span')
ocultarElemento(spanId)

//mudar icone do details frete
const details = document.querySelector('details')
details.addEventListener('toggle', () => {
    const summary = details.querySelector('summary')
    summary.classList.toggle('icone-expandir')
    summary.classList.toggle('icone-recolher')
})

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

//PAGE CARRINHO
//pegar dados dos produtos
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
    cart.push(produto) // adicionar o produto no array em cart
    ocultarVoltarEsecaoDetalhes()
    ocultarElemento(sectionHero)
    mostrarElemento(sectionCarrinho)


    atualizarCarrinho(cart)
    atualizarNumeroItens()
})

const corpoTabela = document.querySelector('.carrinho tbody')
const colunaTotal = document.querySelector('.coluna_total')
const atualizarCarrinho = (cart) => {
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
    //somas os valores dos produtos
    const total = cart.reduce((valorAcumulado, item) => {
        return valorAcumulado + limparFormatoReal(item.preco)
    }, 0)
    colunaTotal.innerHTML = numberFormatBR.format(total) 
    spanSubTotal.innerHTML = numberFormatBR.format(total)
    spanTotalCompra.innerHTML = numberFormatBR.format(total + valorFrete - valorDesconto)

    acaoBotaoApagar()
}

//botao apagar=======*
const acaoBotaoApagar = () => {
    const botaoApagar = document.querySelectorAll('.coluna_apagar span')
    botaoApagar.forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id')
            const posicao = cart.findIndex(item => item.id == id)
            cart.splice(posicao, 1)
            atualizarCarrinho(cart)
        })
    })

    atualizarNumeroItens()
}

// aula 17 
let valorFrete = 0
let valorDesconto = 0

const spanSubTotal = document.querySelector('.sub_total')
const spanFrete = document.querySelector('.valor_frete')
const spanDesconto = document.querySelector('.valor_desconto')
const spanTotalCompra = document.querySelector('.total_compra')

spanFrete.innerHTML = numberFormatBR.format(valorFrete)
spanDesconto.innerHTML = numberFormatBR.format(valorDesconto)



// aula 18
const sectionIdentificacao = document.querySelector('.identificacao')
const sectionPagamento = document.querySelector('.pagamento')

ocultarElemento(sectionIdentificacao)
ocultarElemento(sectionPagamento)

const btnContinuarCarrinho = document.querySelector('.btn_continuar')
btnContinuarCarrinho.addEventListener('click', () => {
    mostrarElemento(sectionIdentificacao)
    ocultarElemento(sectionCarrinho)
})

// aula 20 validacoes   
const formularioIdentificacao = document.querySelector('.form_identificacao')
const todosCamposObrigatorios = formularioIdentificacao.querySelectorAll('[required]')
const todosCampos = formularioIdentificacao.querySelectorAll('input')

const pegarDados = () => {
    const dados = {}
    todosCampos.forEach(campo => {
        dados[campo.id] = campo.value.trim()
    })
    return dados
}

const validacaoDoFormulario = () => {

    let formularioValido = true

    todosCamposObrigatorios.forEach(campoObrigatorio => {
        const isEmpty = campoObrigatorio.value.trim()  === "" 
        const isNotChecked = campoObrigatorio.type === "checkbox" && !campoObrigatorio.checked

        if(isEmpty) {
            campoObrigatorio.classList.add('campo_invalido')
            campoObrigatorio.nextElementSibling.textContent = `${campoObrigatorio.id} é obrigatório`
            formularioValido = false
        }else {
            campoObrigatorio.classList.add('campo_valido')
            campoObrigatorio.classList.remove('campo_invalido')
            campoObrigatorio.nextElementSibling.textContent = ""

        }

        if(isNotChecked) {
            campoObrigatorio.parentElement.classList.add('erro')
            formularioValido = false
        }else {
            campoObrigatorio.parentElement.classList.remove('erro')
        }
    })

    return formularioValido
}

const btn_finalizar_cadrasto = document.querySelector('.btn_finalizar_cadrasto')
btn_finalizar_cadrasto.addEventListener('click', (event) => {
    // mostrarElemento(sectionPagamento)
    // ocultarElemento(sectionIdentificacao)
    event.preventDefault()

    // validacoes
    validacaoDoFormulario()

    // pegar dados
    if(validacaoDoFormulario()) {
        console.log(pegarDados())
    }
    
})

// validacao  onblur
todosCamposObrigatorios.forEach(campo => {
     
    const emailRegex = /\S+@\S+\.\S+/

    campo.addEventListener('blur', (e) => {
        if(campo.value !== "" && e.target.type !== "email") {
            campo.classList.add('campo_valido')
            campo.classList.remove('campo_invalido')
            campo.nextElementSibling.innerHTML = ""
        }else {
            campo.classList.add('campo_invalido')
            campo.classList.remove('campo_valido')
            campo.nextElementSibling.innerHTML = `${campo.id} é obrigatório`
        }

        if(emailRegex.test(e.target.value)) {
            campo.classList.add('campo_valido')
            campo.classList.remove('campo_invalido')
            campo.nextElementSibling.innerHTML = "" 
        }

        if(e.target.type === "checkbox" && !e.target.checked) {
            campo.parentElement.classList.add('erro')

        }else{
            campo.parentElement.classList.remove("erro")
        }

    })
})

const btnFinalizarCompra = document.querySelector('.btn_finalizar_compra')
btnFinalizarCompra.addEventListener('click', () => {
    ocultarElemento(sectionPagamento)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
})

// aula 22

const buscarCep = async (cep) => {
    const url = `https://viacep.com.br/ws/${cep}/json/` 
    const response = await fetch(url)
    const data = await response.json()
    return data 
}

document.querySelector('#cep1').addEventListener('blur', async (e) => {
    const cep = e.target.value
    if(!cep) {
        limparCampos()
        return
    }
    
    const resposta = await buscarCep(cep)
    if(resposta.erro) {
        limparCampos()
        return
    }
    preencherCampos(resposta)
    document.querySelector('#numero').focus()
})

const limparCampos = () => {
    document.querySelector('#endereco').value = ""
    document.querySelector('#bairro').value = ""
    document.querySelector('#cidade').value = ""
    document.querySelector('#estado').value = ""
}


const preencherCampos = (resposta) => {
    document.querySelector('#endereco').value = resposta.logradouro
    document.querySelector('#bairro').value = resposta.bairro
    document.querySelector('#cidade').value = resposta.localidade
    document.querySelector('#estado').value = resposta.uf
}

