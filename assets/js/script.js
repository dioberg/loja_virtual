import { numberFormatBR, limparFormatoReal } from './utils.js'

const sectionHero = document.querySelector('.hero')
const sectionProdutos = document.querySelector('.produtos')
const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionCarrinho = document.querySelector('.carrinho')

let usuarioLogado = false

//NAVEGAÇÃO
const ocultarElemento = (elemento) => {
    elemento.style.display = 'none'
}

const mostrarElemento = (elemento, display='block') => { 
    elemento.style.display = display
}

const irParaHome = () => {
    ocultarElemento(sectionPagamento)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionIdentifiqueSe)
    ocultarElemento(sectionCarrinho)
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionDetalhesProduto)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
}

const irParaPagamento = () => {
    ocultarElemento(sectionIdentifiqueSe)
    if(numeroItens.innerHTML > 0) {
        ocultarElemento(sectionHero)
        ocultarElemento(sectionProdutos)
        ocultarVoltarEsecaoDetalhes() 
        ocultarElemento(sectionCarrinho) 
        mostrarElemento(sectionPagamento)
    }
}

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
    if(numeroItens.innerHTML > 0) {
        mostrarElemento(sectionCarrinho)
        ocultarElemento(sectionHero)
        ocultarElemento(sectionProdutos)
        ocultarElemento(sectionDetalhesProduto)
        ocultarElemento(sectionIdentificacao)
        ocultarElemento(sectionPagamento)
    }
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (event) => {
    event.preventDefault()
   irParaHome()
})

//NUMERO DE ITENS NO CARRINHO
const numeroItens = document.querySelector('.numero_itens')
ocultarElemento(numeroItens)

const atualizarNumeroItens = () => {
    numeroItens.style.display = cart.length ? 'block' : 'none'
    numeroItens.innerHTML = cart.length
}

//PAGE HOME 
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
let cart = []
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
    cart.push(produto)
    ocultarVoltarEsecaoDetalhes()
    ocultarElemento(sectionHero)
    mostrarElemento(sectionCarrinho)
    atualizarCarrinho(cart)
    atualizarNumeroItens()
})

const corpoTabela = document.querySelector('.carrinho tbody')
const colunaTotal = document.querySelector('.coluna_total')
const atualizarCarrinho = (cart) => {
    corpoTabela.innerHTML = "" 
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
    criarCompra()
}

const criarCompra = () => {
    console.log(cart)
    const dataAtual = new Date().toLocaleDateString()
    const compra = {
        dataCompra: dataAtual,
        carrinho: cart,
        totalCompra: limparFormatoReal(spanTotalCompra.innerHTML)
    }
    localStorage.setItem('carrinho', JSON.stringify(compra))
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
    if(numeroItens.innerHTML <= 0) { 
        irParaHome() 
    }
}

let valorFrete = 0
let valorDesconto = 0
const spanSubTotal = document.querySelector('.sub_total')
const spanFrete = document.querySelector('.valor_frete')
const spanDesconto = document.querySelector('.valor_desconto')
const spanTotalCompra = document.querySelector('.total_compra')
spanFrete.innerHTML = numberFormatBR.format(valorFrete)
spanDesconto.innerHTML = numberFormatBR.format(valorDesconto)
const sectionIdentificacao = document.querySelector('.identificacao')
const sectionPagamento = document.querySelector('.pagamento')

ocultarElemento(sectionIdentificacao)
ocultarElemento(sectionPagamento)

const btnContinuarCarrinho = document.querySelector('.btn_continuar')
btnContinuarCarrinho.addEventListener('click', () => {
    ocultarElemento(sectionCarrinho)
    if(usuarioLogado) {
        mostrarElemento(sectionPagamento) 
        return
    }
    mostrarElemento(sectionIdentifiqueSe, 'flex')
})

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
    event.preventDefault()
    validacaoDoFormulario()
    if(validacaoDoFormulario()) {
        localStorage.setItem('dados', JSON.stringify(pegarDados()))
        formularioIdentificacao.reset()
        mostrarElemento(sectionPagamento)
        ocultarElemento(sectionIdentificacao)
    }
})

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

const btnOpenLogin = document.querySelector('#btn_open_login')
const modalLogin = document.querySelector('.modal_login')
const overlayLogin = document.querySelector('.modal_overlay')
const btnCloseLogin = document.querySelector('.btn_close_login')
const btnFazerLogin = document.querySelector('.btn_fazer_login')

document.addEventListener('click', (e) => {
    if(e.target === btnOpenLogin || e.target === btnFazerLogin) {
       (!usuarioLogado) &&  mostrarModal()
    }
})

