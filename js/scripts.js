/* 
    Vamos consumir os dados da API Mercado BitCoin
	https://www.mercadobitcoin.net/api/BTC/trades
*/

// Chamando a API para obter os dados
async function carregarDados() {
    // Escondendo a div de erro, caso ela esteja visível
    const divErro = document.getElementById('div-erro');
    divErro.style.display = 'none';

    // Chamando a API para obter os dados
    await fetch('https://www.mercadobitcoin.net/api/BTC/trades')   // Endpoint da API
        .then(response => response.json())                    // Obtendo a resposta da API
        .then(dados => prepararDados(dados))                  // Obtendo os dados
        .catch(e => exibirErro(e.message));                   // Obtendo o erro (se der erro)
}

// Função para mostrar mensagens de erro ao usuário
function exibirErro(mensagem) {
    // Mostrar a div de erro e exibir a mensagem
    const divErro = document.getElementById('div-erro');
    divErro.style.display = 'block';
    divErro.innerHTML = '<b>Erro ao acessar a API</b> <br />' + mensagem;
}

// Criando variáveis globais para conter os dados que serão usados nos gráficos
var dadosGraficoLinha = [
                          ['Data', 'Preço'],
                          ['', 0]                          
                        ];

var dadosGraficoPizza = [
                          ['Operação', 'Total'],
                          ['', 0]
                        ];


// Função para tratar os dados para exibição nos gráficos
function prepararDados(dados) {
    if (dados != null) {
      // Iniciando os cabeçalhos dos dados
      dadosGraficoLinha = [ ['Data', 'Preço'] ];
      dadosGraficoPizza = [ ['Operação', 'Total'] ];

      //Criando variáveis para acumular quantidades de compras e vendas
      let compras = 0;
      let vendas = 0;

      for (let i=0; i<dados.length; i++) 
        // Se for dados de vendas (sell)
        if (dados[i].type == 'sell') {
          let auxVetor = [ 
                            new Date( dados[i].date * 1000 ), 
                            dados[i].price         
                         ];          
          dadosGraficoLinha.push(auxVetor);
          vendas = vendas + dados[i].amount;
        }
        else { // Se for dados de compra (buy)
          compras = compras + dados[i].amount;
        }

      console.table(dadosGraficoLinha);
      // Redesenhar o gráfico de linha com os novos dados
      drawLineChart();

      // Inserindo os valores totais nos dados do gráfico de pizza
      dadosGraficoPizza.push(['Vendas', vendas]);
      dadosGraficoPizza.push(['Compras', compras]);
      // Redesenhar o gráfico de pizza com os novos dados
      drawPieChart();
    }
}





/******************************* Desenhando os gráficos *********************************/

//----------------- Gráfico de linha (evolução dos preços de venda) ----------------------
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawLineChart);

function drawLineChart() {
        var data = google.visualization.arrayToDataTable(dadosGraficoLinha);

        var options = {
          title: 'Variação de preço (vendas)',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
}


//----------------- Gráfico de pizza (volumes de compras e vendas) ----------------------
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawPieChart);

function drawPieChart() {

        var data = google.visualization.arrayToDataTable(dadosGraficoPizza);

        var options = {
          title: 'Volumes de negociação',
          is3D: true,
          legend: {position: 'bottom'}
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
}