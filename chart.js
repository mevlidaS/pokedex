function renderChart(i,pokemonBaseStats){
    const ctx = document.getElementById(`myChart${i}`);
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hp','Attack','Defense','Special-attack','Special-defense','Speed'],
        datasets: [{
          label: 'Pokemon Stats',
          data: pokemonBaseStats,
          borderWidth: 1,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
        },
      ],
    },
    options: {
      indexAxis: 'y',
  },
});
}

