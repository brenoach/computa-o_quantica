"""
Simulador de circuito quântico simples (estado de Bell) usando apenas NumPy.

Trabalho de Arquitetura e Organização de Computadores - Grupo 4 (tema: Computação Quântica).

Circuito:
    q0: ──H──●──M
             │
    q1: ─────X──M

Convenção: o estado de 2 qubits é um vetor de 4 amplitudes, na ordem
|00>, |01>, |10>, |11>, onde o bit mais à esquerda é o qubit q0.
"""
import numpy as np

# ---------- Portas quânticas (matrizes unitárias) ----------
I = np.array([[1, 0], [0, 1]], dtype=complex)
X = np.array([[0, 1], [1, 0]], dtype=complex)
H = (1 / np.sqrt(2)) * np.array([[1, 1], [1, -1]], dtype=complex)
CNOT = np.array([[1, 0, 0, 0],
                 [0, 1, 0, 0],
                 [0, 0, 0, 1],
                 [0, 0, 1, 0]], dtype=complex)  # controle = q0, alvo = q1


def estado_inicial():
    """Dois qubits em |00>."""
    v = np.zeros(4, dtype=complex)
    v[0] = 1
    return v


def mostrar(v, titulo):
    print(titulo)
    for i, amp in enumerate(v):
        rotulo = format(i, "02b")
        prob = abs(amp) ** 2
        print(f"  |{rotulo}>  amplitude = {amp.real:+.4f}{amp.imag:+.4f}j   P = {prob:.4f}")
    print()


def medir(v, shots, rng):
    """Medição na base computacional: sorteia resultados com P = |amplitude|^2."""
    probs = np.abs(v) ** 2
    resultados = rng.choice(len(v), size=shots, p=probs)
    contagem = {format(i, "02b"): int(np.sum(resultados == i)) for i in range(len(v))}
    return contagem


def main():
    rng = np.random.default_rng(42)  # semente fixa para reprodutibilidade
    shots = 1024

    psi = estado_inicial()
    mostrar(psi, "Passo 0 - Estado inicial |00>:")

    # Passo 1: Hadamard no qubit 0  ->  (H ⊗ I)
    psi = np.kron(H, I) @ psi
    mostrar(psi, "Passo 1 - Após H em q0 (superposição):")

    # Passo 2: CNOT (controle q0, alvo q1)
    psi = CNOT @ psi
    mostrar(psi, "Passo 2 - Após CNOT (emaranhamento, estado de Bell):")

    # Passo 3: Medição
    contagem = medir(psi, shots, rng)
    print(f"Passo 3 - Medição ({shots} execuções):")
    for estado, n in contagem.items():
        barra = "#" * int(50 * n / shots)
        print(f"  |{estado}>  {n:5d}  ({100*n/shots:5.1f}%)  {barra}")


if __name__ == "__main__":
    main()
