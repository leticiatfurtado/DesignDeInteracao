  let element = document.querySelector("#cartao");
  
  function alterarCorFundo() {
    let corFundo = document.getElementById("corFundo").value;
    element.style.backgroundColor = corFundo;
  }
  
  function alterarCorBorda() {
    let corBorda = document.getElementById("corBorda").value;
    element.style.borderColor = corBorda;
  }
  
  function alterarCorTexto() {
    let corTexto = document.getElementById("corTexto").value;
    element.style.color = corTexto;
  }
  
  function alterarImagemFundo() {
    let imagemFundo = document.getElementById("imagemFundo").value;
    element.style.backgroundImage = `url(${imagemFundo})`;
  }
  
  document.getElementById("conteudoCartao").addEventListener("input", function() {
    let conteudo = this.value.replace(/\n/g, "<br>"); // Substitui quebras de linha por <br>
    element.innerHTML = conteudo;
  });