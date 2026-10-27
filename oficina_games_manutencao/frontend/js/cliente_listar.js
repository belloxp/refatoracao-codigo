const token = localStorage.getItem('token')

// Proteção da rota privada: se não tem token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/clientes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => {
            if (res.status === 401) {
                localStorage.removeItem('token')
                alert('Sua sessão terminou. Entre novamente.')
                location.href = '../index.html'
                throw new Error('Sessão expirada')
            }
            if (!res.ok) {
                return res.json().then(dados => { throw new Error(dados.message || 'Não foi possível concluir a operação.') })
            }
            return res.json()
        })
        .then(dados => {
            console.log(dados)
            resposta.innerHTML = ''
            resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
        })
        .catch((err) => {
            console.error('Erro ao listar os dados', err)
            resposta.textContent = err.message === 'Failed to fetch' ? 'Servidor indisponível. Tente novamente em instantes.' : err.message
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codCliente || el.id}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.cpf}</td>`
        corpo += `<td>${el.telefone}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>telefone</th>
            </tr>
        </thead>
    `
}