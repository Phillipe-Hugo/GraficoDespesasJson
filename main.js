// Carregando os dados do arquivo JSON
d3.json("data.json").then(data => {
    // Tamanho do contêiner do gráfico
    const width = 500;
    const height = 300;

    const translationMap = {
        "mon": "seg",
        "tue": "ter",
        "wed": "qua",
        "thu": "qui",
        "fri": "sex",
        "sat": "sáb",
        "sun": "dom"
    };
     data.forEach(entry => {
        entry.translatedDay = translationMap[entry.day.toLowerCase()];
    });
  
  
    // Escala para os eixos
    const xScale = d3.scaleBand().domain(data.map(d => d.day)).range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.amount)]).range([height, 0]);
  
    // Criando o contêiner SVG
    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Adicionando as barras ao gráfico
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", d => `bar ${isToday(d.day) ? 'current' : ''}`)
      .attr("x", d => xScale(d.day))
      .attr("y", d => yScale(d.amount))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.amount))
      .on("mouseover", function(d) {
        tooltip.style("display", "block")
          .html(`<strong>${d.translatedDay}</strong>: ${d.amount}`);
      })
      .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 20) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
      });
  
    // Adicionando rótulos às barras
    svg.selectAll(".bar-label")
      .data(data)
      .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.day) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.amount) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.amount.toFixed(2));
  
    // Adicionando tooltip
    const tooltip = d3.select("#chart-container")
      .append("div")
      .attr("class", "tooltip");
  });
  
  // Função para verificar se a data é hoje
  function isToday(day) {
    const today = new Date().toLocaleString('en-pt', { weekday: 'short' }).toLowerCase();
    return day === today;
  
}
  