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

  // data.sort(function(a, b){return b.id - a.id});
  var dayAr = ["일", "월", "화", "수", "목", "금", "토"];
  var ctx = document.getElementById("highchart-area-weekly").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bubble',
      data: {
        labels: dayAr,
        datasets: dataSet
      },
      options: {
        aspectRatio: 1,
  			legend: false,
        responsive: true,
        tooltips: {
        callbacks: {
                  label: function(tooltipItem, data) {
                      var d = data.datasets[tooltipItem.datasetIndex].data[0];
                      var t = d.r / 4;

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

function setCharts(data) {
  $("#gather_date").text(data.gather_date);

  var hoverFunction = function (index, options, content, row) {
        return "날짜:" + row.x + "<br>" + "오전:" + row.y + "원 / 오후:" + row.z + "원";
  };

  data.price_tags.forEach(function (pr) {
    $("#" + pr.tagid + "_price").text(pr.price);
    $("#" + pr.tagid + "_price_ext").text(pr.text1);
    $("#" + pr.tagid + "_price_ext2").text(pr.text2);
  });

  Morris.Area({
    element: 'morris-area-chart-orange',
    behaveLikeLine: true,
    hoverCallback: hoverFunction,
    data: data.orange,
    smooth: false,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-orange_mango',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: data.orange_mango,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-apple',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: data.apple,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-alaska',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: data.alaska,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-safari',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: data.safari,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-fairy',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: data.fairy,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
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
