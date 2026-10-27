const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        resposta.textContent = 'O código do cliente precisa ser um número maior que zero.'
        return
    }

    const valores = {}
    for (const campo of ['nome', 'email', 'senha', 'cpf', 'telefone']) {
        const valor = document.getElementById(campo).value
        if (valor.trim()) valores[campo] = campo === 'senha' ? valor : valor.trim()
    }

    if (!Object.keys(valores).length) {
        resposta.textContent = 'Nenhum campo foi preenchido. Altere ao menos uma informação.'
        return
    }

    try {
        const res = await fetch(`http://localhost:3000/cliente/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(valores)
        })
        const dados = await res.json()

        if (res.status === 401) {
            localStorage.removeItem('token')
            alert(dados.message || 'Sua sessão terminou. Entre novamente.')
            location.href = '../index.html'
            return
        }

        resposta.textContent = dados.message || 'Falha ao alterar os dados do cliente.'
        if (res.ok) form.reset()
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        resposta.textContent = 'Servidor indisponível. Tente novamente em instantes.'
    }
})
