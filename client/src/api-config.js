// Configuração da API atualizadas 
// Este arquivo é carregado dinamicamente e não é minificado junto com o bundle principal

window.API_CONFIG = {
  BASE_URL: 'https://hubb-one-assist-back-hubb-one.replit.app',
  TIMEOUT: 15000
};

console.log("[API CONFIG] Arquivo de configuração carregado com sucesso");
console.log("[API CONFIG] BASE_URL:", window.API_CONFIG.BASE_URL);

// Corrigir problema de CORS desabilitando credentials nos requests
// Tenta corrigir XMLHttpRequest para não enviar credentials
if (typeof XMLHttpRequest !== 'undefined') {
  const originalXHROpen = XMLHttpRequest.prototype.open;
  
  XMLHttpRequest.prototype.open = function() {
    const result = originalXHROpen.apply(this, arguments);
    this.withCredentials = false;
    return result;
  };
};

// Isso irá redirecionar todas as chamadas da URL antiga para a nova
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (url && typeof url === 'string' && url.includes('worf.replit.dev')) {
    const newUrl = url.replace(
      /https:\/\/.*worf\.replit\.dev/,
      'https://hubb-one-assist-back-hubb-one.replit.app'
    );
    console.log('[API CONFIG] Redirecionando URL:', url, '→', newUrl);
    return originalFetch(newUrl, options);
  }
  return originalFetch(url, options);
};

// Interceptar XMLHttpRequest para trocar a URL
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
  if (arguments[1] && typeof arguments[1] === 'string' && arguments[1].includes('worf.replit.dev')) {
    arguments[1] = arguments[1].replace(
      /https:\/\/.*worf\.replit\.dev/,
      'https://hubb-one-assist-back-hubb-one.replit.app'
    );
    console.log('[API CONFIG] Redirecionando XHR:', arguments[1]);
  }
  return originalOpen.apply(this, arguments);
};