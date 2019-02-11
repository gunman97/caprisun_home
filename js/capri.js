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
    $('#capri_price').text("네트워크 연결이 필요합니다.");
    $('#weekly_price').text("네트워크 연결이 필요합니다.");
  });
}


var dataForHigh = Array();

function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();
  var retDay = isNaN(dayOfWeek) ? null : ['일', '월', '화', '수', '목', '금', '토'][dayOfWeek];
  return [retDay, dayOfWeek];
}

function fillDataForHigh(day, pr) {
  var price = 0;
  var found = false;
  if ("orange" in pr.data[0]) {
    price = pr.data[0].orange;

    for(var i=dataForHigh.length - 1;i >= 0;i--) {
      var d = dataForHigh[i];

      if (d[0] == day[1] && d[1] == price && (price > 0)) {
        d[2] += 1;
        found = true;
        break;
      }
    }

    if (found == false) {
      var d = [day[1], price, 0];
      dataForHigh.push(d);
    }
  }

  if ("orange" in pr.data[1]) {
    price = pr.data[1].orange;

    found = false;

    for(var i=dataForHigh.length - 1;i >= 0;i--) {
      var d = dataForHigh[i];

      if (d[0] == day[1] && d[1] == price && (price > 0)) {
        d[2] += 1;
        found = true;
        break;
      }
    }

    if (found == false) {
      var d = [day[1], price, 0];
      dataForHigh.push(d);
    }
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
    fillDataForHigh(day, pr);
  });

  var dataSet = Array();
  dataForHigh.forEach(function (pr) {
    var d = {
      label: pr[0],
      data: [
        {
          x: pr[0],
          y: pr[1],
          r: pr[2] * 4
        }
      ],
      backgroundColor:"#99aaff",
      hoverBackgroundColor: "#ff6384"
    };

    dataSet.push(d);
  });

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
                      return tooltipItem.yLabel + "원";
                  }
              }
          },
        scales: {
            xAxes: [{
              ticks: {
                callback: function(value, index, values) {
                  return dayAr[index];
                }
              }
            }]
          }
      }
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

function setPriceTag(tagid, price, beforeprice, oldprice) {
  var diff = 0;
  var olddiff = 0;
  var curText = ""
  var curText2 = ""

  diff = price - beforeprice;
  olddiff = price - oldprice[0];
  if (diff < 0) {
    curText = "어제보다 " + Math.abs(diff) + "원 싸네요.";
  }
  else if (diff > 0){
    curText = "어제보다 " + Math.abs(diff) + "원 비싸네요.";
  }
  else if (diff == 0) {
    curText = "어제와 가격차이가 없습니다.";
  }

  if (olddiff < 0) {
    curText2 = " 하지만 " + oldprice[1] + "일전 " + oldprice[2] + "보다는 "+ Math.abs(olddiff) + "원이 쌉니다";
  }
  else if (olddiff > 0){
    curText2 = " 하지만 " + oldprice[1] + "일전 " + oldprice[2] + "보다는 "+ Math.abs(olddiff) + "원이 비쌉니다";
  }

  $(tagid + "_ext").text(curText);
  if (curText2 != "")
    $(tagid + "_ext2").text(curText2);

  $(tagid).text(price);
}

function getVeryOldPrice(price, data) {
  var veryOldprice = 0;
  var index = 3;
  var whenCr = "오후";
  for(;index < 7; index++) {
    if (data[index].z != 0 && data[index].z != price) {
      veryOldprice = data[index].z;
      break;
    }

    if (veryOldprice != 0 && data[index].y != 0 && data[index].y != price) {
      veryOldprice = data[index].y;
      whenCr = "오전";
      break;
    }
  }

  return [veryOldprice, index, whenCr];
}

function setPrice() {
  var length = 0;
  var price = 0;
  var oldprice = 0;
  var veryOldprice;

  price = orangeData[length].z;
  if (price == 0)
    price = orangeData[length].y;

  oldprice = orangeData[length + 1].z;
  if (oldprice == 0)
    oldprice = orangeData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, orangeData);
  setPriceTag("#orange_price", price, oldprice, veryOldprice);

  price = orangeMangoData[length].z;
  if (price == 0)
    price = orangeMangoData[length].y;

  oldprice = orangeMangoData[length + 1].z;
  if (oldprice == 0)
    oldprice = orangeMangoData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, orangeMangoData);
  setPriceTag("#orangemango_price", price, oldprice, veryOldprice);

  price = appleData[length].z;
  if (price == 0)
    price = appleData[length].y;

  oldprice = appleData[length + 1].z;
  if (oldprice == 0)
    oldprice = appleData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, appleData);
  setPriceTag("#apple_price", price, oldprice, veryOldprice);

  price = safariData[length].z;
  if (price == 0)
    price = safariData[length].y;

  oldprice = safariData[length + 1].z;
  if (oldprice == 0)
    oldprice = safariData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, safariData);
  setPriceTag("#safari_price", price, oldprice, veryOldprice);

  price = fairyData[length].z;
  if (price == 0)
    price = fairyData[length].y;

  oldprice = fairyData[length + 1].z;
  if (oldprice == 0)
    oldprice = fairyData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, fairyData);
  setPriceTag("#fairy_price", price, oldprice, veryOldprice);

  price = alaskaData[length].z;
  if (price == 0)
    price = alaskaData[length].y;

  oldprice = alaskaData[length + 1].z;
  if (oldprice == 0)
    oldprice = alaskaData[length + 1].y;

  veryOldprice = getVeryOldPrice(price, alaskaData);
  setPriceTag("#alaska_price", price, oldprice, veryOldprice);
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
