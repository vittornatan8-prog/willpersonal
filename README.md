# EliteFit — Personal Trainer Website

Site profissional completo para Personal Trainer.

## Estrutura de Arquivos

```
personal-trainer/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── images/
    │   ├── hero-personal.jpg   ← Foto principal do hero (recomendado: 960x1080px)
    │   ├── personal.jpg        ← Foto da seção "Sobre" (recomendado: 840x1040px)
    │   ├── resultado1.jpg      ← Antes e depois 1 (recomendado: 600x800px)
    │   ├── resultado2.jpg      ← Antes e depois 2
    │   ├── resultado3.jpg      ← Antes e depois 3
    │   ├── resultado4.jpg      ← Antes e depois 4
    │   ├── blog1.jpg           ← Imagem do artigo 1 (recomendado: 800x450px)
    │   ├── blog2.jpg           ← Imagem do artigo 2
    │   └── blog3.jpg           ← Imagem do artigo 3
    └── icons/
        └── (ícones adicionais, se necessário)
```

## Personalizações Obrigatórias

### 1. Número de WhatsApp (script.js, linha 9)
```js
const WHATSAPP_NUMBER = '5511999999999'; // Coloque seu número aqui
```

### 2. Informações pessoais (index.html)
- Nome do personal trainer
- Número de CREF
- Endereço
- Instagram
- E-mail

### 3. Adicionar as imagens na pasta `/assets/images/`
Sem imagens, o site exibe placeholders com fundo escuro e textos indicativos. Funciona normalmente.

### 4. Mapa (seção Contato)
Substitua o bloco `.map-placeholder` pelo iframe do Google Maps:
```html
<iframe 
  src="https://www.google.com/maps/embed?..." 
  width="100%" 
  height="280" 
  style="border:0; border-radius:20px;" 
  allowfullscreen="" 
  loading="lazy">
</iframe>
```

## Funcionalidades Incluídas

- ✅ Header fixo com efeito glassmorphism ao rolar
- ✅ Menu mobile com hamburger animado
- ✅ Hero section com contadores animados
- ✅ Seção "Sobre" com cards de certificações
- ✅ 6 cards de serviços com hover animado
- ✅ Galeria de resultados com modal de lightbox
- ✅ Carrossel automático de depoimentos (com swipe touch)
- ✅ 3 planos de preços com destaque Premium
- ✅ Formulário de agendamento integrado ao WhatsApp
- ✅ Blog fitness com cards de artigos
- ✅ Seção de contato com links diretos
- ✅ Footer premium com redes sociais
- ✅ Botão "Voltar ao topo"
- ✅ Animações de entrada ao rolar (Intersection Observer)
- ✅ Navegação ativa ao rolar (highlight no menu)
- ✅ 100% responsivo (mobile, tablet, desktop)
- ✅ SEO: meta description, Open Graph, código semântico
- ✅ Acessibilidade: aria-labels, reduced motion, foco visível

## Paleta de Cores

| Nome      | Hex       |
|-----------|-----------|
| Preto     | `#0D0D0D` |
| Grafite   | `#1A1A1A` |
| Verde Neon| `#00FF88` |
| Branco    | `#FFFFFF` |
| Cinza     | `#E5E5E5` |

## Fontes (Google Fonts)
- **Bebas Neue** — Display / Títulos
- **Inter** — Corpo de texto
- **Space Grotesk** — UI / Labels / Botões

## Como Abrir Localmente
Abra o arquivo `index.html` diretamente no navegador, ou use um servidor local:
```bash
# Com Python
python -m http.server 8080

# Com Node.js (npx)
npx serve .
```

---
Desenvolvido com ✦ para alta performance e conversão.
