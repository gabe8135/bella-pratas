# Bella Pratas

Vitrine visual de joalheria, preservada como projeto de portfólio. O contato para compra é feito pelo WhatsApp, sem autenticação ou banco de dados.

## Executar

```sh
npm install
npm run dev
```

## Verificar

```sh
npm run lint
npm run build
```

As fotos e a logo são servidas de `public/`. O catálogo é definido em `src/lib/products.js`; edite esse arquivo para incluir peças, descrições e caminhos de imagem. Não são necessárias variáveis de ambiente. As fontes também são locais, em `public/fonts/`, sem download durante a compilação.

Busca, filtros, favoritos da sessão e detalhes das peças funcionam localmente. Os antigos endereços administrativos redirecionam à coleção. `/catalogo` também abre a vitrine. O modal de cada peça inclui um link para o WhatsApp 5513997033980 com mensagem personalizada. Não há preços ou checkout integrado.

