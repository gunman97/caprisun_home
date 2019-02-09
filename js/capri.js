function getData() {
  ajaxRequest(function (r) {
    if(r.result == "success") {
      drawChart(r);
      drawHighChart(r);
    }
  }, function() {
    $('#orange_price').text("네트워크 연결이 필요합니다.");
    $('#orangemango_price').text("네트워크 연결이 필요합니다.");
    $('#apple_price').text("네트워크 연결이 필요합니다.");
    $('#safari_price').text("네트워크 연결이 필요합니다.");
    $('#alaska_price').text("네트워크 연결이 필요합니다.");
    $('#fairy_price').text("네트워크 연결이 필요합니다.");
    $('#weekly_price').text("네트워크 연결이 필요합니다.");
  });
}


var noonDataForHigh = Array();
var afternoonForHigh = Array();

function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null : ['일', '월', '화', '수', '목', '금', '토'][dayOfWeek];
}

function fillDataForHigh(i, day, pr) {
  noonDataForHigh[i] = [day, 0];
  afternoonForHigh[i] = [day, 0];

  if ("orange" in pr.data[0]) {
    noonDataForHigh[i][1] = pr.data[0].orange;
  }
  if ("orange" in pr.data[1]) {
    afternoonForHigh[i][1] = pr.data[1].orange;
  }
}

var iHighIndex = 0;

function drawHighChart(r) {
  var data = r.data;
  if (data == null) return;

  data.forEach(function (pr) {
    var dateString = "" + pr.id;
    var xString = dateString.substring(0,4) + "-" + dateString.substring(4,6) + "-" + dateString.substring(6,8);
    var day = getDayOfWeek(xString);
    fillDataForHigh(iHighIndex, day, pr);
    iHighIndex++;
  });

  // data.sort(function(a, b){return b.id - a.id});

  Highcharts.chart('highchart-area-weekly', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: '-'
            },
            xAxis: {
                type: 'category',
                categories: ["일", "월", "화", "수", "목", "금", "토"]
            },
            yAxis: {
                title: {
                    text: '가격'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 1,
                y: 120,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.y}원'
                    }
                }
            },
            series: [{
                name: '오전',
                color: 'rgba(223, 83, 83, .5)',
                data: noonDataForHigh

            }, {
                name: '오후',
                color: 'rgba(119, 152, 191, .5)',
                data: afternoonForHigh
    }]
});
}

var orangeData;
var orangeMangoData;
var appleData;
var safariData;
var fairyData;
var alaskaData;

function fillData(i, pr, xString) {
  orangeData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("orange" in pr.data[0]) {
    orangeData[i].y = pr.data[0].orange;
  }
  if ("orange" in pr.data[1]) {
    orangeData[i].z = pr.data[1].orange;
  }

  orangeMangoData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("orange_mango" in pr.data[0]) {
    orangeMangoData[i].y = pr.data[0].orange_mango;
  }
  if ("orange_mango" in pr.data[1]) {
    orangeMangoData[i].z = pr.data[1].orange_mango;
  }

  appleData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("apple" in pr.data[0]) {
    appleData[i].y = pr.data[0].apple;
  }
  if ("apple" in pr.data[1]) {
    appleData[i].z = pr.data[1].apple;
  }

  safariData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("safari" in pr.data[0]) {
    safariData[i].y = pr.data[0].safari;
  }
  if ("safari" in pr.data[1]) {
    safariData[i].z = pr.data[1].safari;
  }

  fairyData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("fairy" in pr.data[0]) {
    fairyData[i].y = pr.data[0].fairy;
  }
  if ("fairy" in pr.data[1]) {
    fairyData[i].z = pr.data[1].fairy;
  }

  alaskaData[i] = {'id': pr.id, 'y': 0, 'z': 0, 'x' : xString};
  if ("alaska" in pr.data[0]) {
    alaskaData[i].y = pr.data[0].alaska;
  }
  if ("alaska" in pr.data[1]) {
    alaskaData[i].z = pr.data[1].alaska;
  }
}

function setPrice() {
  var length = 0;
  $("#orange_price").text(orangeData[length].z);
  if ($("#orange_price").text == "0")
    $("#orange_price").text(orangeData[length].y);

  $("#orangemango_price").text(orangeMangoData[length].z);
  if ($("#orangemango_price").text == "0")
    $("#orangemango_price").text(orangeMangoData[length].y);

  $("#apple_price").text(appleData[length].z);
  if ($("#apple_price").text == "0")
    $("#apple_price").text(appleData[length].y);

  $("#safari_price").text(safariData[length].z);
  if ($("#safari_price").text == "0")
    $("#safari_price").text(safariData[length].y);

  $("#fairy_price").text(fairyData[length].z);
  if ($("#fairy_price").text == "0")
    $("#fairy_price").text(fairyData[length].y);

  $("#alaska_price").text(alaskaData[length].z);
  if ($("#alaska_price").text == "0")
    $("#alaska_price").text(alaskaData[length].y);
}

function drawChart(r) {
  orangeData = Array();
  orangeMangoData = Array();
  appleData = Array();
  safariData = Array();
  fairyData = Array();
  alaskaData = Array();

  var data = r.data;
  if (data == null) return;

  data.sort(function(a, b){return b.id - a.id});
  data = data.slice(0, 7);

  var i = 0;
  var curLatest = 0;
  var curLatestIdx = -1;
  data.forEach(function (pr) {
    if (pr.id >= curLatest) {
      curLatestIdx = i;
      curLatest = pr.id;
    }

    var dateString = "" + pr.id;
    var xString = dateString.substring(0,4) + "-" + dateString.substring(4,6) + "-" + dateString.substring(6,8);
    fillData(i, pr, xString);
    i++;
  });

  var hoverFunction = function (index, options, content, row) {
        return "날짜:" + row.x + "<br>" + "오전:" + row.y + "원 / 오후:" + row.z + "원";
  };

  orangeData.sort(function(a, b){return b.id - a.id});
  orangeMangoData.sort(function(a, b){return b.id - a.id});
  appleData.sort(function(a, b){return b.id - a.id});
  safariData.sort(function(a, b){return b.id - a.id});
  fairyData.sort(function(a, b){return b.id - a.id});
  alaskaData.sort(function(a, b){return b.id - a.id});

  if ('dtime' in data[curLatestIdx].data[0]) {
    $("#gather_date").text(data[curLatestIdx].data[0].dtime);
  }

  if ('dtime' in data[curLatestIdx].data[1]) {
    $("#gather_date").text(data[curLatestIdx].data[1].dtime);
  }

  setPrice();


  Morris.Area({
    element: 'morris-area-chart-orange',
    behaveLikeLine: true,
    hoverCallback: hoverFunction,
    data: orangeData,
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
    data: orangeMangoData,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-apple',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: appleData,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-alaska',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: alaskaData,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-safari',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: safariData,
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['오전', '오후']
  });

  Morris.Area({
    element: 'morris-area-chart-fairy',
    behaveLikeLine: true,
    smooth: false,
    hoverCallback: hoverFunction,
    data: fairyData,
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
