function getData() {
  ajaxRequest(function (r) {
    if(r.result == "success") {
      setCharts(r.chart1);
      setHighChart(r.chart2);
    }
  }, function() {
    $('#orange_price').text("네트워크 연결이 필요합니다.");
    $('#orangemango_price').text("네트워크 연결이 필요합니다.");
    $('#apple_price').text("네트워크 연결이 필요합니다.");
    $('#safari_price').text("네트워크 연결이 필요합니다.");
    $('#alaska_price').text("네트워크 연결이 필요합니다.");
    $('#fairy_price').text("네트워크 연결이 필요합니다.");
    $('#capri_price').text("네트워크 연결이 필요합니다.");
    $('#weekly_price').text("네트워크 연결이 필요합니다.");
  });
}

function setHighChart(dataSet){

  setHighChartKind(dataSet, "orange");
  setHighChartKind(dataSet, "orange_mango");
  setHighChartKind(dataSet, "apple");
  setHighChartKind(dataSet, "safari");
  setHighChartKind(dataSet, "fairy");
  setHighChartKind(dataSet, "alaska");
}

function setHighChartKind(dataSet, kind) {
  var dayAr = ["일", "월", "화", "수", "목", "금", "토"];
  var ctx = document.getElementById("highchart-weekly-" + kind).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bubble',
      data: {
        labels: dayAr,
        datasets: dataSet[kind]
      },
      options: {
        aspectRatio: 1,
  			legend: false,
        responsive: true,
        tooltips: {
        callbacks: {
                  label: function(tooltipItem, data) {
                      var d = data.datasets[tooltipItem.datasetIndex].data[0];
                      var t = d.c;

                      if (data.datasets[tooltipItem.datasetIndex].type == 'line')
                        return dayAr[tooltipItem.xLabel] + "요일의 평균가격: " + tooltipItem.yLabel + "원";

                      return dayAr[d.x] + "요일에 " + tooltipItem.yLabel + "원이었던 적이 " + t + "번 존재";
                  }
              }
          },
        scales: {
            xAxes: [{
              ticks: {
                userCallback: function(label, index, labels) {
                  return dayAr[label];
                }
              }
            }]
          }
      }
  });
}

function setChartKind(kind, data) {
  var dta = data[kind];
  var chartDataSet = Array();
  var chartDayData = Array();
  var chartNightData = Array();

  dta.forEach(function (pr) {
      chartDayData.push(pr.d);
      chartNightData.push(pr.n);
  });

  chartDayData.reverse();
  chartNightData.reverse();
  chartDataSet[0] =
        {
          data: chartDayData,
          label: "오전",
          borderColor: "#6666cd",
          fill: true,
          steppedLine:true
        };

  chartDataSet[1] =
        {
          data: chartNightData,
          label: "오후",
          borderColor: "#3e95cd",
          fill: true,
          steppedLine:true
        };
  var labelData = data.labels.reverse();
  var ctx = document.getElementById("morris-area-chart-" + kind).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels: labelData,
        datasets: chartDataSet
      },
      options: {
        aspectRatio: 1,
  			legend: false,
        responsive: true,
        tooltips: {
        callbacks: {
                  label: function(tooltipItem, data) {
                      var d = data.datasets[tooltipItem.datasetIndex].label;
                      return d + " 가격 " + tooltipItem.yLabel + "원";
                  }
              }
          }
        }
  });
}

function setCharts(data) {
  $("#gather_date").text(data.gather_date);
  data.price_tags.forEach(function (pr) {
    $("#" + pr.tagid + "_price").text(pr.price);
    $("#" + pr.tagid + "_price_ext").text(pr.text1);
    $("#" + pr.tagid + "_price_ext2").text(pr.text2);

    setChartKind(pr.tagid, data);
  });
}

function ajaxRequest(callback, errorcallback) {
    $.ajax({url : "https://ptbu18cv95.execute-api.ap-northeast-2.amazonaws.com/prod/caprisun/get",
           dataType : "json",
           crossDomain: true,
           cache : false,
           type : "GET",
           async: false,
           success : function(r) {
             console.log(JSON.stringify(r));
             callback(r);
           },
           error:function(request,status,error){
               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
               errorcallback();
           }
    });
}

const slider = document.querySelector('.items');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
  console.log(walk);
});


getData();
