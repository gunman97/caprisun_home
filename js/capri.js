var pr_goods = [
  "orange",
  "orange_mango",
  "apple",
  "safari",
  "fairy",
  "alaska"
];

function getData() {
  ajaxRequest(function (r) {
    if(r.result == "success") {
      setCharts(r.chart1);
      setHighChart(r.chart2);
    }
  }, function() {
    pr_goods.forEach(function (goodpr) {
      $('#' + goodpr + '_price').text("네트워크 연결이 필요합니다.");
    });
  });
}

function setHighChart(dataSet){
  pr_goods.forEach(function (goodpr) {
    setHighChartKind(dataSet, goodpr);
  });
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

function setChartKind(kind, data, labelData) {
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

function checkIn(item) {
  for (var i = 0; i < pr_goods.length; ++i) {
    if(pr_goods[i] == item) return true;
  }

  return false;
}

var comma_separator_number_step = 3;

function setCountPrice(target_id, price) {
  $(target_id)
  .prop('number', 10)
  .animateNumber(
    {
      number: price
    },
    2000
  );
}

function setCharts(data) {
  $("#gather_date").text(data.gather_date);
  var labelData = data.labels.reverse();

  data.price_tags.forEach(function (pr) {
      if (checkIn(pr.tagid) == false) return;
      //$("#" + pr.tagid + "_price").text(pr.price);
      $("#" + pr.tagid + "_price_ext").text(pr.text1);
      $("#" + pr.tagid + "_price_ext2").text(pr.text2);

      setCountPrice("#" + pr.tagid + "_price", pr.price);
      // $("#" + pr.tagid + "_price").animateNumber(
      //   {
      //     number: pr.price,
      //     numberStep: comma_separator_number_step
      //   }
      // );

      setChartKind(pr.tagid, data, labelData);
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

getData();
