# Computação Quântica – Demonstração Interativa & Simulação do Circuito de Bell

Trabalho de **Arquitetura e Organização de Computadores**  
**Faculdade de Tecnologia (Fatec) – Tecnologia em Análise e Desenvolvimento de Sistemas (ADS)**  
**Docente:** Prof. Felipe Cannarozzo Lourenço  
**Equipe (Grupo 4):**
- Breno da Silva Neto Almeida Cunha
- Guilherme Oliveira Fernandes da Silva
- Matheus Felipe Perizzolo Colla
- Pietro Wagenska Pereira

---

## 🌐 Site Interativo & Demonstrador Web (`index.html`)

Um portal web interativo de alto impacto visual, com animações e simulações em tempo real para demonstração e apresentação acadêmica.

### Principais Módulos do Site:
1. **Fundo Quântico Animado:** Simulação de pacotes de onda e filamentos de entrelaçamento quântico dinâmicos em Canvas.
2. **Bit Clássico × Qubit (Superposição):** Animação 3D da *Moeda Quântica* girando em superposição linear $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ e o colapso estocástico sob a Regra de Born ao medir.
3. **Esfera de Bloch 3D Interativa:** Renderizador 3D com rotação livre por mouse/touch, projeção de eixos ($X, Y, Z$), cálculo em tempo real de $\theta, \phi$, probabilidades $P(|0\rangle), P(|1\rangle)$ e aplicação de portas ($X, Z, H$).
4. **Emaranhamento Quântico:** Demonstração visual de 2 nós quânticos correlacionados; ao medir um deles, o outro colapsa instantaneamente para o mesmo estado.
5. **Portas Lógicas Quânticas:** Catálogo das portas unitárias com visualizador de matrizes ($H, X, Z, CNOT$).
6. **Simulador do Circuito de Bell (Núcleo do Trabalho):**
   - Diagrama esquemático com trilhas e pulsos quânticos.
   - Navegação passo a passo (Passo 0: $|00\rangle$, Passo 1: Hadamard em $q_0$, Passo 2: CNOT gerando o Estado de Bell $|\Phi^+\rangle$, Passo 3: Medição).
   - Simulação estocástica de medição (*Shots*: 100 a 8192 execuções) com histograma experimental em tempo real e visualizador do código original do grupo em Python.
7. **Laboratório Quântico (Sandbox Livre):** Construtor de circuitos de 2 qubits com cálculo matricial em tempo real das 4 amplitudes e probabilidades.
8. **Arquitetura de Computadores (Clássico × Quântico):** Tabela comparativa e calculadora da explosão exponencial ($2^n$ estados vs. RAM clássica necessária para simulação).
9. **Hardware, Criogenia & Ruído (NISQ):** Funcionamento a 15 mK, códigos de superfície para correção de erros e tecnologias físicas (transmons supercondutores, íons aprisionados, fotônica).
10. **Algoritmos e Impacto:** Algoritmo de Shor (quebra de RSA), Algoritmo de Grover ($\mathcal{O}(\sqrt{N})$) e padrões de criptografia pós-quântica do NIST.

### Como abrir o site:
- **Modo Direto:** Basta dar um duplo clique no arquivo [`index.html`](file:///g:/Meu%20Drive/ADS/Arquitetura%20de%20Computadores/trabalho_computa%C3%A7%C3%A3o_quantica/index.html) para abrir em qualquer navegador (Google Chrome, Edge, Firefox, etc.). Não necessita de instalação de nenhum pacote!
- **Modo Servidor Local (Opcional):**
  ```bash
  npx serve .
  # ou
  python -m http.server 3000
  ```
  Acesse `http://localhost:3000`.

---

## 🐍 Simulação em Python (NumPy)

O arquivo [`simulador_quantico.py`](file:///g:/Meu%20Drive/ADS/Arquitetura%20de%20Computadores/trabalho_computa%C3%A7%C3%A3o_quantica/simulador_quantico.py) simula o mesmo circuito quântico de 2 qubits usando apenas matrizes unitárias com NumPy:

```bash
pip install numpy
python simulador_quantico.py
```