document.addEventListener('click', (event) => {
    if(event.target === overlayLogin || event.target === btnCloseLogin) {
        fecharModal()
    }
})

const mostrarModal = () => {
    modalLogin.classList.add('show')
    overlayLogin.classList.add('show')
}

const fecharModal = () => {
   modalLogin.classList.remove('show')
   overlayLogin.classList.remove('show')
}

const nomeUsuario = document.querySelector('#nome_usuario')
const btnLogOut = document.querySelector('#btn_logOut')
const formularioLogar = document.querySelector('.form_logar')
const emailLogin = document.querySelector('#email_login')
const senhaLogin = document.querySelector('#senha_login')   

ocultarElemento(btnLogOut)
formularioLogar.addEventListener('submit', (e) => {
    e.preventDefault()
    nomeUsuario.innerHTML = emailLogin.value
    mostrarElemento(btnLogOut)
    formularioLogar.reset()
    fecharModal()
    usuarioLogado = true
    localStorage.setItem('nomeUsuario', nomeUsuario.innerHTML)
    irParaPagamento()
})

const logout = () => {
    ocultarElemento(btnLogOut)
    nomeUsuario.innerHTML = ""
     usuarioLogado = false
     localStorage.removeItem('nomeUsuario')
     localStorage.removeItem('carrinho')
     irParaHome()
}

btnLogOut.addEventListener('click', logout)

const modalCadastrarUsuario = document.querySelector('.modal_cadastrar_usuario')
const overlayCadastrarUsuario = document.querySelector('.modal_overlay_cadastrar')
const btnCloseCadastrar = document.querySelector('.btn_close_cadastrar')
const linkCadastrar = document.querySelector('.link_cadastrar')
const btnCriarConta = document.querySelector('.btn_criar_conta')

document.addEventListener('click', (e) => {
    if(e.target === linkCadastrar || e.target === btnCriarConta) {
        e.preventDefault()
        fecharModal() 
        modalCadastrarUsuario.classList.add('show')
        overlayCadastrarUsuario.classList.add('show')
    }
})

btnCloseCadastrar.addEventListener('click', () => {
    modalCadastrarUsuario.classList.remove('show')
    overlayCadastrarUsuario.classList.remove('show')
})

const formularioCadastrarUsuario = document.querySelector('.form_cadastrar_usuario')
const formAviso = document.querySelector('.form_aviso')

formularioCadastrarUsuario.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.querySelector('#email_usuario').value
    const senha = document.querySelector('#senha_usuario').value
    const confirmaSenha = document.querySelector('#confirma_senha_usuario').value
    const mensagemSenhaInvalida = senha.length < 5 ? "Senha deve ter pelo menos 5 caracteres" : "Senha e confirmação de senha não conferem"
    if(senha.length < 5 || senha !== confirmaSenha) {
        formAviso.innerHTML = mensagemSenhaInvalida
        return
    }

    formularioCadastrarUsuario.reset()
    formAviso.innerHTML = ""
    modalCadastrarUsuario.classList.remove('show')
    overlayCadastrarUsuario.classList.remove('show')

    const usuario = { email, senha}
    nomeUsuario.innerHTML = usuario.email
    mostrarElemento(btnLogOut)
    usuarioLogado = true
    localStorage.setItem('nomeUsuario', nomeUsuario.innerHTML)
    irParaPagamento()
})

const sectionIdentifiqueSe = document.querySelector('.identifique-se') 
ocultarElemento(sectionIdentifiqueSe)

// pegar os dados do pagamento
const formularioPagamento = document.querySelector('.form_pagamento')
formularioPagamento.addEventListener('submit', (e) => {
    e.preventDefault()
    const cartao = {
        numeroCartao: document.querySelector('#numero_cartao').value,
        nomeImpresso:  document.querySelector('#nome_impresso').value,
        validade: document.querySelector('#validade').value,
        codigoSeguranca:  document.querySelector('#codigo_seguranca').value,
        numeroParcelas: document.querySelector('#numero_parcelas').value
    }
    const pedido = {
        id: 1,
        usurio: localStorage.getItem('nomeUsuario'),
        carrinho: JSON.parse(localStorage.getItem('carrinho')),
        cartao: cartao
    }
    localStorage.setItem('pedido', JSON.stringify(pedido))
    formularioPagamento.reset()
    irParaHome()
    zerarCarrinho()
})

const zerarCarrinho = () => {
    cart = []
    atualizarCarrinho(cart)
    atualizarNumeroItens()
}
