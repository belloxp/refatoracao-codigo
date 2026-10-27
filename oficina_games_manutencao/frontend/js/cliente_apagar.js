const token = localStorage.getItem('token')

// Proteção da rota privada: se não houver token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

const btn_apagar = document.getElementById('btn_apagar')
const resposta = document.getElementById('resposta')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    if (!id) {
        resposta.innerHTML = '<p>Digite o código do cliente que será removido.</p>'
        return
    }

    if (!confirm('Essa ação não pode ser desfeita. Deseja remover o cliente?')) {
        return
    }

    fetch(`http://localhost:3000/cliente/${id}`, {
        method: 'DELETE',
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
            resposta.innerHTML = `<p>${dados.message}</p>`
            document.querySelector('form').reset()
        })
        .catch(err => {
            console.error('Erro ao apagar ciclista:', err)
            resposta.textContent = err.message === 'Failed to fetch' ? 'Servidor indisponível. Tente novamente em instantes.' : err.message
        })
})
