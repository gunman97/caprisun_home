function getData() {
  ajaxRequest(function (r) {
    if(r.result == "success") {
      drawChart(r);
    }
  }, function() {});
}


var orangeData;
var orangeMangoData;
var appleData;
var safariData;
var fairyData;
var alaskaData;

function fillData(i, pr) {
  orangeData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("orange" in pr.data[0]) {
    orangeData[i].y = pr.data[0].orange;
  }
  if ("orange" in pr.data[1]) {
    orangeData[i].z = pr.data[1].orange;
  }

  orangeMangoData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("orange_mango" in pr.data[0]) {
    orangeMangoData[i].y = pr.data[0].orange_mango;
  }
  if ("orange_mango" in pr.data[1]) {
    orangeMangoData[i].z = pr.data[1].orange_mango;
  }

  appleData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("apple" in pr.data[0]) {
    appleData[i].y = pr.data[0].apple;
  }
  if ("apple" in pr.data[1]) {
    appleData[i].z = pr.data[1].apple;
  }

  safariData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("safari" in pr.data[0]) {
    safariData[i].y = pr.data[0].safari;
  }
  if ("safari" in pr.data[1]) {
    safariData[i].z = pr.data[1].safari;
  }

  fairyData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("fairy" in pr.data[0]) {
    fairyData[i].y = pr.data[0].fairy;
  }
  if ("fairy" in pr.data[1]) {
    fairyData[i].z = pr.data[1].fairy;
  }

  alaskaData[i] = {'x': pr.id, 'y': 0, 'z': 0};
  if ("alaska" in pr.data[0]) {
    alaskaData[i].y = pr.data[0].alaska;
  }
  if ("alaska" in pr.data[1]) {
    alaskaData[i].z = pr.data[1].alaska;
  }
}

function setPrice() {
  var length = orangeData.length - 1;
  $("#orange_price").text(orangeData[length].y);
  if ($("#orange_price").text == "0")
    $("#orange_price").text(orangeData[length].z);

  $("#orangemango_price").text(orangeMangoData[length].y);
  if ($("#orangemango_price").text == "0")
    $("#orangemango_price").text(orangeMangoData[length].z);

  $("#apple_price").text(appleData[length].y);
  if ($("#apple_price").text == "0")
    $("#apple_price").text(appleData[length].z);

  $("#safari_price").text(safariData[length].y);
  if ($("#safari_price").text == "0")
    $("#safari_price").text(safariData[length].z);

  $("#fairy_price").text(fairyData[length].y);
  if ($("#fairy_price").text == "0")
    $("#fairy_price").text(fairyData[length].z);

  $("#alaska_price").text(alaskaData[length].y);
  if ($("#alaska_price").text == "0")
    $("#alaska_price").text(alaskaData[length].z);
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
  var i = 0;
  var curLatest = 2000;
  var curLatestIdx = -1;
  data.forEach(function (pr) {
    if (pr.id > curLatest) {
      curLatestIdx = i;
      curLatest = pr.id;
    }
    fillData(i, pr);
    i++;
  });

  if ('dtime' in data[curLatestIdx].data[0]) {
    $("#gather_date").text(data[curLatestIdx].data[0].dtime);
  }

  if ('dtime' in data[curLatestIdx].data[1]) {
    $("#gather_date").text(data[curLatestIdx].data[1].dtime);
  }

  var hoverFunction = function (index, options, content, row) {
        return "날짜:" + row.x + "<br>" + "오전:" + row.y + "원 / 오후:" + row.z + "원";
  };

  orangeData.sort(function(a, b){return b.id - a.id});
  orangeMangoData.sort(function(a, b){return b.id - a.id});
  appleData.sort(function(a, b){return b.id - a.id});
  safariData.sort(function(a, b){return b.id - a.id});
  fairyData.sort(function(a, b){return b.id - a.id});
  alaskaData.sort(function(a, b){return b.id - a.id});


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
    $.ajax({url : "http://ec2-13-209-70-35.ap-northeast-2.compute.amazonaws.com/capri.php",
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
