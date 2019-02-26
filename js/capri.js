var pr_goods = [
  "orange",
  "orange_mango",
  "apple",
  "safari",
  "fairy",
  "alaska"
];

var pr_goods_name_address = {
  "orange" : ["오렌지맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000006610778"],
  "orange_mango": ["오렌지망고맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000006610896"],
  "apple": ["사과맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000007703166"],
  "safari": ["사파리", "http://www.ssg.com/item/itemView.ssg?itemId=0000007695749"],
  "fairy": ["페어리", "http://www.ssg.com/item/itemView.ssg?itemId=1000017758169"],
  "alaska": ["알라스카", "http://www.ssg.com/item/itemView.ssg?itemId=0000008117934"]
};

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
  ctx.canvas.width = 300;
  ctx.canvas.height = 300;
  var myChart = new Chart(ctx, {
    type: 'bubble',
      data: {
        labels: dayAr,
        datasets: dataSet[kind]
      },
      options: {
        aspectRatio: 1,
  			legend: false,
        responsive: false,
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
          },
        layout: {
          padding: {
              left: 20,
              right: 30,
              top: 20,
              bottom: 20
          }
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
  ctx.canvas.width = 300;
  ctx.canvas.height = 300;
  var myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels: labelData,
        datasets: chartDataSet
      },
      options: {
        aspectRatio: 1,
  			legend: false,
        responsive: false,
        tooltips: {
        callbacks: {
                  label: function(tooltipItem, data) {
                      var d = data.datasets[tooltipItem.datasetIndex].label;
                      return d + " 가격 " + tooltipItem.yLabel + "원";
                  }
              }
          },
        layout: {
            padding: {
                left: 20,
                right: 30,
                top: 20,
                bottom: 20
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


var index=1;
function addChart(pr) {

  var item = '<div class="item item' + index + ' panel panel-default"><div class="panel-heading">'
      item += '<h3><font color=#333>' + pr_goods_name_address[pr.tagid][0] + '</font></h3>'
      item += '<a href="' + pr_goods_name_address[pr.tagid][1] + '" target=_new><h2>현재가'
      item += '<span id="' + pr.tagid + '_price">0</span>원</h2></a>'
      item += '<h5 class="recom">' + pr.text1 + '</h5>'
      item += '<h5 class="recom">' + pr.text2 +'</h5></div>'
      item += '<canvas id="morris-area-chart-' + pr.tagid + '" class="aligncenter"></canvas>'
      item += '<div class="panel-heading">'
      item += '<h4>' + pr_goods_name_address[pr.tagid][0] + '의 요일별 가격</h4></div>'
      item += '<canvas id="highchart-weekly-' + pr.tagid + '" class="aligncenter"></canvas>'
      item += '<div class="alignright"><img src="./imgs/chev.png" width="30px"><br><br></div></div>';
  $('#item_body').append(item);
  index++;
}



function setCharts(data) {
  $("#gather_date").text(data.gather_date);
  var labelData = data.labels.reverse();

  data.price_tags.forEach(function (pr) {
      if (checkIn(pr.tagid) == false) return;

      addChart(pr);

      if (pr.tagid == "orange")
        setCountPrice("#" + pr.tagid + "_price", pr.price);
      else
        $("#" + pr.tagid + "_price").text(pr.price);

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

var slider = document.querySelector('.items');
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
